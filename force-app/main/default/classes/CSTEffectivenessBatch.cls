/*************************************************************************
    @ Author        : Petr Roubal
    @ Test File     : CSTEffectivenessCronJob_Test
    @ Description   : EN-0695 CST - Report for CST Effectiveness, the batch Class to execute the logic for updating  / Inserting 
    @                 data for client effectiveness report

    @ Last Modified By  : Petr Svestka
    @ Last Modified On  : Aug 11, 2015
    @ Modification Description : added debug messages for lists' size()

    @ Last Modified By  : Petr Svestka
    @ Last Modified On  : Aug 17, 2015
    @ Modification Description : added workaround - query updates record not updated today and the batch automatically schedules itself if some records were missed (silently)
                                 made class Stateful -> will not reschedule if some record failed to update (e.g., due to a validation rule)

    @ Last Modified By  : Petr Svestka
    @ Last Modified On  : Aug 20, 2015
    @ Modification Description : emailing of the exception is added to the workaround
    
    @ Last Modified By  : Petr Roubal
    @ Last Modified On  : Aug 24, 2015
    @ Modification Description : changing filter in getTask section, suggested by SFDC PS

    @ Last Modified By  : Manoj Gupta
    @ Last Modified On  : July 15, 2016
    @ Modification Description : US:1465 Core Meeting Indicator included in the meeting criteria for this batch 
****************************************************************************/
global class CSTEffectivenessBatch implements Database.Batchable<sObject>, Database.Stateful {

    public string query;
    public List<CurrencyType> CurrTable = new List<CurrencyType>();
    public Map<String, Double> RateMap = new Map<String, Double>();
    public string corporateIsoCode = 'USD';

    private static final string INTERNAL_MEETING = 'Internal';
    private static final string EXTERNAL_MEETING = 'External';
    private static final string OPP_STAGE_CANCEL = 'Cancel';
    private static final String OPP_STAGE_LEAD = '1 - Lead';
    private static final String OPP_STAGE_DEVELOP = '2 - Develop';
    private static final string OPP_STAGE_CLOSED_LOST = '4 - Closed Lost';
    private static final string CORE_CLIENT_TEAM_MEETING = 'Core Client Team Meeting';
    private static final string CLIENT_ENTERTAIMENT = 'Client Entertainment';
    private static final string CLIENT_MEETING = 'Client Meeting';
    private static final string CLIENT_ROADSHOW = 'Client Road Show';
    private static final string MARKETING_RESEARCH_UPDATE = 'Market Research Update';
    

    private Boolean recordFailedToUpdate = false;
    private Integer emailsAlreadySent = 0;

    private Map<String,CSTTeamRoleRanking__c> coreTeamRoles;
    currencyConverter converter;

    global CSTEffectivenessBatch(){
        query = 'Select Id, Actual_CY_Revenue__c, CurrencyIsoCode, Client_Summary_Last_Updated__c, Core_Team_Members_on_External_Meetings__c,' +
            'Core_Team_Members_on_Internal_Meetings__c, External_Meetings_Completed__c, External_Meetings_Scheduled__c,' +
            'Internal_Meetings_Completed__c, Internal_Meetings_Scheduled__c, Number_of_Pipeline_Opportunities__c,' +
            'Number_of_Won_Opportunities__c, Opportunities_from_External_Meetings__c, Opportunities_from_Internal_Meetings__c, Pipeline_Opportunities_CY_Revenue__c,' +
            'Won_Opportunities_CY_Revenue__c from Account WHERE Client_Summary_Last_Updated__c < TODAY OR Client_Summary_Last_Updated__c = null';
        coreTeamRoles = CSTTeamRoleRanking__c.getAll();
        system.debug('##### coreTeamRoles ' + coreTeamRoles);
        converter = new currencyConverter();
        corporateIsoCode = UserInfo.getDefaultCurrency();
        snapCurrencyTable();
    }

    global Database.QueryLocator start(Database.BatchableContext BC)
    {
        return Database.getQueryLocator(query);
    }

    /**
     * Computes the values for the batch
     *
     * If some records fail to update (and throws a DmlException), this is stored into a stateful variable. The whole job will then not reschedule automatically.
     */
    global void execute(Database.BatchableContext BC,List<Account> scope)
    {
        system.debug('scope size: ' + scope.size());
        if(!scope.isEmpty()){
            List<Account> modifiedAccounts = new List<Account>();
            for (Account a : scope){
                modifiedAccounts.add(getData(a));
            }
            system.debug('modifiedAccount size: ' + modifiedAccounts.size());

            update modifiedAccounts;

        }
    }

    /**
     * Watch-dog function:
     * <ul>
     *   <li>If some records didn't update (e.g., due to a validation rule, etc.), the job ends.</li>
     *   <li>Otherwise, it checks whether there's more to be processed and if so, schedules itself to run in 10 minutes from now. (This is to prevent silent errors in production issue #12341188.)
     * </ul>
     */
    global void finish(Database.BatchableContext BC) {

        AsyncApexJob a = [Select Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedBy.Email from AsyncApexJob where Id = :BC.getJobId()];
        if (a.NumberOfErrors > 0) {


            // Send an email to the Apex job's submitter notifying of job completion.
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            Environment_Variable__c env = Environment_Variable__c.getInstance();
            String onErrorEmail = env.BatchErrorEmails__c;
            String[] toAddresses = new String[]{
                    onErrorEmail
            };
            mail.setToAddresses(toAddresses);
            mail.setSubject('CSTEffectivenessBatch  ' + a.Status);
            mail.setPlainTextBody('The batch Apex job processed ' + a.TotalJobItems +
                    ' batches with ' + a.NumberOfErrors + ' failures in OrgId ' + UserInfo.getOrganizationId() + ' .');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{
                    mail
            });

        }else {

            Integer cnt = [
                    SELECT COUNT()
                    FROM Account
                    WHERE Client_Summary_Last_Updated__c < TODAY
                    OR Client_Summary_Last_Updated__c = null
            ];

            if (cnt != null) {
                if (cnt > 0) {
                    system.debug('##### some records not processed - rescheduling job');

                    system.scheduleBatch(new CSTEffectivenessBatch(),
                            'CST Effectiveness Report Job (automat. scheduled)',
                            5, // minutesFromNow
                            10  // scopeSize
                    );
                } else {
                    system.debug('##### all batches finished successfully');
                }
            }
        }
    }

    public Account getData(Account a){
        Map<Id, Custom_Client_Team__c> mapCC = new Map<Id, Custom_Client_Team__c>([Select Id, Name from Custom_Client_Team__c where Account__c = : a.Id]);

        CSTReport report = new CSTReport();
        List<Call_Report__c> lst = getClientMeetings(a.Id);
        system.debug('##### ' + lst);
        for(Call_Report__c cr : lst){
            MeetingData md = new MeetingData();
            if(cr.End__c < Datetime.now())
                md.pastMeetings++;
            else
                md.futureMeetings++;

            md.opps = cr.Opportunities__r.size() > 0 ? cr.Opportunities__r.size() : 0;

            if(cr.Call_Report_Attendeess__r.size() > 0){
                for(Call_Report_Attendees__c cra : cr.Call_Report_Attendeess__r){
                    if(cra.Status__c == 'Attended' && coreTeamRoles.keySet().contains(cra.Client_Team_Role__c))
                        md.attendees++;
                }
            }

            if(cr.Meeting_Audience__c == INTERNAL_MEETING && cr.Meeting_Purpose__c == CORE_CLIENT_TEAM_MEETING){
                
                report.internal.futureMeetings += md.futureMeetings;    //future scheduled meeting should not check for Core Meeting value
                
                if (cr.Core_Meeting__c == true){
                report.internal.attendees += md.attendees;
                report.internal.pastMeetings += md.pastMeetings;
                report.internal.opps += md.opps;    
                }
               
                
            }else if((cr.Meeting_Audience__c == EXTERNAL_MEETING ) &&
                (cr.Meeting_Purpose__c == CLIENT_MEETING || cr.Meeting_Purpose__c == CLIENT_ENTERTAIMENT ||
                 cr.Meeting_Purpose__c == CLIENT_ROADSHOW || cr.Meeting_Purpose__c == MARKETING_RESEARCH_UPDATE)){
                    report.external.futureMeetings += md.futureMeetings;    //future scheduled meeting should not check for Core Meeting value
                
                    if(cr.Core_Meeting__c == true){
                    report.external.attendees += md.attendees;
                    report.external.pastMeetings += md.pastMeetings;
                    report.external.opps += md.opps;                
                          
                      }

            }
        }

        List<Id> lstIds= new List<Id>();
        lstIds.add(a.Id);

        List<Id> hierarchyIds = getAccountHierarchy(lstIds);

        List<Opportunity> lstOpp = getClientOpenOpps(hierarchyIds);
        report.piplineOpps = lstOpp.size();

        for (Opportunity o: lstOpp) {
            if(o.Current_Year_Revenue_Currency__c != null){
                system.debug('##### o.Current_Year_Revenue_Currency__c='+  o.Current_Year_Revenue_Currency__c + ' corporateIsoCode=' + corporateIsoCode + ' Ratemap=' + RateMap + ' Client currencyIsoCode ' + a.CurrencyIsoCode);
                report.oppRevenue = report.oppRevenue + converter.convert(Double.valueOf(o.Current_Year_Revenue_Currency__c), corporateIsoCode, RateMap, a.CurrencyIsoCode);
            }
        }

        for (Opportunity o : getClientCurrentWonOpps(hierarchyIds)) {
            report.winOpp++;
            if (o.Current_Year_Revenue_Currency__c != null) {
                system.debug('##### o.Current_Year_Revenue_Currency__c=' + o.Current_Year_Revenue_Currency__c + ' corporateIsoCode=' + corporateIsoCode + ' Ratemap=' + RateMap + ' Client currencyIsoCode ' + a.CurrencyIsoCode);
                report.oppCloseRev = report.oppCloseRev + converter.convert(Double.valueOf(o.Current_Year_Revenue_Currency__c), corporateIsoCode, RateMap, a.CurrencyIsoCode);
            }
        }

        report.revenue = getClientRevenue(a.Id);

        a.Actual_CY_Revenue__c = report.revenue;
        a.Client_Summary_Last_Updated__c = DateTime.now();
        a.Core_Team_Members_on_External_Meetings__c = report.external.attendees;
        a.Core_Team_Members_on_Internal_Meetings__c = report.internal.attendees;
        a.External_Meetings_Completed__c = report.external.pastMeetings;
        a.External_Meetings_Scheduled__c = report.external.futureMeetings;
        a.Internal_Meetings_Completed__c = report.internal.pastMeetings;
        a.Internal_Meetings_Scheduled__c = report.internal.futureMeetings;
        a.Number_of_Pipeline_Opportunities__c = report.piplineOpps;         // all time
        a.Number_of_Won_Opportunities__c = report.winOpp;                   // this year
        a.Opportunities_from_External_Meetings__c = report.external.opps;
        a.Opportunities_from_Internal_Meetings__c = report.internal.opps;
        a.Pipeline_Opportunities_CY_Revenue__c = report.oppRevenue;         // all time
        a.Won_Opportunities_CY_Revenue__c = report.oppCloseRev;             // this year

        system.debug('##### ' + report);
        return a;
    }
    
   /*******************
    * Private methods *
    *******************/

    private List<Call_Report__c> getClientMeetings(Id clientId){

        List<Call_Report__c> lstCR = [Select Id, Meeting_Purpose__c, Meeting_Audience__c,Core_Meeting__c, Start__c, End__c, (Select Id From Opportunities__r), (Select  Id, Status__c, Client_Team_Role__c From Call_Report_Attendeess__r)
        FROM Call_Report__c
        where Relate_to_Client__c = :clientId
        and End__c = THIS_YEAR
        and (Meeting_Audience__c = :INTERNAL_MEETING or Meeting_Audience__c = :EXTERNAL_MEETING)];
        return lstCR;
    }

    private List<Id> getAccountHierarchy(List<Id> clientIds){
        List<Id> retIds = new List<Id>();

        Account[] lstAcc = [Select Id, (Select Id,Name From ChildAccounts) FROM Account where Id IN : clientIds];
        for(Account a : lstAcc){
            if(a.ChildAccounts != null && a.ChildAccounts.size() > 0){
                Map<Id,Account> mapAcc = new Map<Id,Account>(a.ChildAccounts);
                List<Id> ids = new List<Id>();
                ids.addAll(mapAcc.keySet());
                retIds.addAll(getAccountHierarchy(ids));
            }
            retIds.add(a.Id);
        }
        return retIds;
    }

    private List<Opportunity> getClientOpenOpps(List<Id> clientIds){
        system.debug('#### clientIds ' + clientIds);
        List<Opportunity> lstOpp = [SELECT Id
            ,CurrencyIsoCode
            ,convertCurrency(Current_Year_Revenue_Currency__c)
        FROM Opportunity
        WHERE AccountId IN :clientIds
        AND StageName IN (:OPP_STAGE_LEAD, :OPP_STAGE_DEVELOP)];
        system.debug('#### lstOpp open Opps' + lstOpp);
        return lstOpp != null ? lstOpp : new List<Opportunity>();
    }

    //JL: changed closeDate -> Actual_Close_Date__c
    private List<Opportunity> getClientCurrentWonOpps(List<Id> clientIds){
        List<Opportunity> lstOpp = [SELECT CurrencyIsoCode
            ,convertCurrency(Current_Year_Revenue_Currency__c)
            ,AccountId
        FROM Opportunity
        WHERE Actual_Close_Date__c = THIS_YEAR
        AND AccountId IN :clientIds
        AND isWon = TRUE
        AND isClosed = TRUE];
        system.debug('#### lstOpp current Opps' + lstOpp);
        return lstOpp;
    }

    private decimal getClientRevenue(Id clientId){
        AggregateResult[] groupedResults = [Select SUM( g.Client_Value_ZAR_Current_Year__c)sumRev From Global_Client_Revenue__c g where g.Client__c = :clientId];

        return (decimal) groupedResults[0].get('sumRev') != null ? (decimal) groupedResults[0].get('sumRev') : 0;
    }

    //Method that pulls the latest currency conversion rates.
    private void snapCurrencyTable() {

        this.CurrTable = [Select cur.IsCorporate, cur.IsoCode, cur.ConversionRate From CurrencyType cur];

        for (CurrencyType c: CurrTable) {
            RateMap.put(c.IsoCode, c.ConversionRate);
        }
    }

    public class CSTReport{
        Id clinetId;
        MeetingData internal;
        MeetingData external;
        Integer incomplTask;
        Integer complTask;
        Integer piplineOpps;
        Decimal oppRevenue;
        Integer winOpp;
        Decimal oppCloseRev;
        Decimal revenue;

        public CSTReport(){
            internal = new MeetingData();
            external = new MeetingData();
            piplineOpps = 0;
            oppRevenue = 0;
            winOpp = 0;
            oppCloseRev = 0;
            revenue = 0;
        }
    }

    public class MeetingData{
        Integer attendees;
        Integer pastMeetings;
        Integer futureMeetings;
        Integer opps;

        public MeetingData(){
            attendees = 0;
            pastMeetings = 0;
            futureMeetings = 0;
            opps = 0;
        }
    }

    //CURRENCY CONVERSION CLASS
    public class currencyConverter {

        public currencyConverter() {}

        public Decimal convert(Decimal val, String oldCurr, Map < String, Double > RateMap, String newCurr) {
            //NOTE ON CALCULATION:
            //(current curr / current rate) = USD(1:1) 
            //(USD * new rate) = new curr value

            // No point in trying to convert a null.
            if (val == null) return 0;
            Decimal displayVal;

            if ((oldCurr != newCurr) || (val != 0)) {

                Double oldrate = RateMap.get(oldCurr);
                Decimal usdval = (val / oldrate);
                Double newrate = RateMap.get(newCurr);

                displayVal = (usdval * newrate);

            } else {
                displayVal = val;
            }
            return displayVal;
        }
    }

}