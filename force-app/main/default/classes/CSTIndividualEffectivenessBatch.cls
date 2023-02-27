/**
 * CST - Report for Individual View - Client Engagement
 * - batch class executes the logic to update the fields used in the report.
 * <br/>EN-0777, US:1465, US-1495, US-1614
 *
 * @author Petr Svestka, Petr Roubal, Manoj Gupta
 * @date 24. 7. 2015
 */
public without sharing class CSTIndividualEffectivenessBatch implements Database.Batchable<SObject> {

    private static String query = 'SELECT id, name FROM User WHERE isActive = TRUE AND frozen_Account__c = FALSE AND name NOT IN (\'Integration User\', \'Security User\', \'Salesforce Administration\')';

    public List<CurrencyType> currTable = new List<CurrencyType>();
    public Map<String, Double> rateMap = new Map<String, Double>();
    public string corporateIsoCode = 'USD';

    private static final Integer THIS_YEAR = System.Datetime.now().year();

    private static final String ATTENDED = 'Attended';
    private static final string INTERNAL_MEETING = 'Internal';
    private static final string EXTERNAL_MEETING = 'External';
    private static final string CORE_CLIENT_TEAM_MEETING = 'Core Client Team Meeting';
    private static final String DAY_TO_DAY_MEETING = 'Day to Day Meeting';
    private static final String CLIENT_ENTERTAIMENT = 'Client Entertainment';
    private static final String CLIENT_MEETING= 'Client Meeting';
    private static final String CLIENT_ROADSHOW= 'Client Road Show';
    private static final String MARKETING_RESEARCH_UPDATE= 'Market Research Update';
    private static final String CLIENT_SERVICE_DISCUSSION = 'Client Service Discussion';
    private static final String CLIENT_CONFERENCE_CALL = 'Client Conference Call';
    private static final String CLIENT_SOCIAL = 'Client Social';
    private static final String CLIENT_TRAINING = 'Client Training';
    private static final String CLIENT_EMAIL = 'Client Email';
    private static final String CLIENT_CASE = 'CIB Client Case';
    private static final String CLOSED = 'Closed';
    private static final String COMPLETED = 'Completed';

    CSTEffectivenessBatch.currencyConverter converter; //todo refactor this to a helper class

    private class CSTReport{
        Id userId;
        DateTime userSummaryLastUpdate = DateTime.now();
        Integer internalCoreMeetingsAttended = 0;
        Integer internalDaytoDayMeetingsAttended = 0;
        Integer totalInternalCoreMeetings = 0;
        Integer totalInternalDaytoDayMeetings = 0;
        Integer opportunitiesFromInternalMeetings = 0;
        Integer externalCoreMeetingsAttended = 0;
        Integer externalDaytoDayMeetingsAttended = 0;
        Integer totalExternalCoreMeetings = 0;
        Integer totalExternalDaytoDayMeetings = 0;
        Integer opportunitiesFromExternalMeetings = 0;
        Integer closedClientCases = 0;
        Integer incompleteClientCases = 0;
        Integer incompleteTasks = 0;
        Integer completeTasks = 0;

        private CSTReport(User u) {
            this.userId = u.id;
        }
    }

    /**
     * Fetch the latest currency conversion rates.
     */
    private void snapCurrencyTable() {
        this.currTable = [SELECT isoCode
                ,conversionRate
        FROM CurrencyType
        LIMIT 300];

        for (CurrencyType c: currTable) {
            rateMap.put(c.isoCode, c.conversionRate);
        }
    }

    /**
     * Default constructor. Uses different query for test class.
     */
    public CSTIndividualEffectivenessBatch() {
        if(Test.isRunningTest()) {
            query = 'SELECT id, name FROM User WHERE isActive = TRUE AND frozen_Account__c = FALSE AND name NOT IN (\'Integration User\',\'Security User\', \'Salesforce Administration\') AND city!=NULL AND country!=NULL AND state!=NULL AND user_cib_global_area__c!=NULL AND user_division__c!=NULL AND business_unit__c!=NULL AND userType != \'Guest\' LIMIT 5';
        }
        //converter = new currencyConverter();
        corporateIsoCode = UserInfo.getDefaultCurrency();
        snapCurrencyTable();
    }

    /**
     * Gets invoked when the batch job executes and operates on one batch of records.
     * Contains or calls the main execution logic for the batch job.
     * @param bc Default param
     * @return the record set of Clients that meets specific criteria
     */
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(query);
    }

    /**
     * Method that fires Batch processing
     * @param bc Default param
     * @param scope Default param
     */
    public void execute(Database.BatchableContext bc, List<User> scope) {
        if(!scope.isEmpty()){

            List<User> modifiedUser = new List<User>();

            for (User u : scope){
                modifiedUser.add(enrichUser(u));
            }

            update modifiedUser;
        }
    }

    /**
     * Returns a given User object enriched with values for the CST Effectiveness - Individual report.
     * <p>
     * This method is public to allow easy testig of the enrichment logic.
     *
     * @param  u  a User to be enriched
     * @return    the enriched user u
     */
    public User enrichUser(User u){
        CSTReport report = new CSTReport(u);

        final Set<String> coreMeetingTypes = new Set<String> {CLIENT_ENTERTAIMENT, CLIENT_MEETING, CLIENT_ROADSHOW, MARKETING_RESEARCH_UPDATE, CLIENT_SERVICE_DISCUSSION};
        final Set<String> dayToDayMeetingTypes = new Set<String> {CLIENT_CONFERENCE_CALL, CLIENT_SOCIAL, CLIENT_TRAINING, CLIENT_EMAIL};

        List<Case> listOfClientCases = [select id, status, closeddate, recordtype.name
        from Case
        Where OwnerId = :u.id
        AND recordtype.name = :CLIENT_CASE
        AND accountid <> null];

        Set<Id> listOfEventReportIds = new Set<Id>();
        List<Opportunity> listOfOpportunities = new List<Opportunity>();

        //get all call reports connected to client
        List<Call_Report_Attendees__c> listOfEventReports = [SELECT id
                ,name
                ,status__c
                ,call_report__r.id
                ,call_report__r.meeting_audience__c
                ,call_report__r.Meeting_Purpose__c
                ,call_report__r.Core_Meeting__c 
                ,call_report__r.start__c
                ,call_report__r.relate_to_opp__r.primary_event_report_source__c
                ,call_report__r.related_to_case__r.recordtype.name
                ,call_report__r.related_to_case__r.ownerid
                ,call_report__r.related_to_case__r.status // IsClosed could be used too
                ,call_report__r.related_to_case__r.closeddate
                ,Contact_id__r.Owner.Name
                ,Contact_id__r.Name
                
        FROM Call_Report_Attendees__c
        WHERE Contact_id__r.Owner.id = :u.id AND CALENDAR_YEAR(call_report__r.start__c) = :THIS_YEAR];


        for (Call_Report_Attendees__c cra: listOfEventReports) {
        
            //if you are attandee (contact) and also owner of that contact -> means you are standards bank employee
            if(cra.Contact_id__r.Owner.Name == cra.Contact_id__r.Name){

                    if (cra.status__c == ATTENDED) {
                        
                        listOfEventReportIds.add(cra.call_report__r.id);

                        if (cra.call_report__r.meeting_audience__c == INTERNAL_MEETING
                                && cra.call_report__r.Meeting_Purpose__c == CORE_CLIENT_TEAM_MEETING && cra.call_report__r.Core_Meeting__c == true) {

                            report.internalCoreMeetingsAttended++;
                        }

                        if (cra.call_report__r.meeting_audience__c == INTERNAL_MEETING
                                && cra.call_report__r.Meeting_Purpose__c == DAY_TO_DAY_MEETING) {

                            report.internalDaytoDayMeetingsAttended++;
                        }

                        

                        if (cra.call_report__r.meeting_audience__c == EXTERNAL_MEETING
                                && coreMeetingTypes.contains(cra.call_report__r.Meeting_Purpose__c) && cra.call_report__r.Core_Meeting__c == true) {

                            report.externalCoreMeetingsAttended++;
                        }

                        if (cra.call_report__r.meeting_audience__c == EXTERNAL_MEETING
                                && dayToDayMeetingTypes.contains(cra.call_report__r.Meeting_Purpose__c)) {

                            report.externalDaytoDayMeetingsAttended++;
                        }
                    }

                    if (cra.call_report__r.meeting_audience__c == INTERNAL_MEETING
                            && cra.call_report__r.Meeting_Purpose__c == CORE_CLIENT_TEAM_MEETING && cra.call_report__r.Core_Meeting__c == true) {
                        report.totalInternalCoreMeetings++;
                    }

                    if (cra.call_report__r.meeting_audience__c == INTERNAL_MEETING
                            && cra.call_report__r.Meeting_Purpose__c == DAY_TO_DAY_MEETING) {
                        report.totalInternalDaytoDayMeetings++;
                    }

                    if (cra.call_report__r.meeting_audience__c == EXTERNAL_MEETING
                            && coreMeetingTypes.contains(cra.call_report__r.Meeting_Purpose__c) && cra.call_report__r.Core_Meeting__c == true) {

                        report.totalExternalCoreMeetings++;
                    }

                    if (cra.call_report__r.meeting_audience__c == EXTERNAL_MEETING
                            && dayToDayMeetingTypes.contains(cra.call_report__r.Meeting_Purpose__c)) {

                        report.totalExternalDaytoDayMeetings++;
                    }

            }

        }

        listOfOpportunities = [select id, primary_event_report_source__r.meeting_audience__c  from Opportunity where primary_event_report_source__c  in :listOfEventReportIds];

        for(Opportunity op : listOfOpportunities){
            if (op.Primary_Event_Report_Source__r.meeting_audience__c == INTERNAL_MEETING){
                report.opportunitiesFromInternalMeetings++;
            }else{
                report.opportunitiesFromExternalMeetings++;
            }
        }
        
                        
        for(Case c  : listOfClientCases){
                if (c.status == CLOSED
                    && c.closeddate.year() == THIS_YEAR) {

                    report.closedClientCases++;
                }
    
                if (c.status != CLOSED) {
                    report.incompleteClientCases++;
                }
        }

        report.completeTasks = [
                SELECT COUNT() FROM Task
                WHERE OwnerId = :u.Id
                AND Status = :COMPLETED
                AND ActivityDate = THIS_YEAR
                AND What.Type = :DMN_Account.OBJ_NAME
        ];

        report.incompleteTasks = [
                SELECT COUNT() FROM Task
                WHERE OwnerId = :u.Id
                AND Status != :COMPLETED
                AND What.Type = :DMN_Account.OBJ_NAME
        ];

        u.Internal_Core_Meetings_Attended__c = report.internalCoreMeetingsAttended;
        u.Internal_Day_to_Day_Meetings_Attended__c = report.internalDaytoDayMeetingsAttended;
        u.Total_Internal_Core_Meetings__c = report.totalInternalCoreMeetings;
        u.Total_Internal_Day_to_Day_Meetings__c = report.totalInternalDaytoDayMeetings;
        u.Opportunities_from_Internal_Meetings__c = report.opportunitiesFromInternalMeetings;
        u.External_Core_Meetings_Attended__c = report.externalCoreMeetingsAttended;
        u.External_Day_to_Day_Meetings_Attended__c = report.externalDaytoDayMeetingsAttended;
        u.Total_External_Core_Meetings__c = report.totalExternalCoreMeetings;
        u.Total_External_Day_to_Day_Meetings__c = report.totalExternalDaytoDayMeetings;
        u.Opportunities_from_External_Meetings__c = report.opportunitiesFromExternalMeetings;
        u.Closed_Client_Cases__c = report.closedClientCases;
        u.Incomplete_Client_Cases__c = report.incompleteClientCases;
        u.Incomplete_Tasks__c = report.incompleteTasks;
        u.Complete_Tasks__c = report.completeTasks;
        u.User_Summary_Last_Updated__c = report.userSummaryLastUpdate;

        return u;
    }

    /**
     * Gets invoked when the batch job finishes. Place any clean up code in this method.
     * @param bc Default param
     */
    @SuppressWarnings('PMD.EmptyStatementBlock')
    public void finish(Database.BatchableContext bc) {
        // empty
    }
}