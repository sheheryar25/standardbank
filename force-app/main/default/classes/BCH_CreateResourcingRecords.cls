/**
 * @description Batch for creating
 *
 * @author Konrad Bruszewski
 * @date June 2021
 */
public with sharing class BCH_CreateResourcingRecords implements Database.Batchable<SObject>, Database.Stateful {

    private static final String
            RESULT_HEADERS                    = '"Opportunity__c","Resource__c","Time_Spent__c","Intensity_Forecast__c","RecordTypeId","OwnerId","Week_End_Date__c","Opportunity_Type__c","Errors"\n',
            RESULT_ROW_TEMPLATE               = '"{0}","{1}","{2}","{3}","{4}","{5}","{6}","{7}","{8}"\n',
            RESULT_FILE_NAME                  = 'Batch_Job_{0}_Failed_Records.csv',
            RESULT_CONTENT_TYPE               = 'text/csv',
            OPPORTUNITY_RESOURCING            = 'Opportunity_Resourcing',
            CRM_HELPDESK_SB_PARAMETER_NAME    = 'CRMHelpdeskEmail',
            QUERY_CONDITION                   = 'IsActive__c = \'True\' AND Opportunity.StageName IN (\'1 - Lead\', \'2 - Develop\') ' +
                    'AND User_Business_Unit__c = \'Corporate Finance\'',
            EMAIL_SUBJECT                     = 'Batch BCH_CreateResourcingRecords failures',
            EMAIL_BODY_TEMPLATE               = 'Attached to this email are Resourcing__c records for which creation has failed during the batch process.<br/>Batch job Id: {0}<br/>ORG Id: {1}';

    private Date lastWeekFriday {
        get {
            if (lastWeekFriday == null) {
                lastWeekFriday = UTL_Resourcing.getLastWeekFridayDate();
            }
            return lastWeekFriday;
        }
        set;
    }

    private String oppResourcingRecordTypeId {
        get {
            if (oppResourcingRecordTypeId == null) {
                oppResourcingRecordTypeId = getOppResourcingRecordType();
            }
            return oppResourcingRecordTypeId;
        }
        set;
    }

    private Map<Resourcing__c, List<String>> failedRec2ErrorMessage = new Map<Resourcing__c, List<String>>();

    /**
    * Overridden start Batchable method
    *
    * @param bcContext default reference to Database.BatchableContext
    * @return QueryLocator object for a SELECT query
    */
    public Database.QueryLocator start(Database.BatchableContext bcContext) {
        SEL_OpportunityTeamMembers selOppTeamMembers = (SEL_OpportunityTeamMembers) ORG_Application.selector.newInstance(OpportunityTeamMember.SObjectType);
        return Database.getQueryLocator(selOppTeamMembers.getQueryWithCustomCondition(QUERY_CONDITION));
    }

    /**
    * Overridden execute Batchable method
    *
    * @param bcContext default reference to Database.BatchableContext
    * @param oppMembers list of OpportunityTeamMember records
    */
    public void execute(Database.BatchableContext bcContext, List<OpportunityTeamMember> oppMembers) {
        Set<Id> opportunityIds = new Set<Id>();
        Map<String, Resourcing__c> opportunityAndResource2Resourcing = new Map<String, Resourcing__c>();
        List<Resourcing__c> resourcingRecordsToInsert = new List<Resourcing__c>();

        getOpportunityIds(oppMembers, opportunityIds);
        SEL_Resourcing resourcingSelector = (SEL_Resourcing) ORG_Application.selector.newInstance(Resourcing__c.SObjectType);
        List<Resourcing__c> lastWeekResourcingRecords = resourcingSelector.selectByOpportunityAndWeekEndDate(opportunityIds, lastWeekFriday.addDays(-7));
        populateOpportunityAndResource2ResourcingMap(lastWeekResourcingRecords, opportunityAndResource2Resourcing);
        createRecords(resourcingRecordsToInsert, oppMembers, opportunityAndResource2Resourcing);

        List<Database.SaveResult> saveResults = Database.insert(resourcingRecordsToInsert, false);
        handleSaveResults(resourcingRecordsToInsert, saveResults);
    }

    /**
     * Overridden finish Batchable method
     *
     * @param bcContext
     */
    public void finish(Database.BatchableContext bcContext) {
        if (failedRec2ErrorMessage.size() > 0) {
            sendEmails(bcContext);
        }
    }

    private void sendEmails(Database.BatchableContext bcContext) {
        List<Messaging.SingleEmailMessage> emails = createEmail(bcContext);
        if (!Test.isRunningTest()) {
            Messaging.sendEmail(emails);
        }
    }

    private String getOppResourcingRecordType() {
        return Resourcing__c.getSObjectType().getDescribe().getRecordTypeInfosByDeveloperName().get(OPPORTUNITY_RESOURCING).recordTypeId;
    }

    private void handleSaveResults(List<Resourcing__c> resourcingRecordsToInsert, List<Database.SaveResult> saveResults) {
        for (Integer i = 0; i < saveResults.size(); i++) {
            if (!saveResults.get(i).isSuccess()) {
                List<String> errorMessages = new List<String>();
                for (Database.Error err : saveResults.get(i).getErrors()) {
                    errorMessages.add(err.getStatusCode() + ': ' + err.getMessage());
                }
                failedRec2ErrorMessage.put(resourcingRecordsToInsert.get(i), errorMessages);
            }
        }
    }

    private void createRecords(List<Resourcing__c> resourcingRecordsToInsert, List<OpportunityTeamMember> oppMembers, Map<String, Resourcing__c> opportunityAndResource2Resourcing) {
        Set<Id> userIds = new Set<Id>();
        for (OpportunityTeamMember teamMember : oppMembers) {
            userIds.add(teamMember.UserId);
        }
        Set<Id> usersWithResourcingPermissionSet = UTL_Resourcing.getUsersWithPermissionSetAssigned(userIds);
        for (OpportunityTeamMember oppTeamMember : oppMembers) {
            if(usersWithResourcingPermissionSet.contains(oppTeamMember.UserId)){
                resourcingRecordsToInsert.add(new Resourcing__c(
                        Opportunity__c = oppTeamMember.OpportunityId,
                        Resource__c = oppTeamMember.UserId,
                        Time_Spent__c = 0,
                        Intensity_Forecast__c = 'Inactive',
                        RecordTypeId = oppResourcingRecordTypeId,
                        OwnerId = oppTeamMember.UserId,
                        Week_End_Date__c = lastWeekFriday,
                        Opportunity_Type__c = opportunityAndResource2Resourcing.get('' + oppTeamMember.OpportunityId + oppTeamMember.UserId)?.Opportunity_Type__c
                ));
            }
        }
    }

    private void getOpportunityIds(List<OpportunityTeamMember> oppMembers, Set<Id> opportunityIds) {
        for (OpportunityTeamMember oppMember : oppMembers) {
            opportunityIds.add(oppMember.OpportunityId);
        }
        opportunityIds.remove(null);
    }

    private void populateOpportunityAndResource2ResourcingMap(List<Resourcing__c> lastWeekResourcingRecords, Map<String, Resourcing__c> opportunityAndResource2Resourcing) {
        for (Resourcing__c resourcing : lastWeekResourcingRecords) {
            String compoundKey = '' + resourcing.Opportunity__c + resourcing.Resource__c;
            opportunityAndResource2Resourcing.put(compoundKey, resourcing);
        }
    }

    private List<Messaging.SingleEmailMessage> createEmail(Database.BatchableContext bcContext) {
        SB_Parameters__c crmHelpdeskEmail = SB_Parameters__c.getValues(CRM_HELPDESK_SB_PARAMETER_NAME);
        String toAddress;
        if (crmHelpdeskEmail != null) {
            toAddress = crmHelpdeskEmail.Value__c;
        }
        String subject = EMAIL_SUBJECT;
        String body = String.format(EMAIL_BODY_TEMPLATE, new List<String>{
                bcContext?.getJobId(), UserInfo.getOrganizationId()
        });
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>{
                UTL_Email.createEmails(subject, body, new List<String>{
                        toAddress
                })
        };
        emails.get(0).setFileAttachments(new List<Messaging.EmailFileAttachment>{
                createEmailAttachment(bcContext)
        });
        return emails;
    }

    private Messaging.EmailFileAttachment createEmailAttachment(Database.BatchableContext bcContext) {
        String fileBody = RESULT_HEADERS;
        for (Resourcing__c res : failedRec2ErrorMessage.keySet()) {
            fileBody += createRow(res);
        }
        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
        attachment.setBody(Blob.valueOf(fileBody));
        attachment.setContentType(RESULT_CONTENT_TYPE);
        attachment.setFileName(String.format(RESULT_FILE_NAME, new List<String>{
                bcContext?.getJobId()
        }));
        return attachment;
    }

    private String createRow(Resourcing__c res) {
        String errorMessages = '';
        for (String errorMsg : failedRec2ErrorMessage.get(res)) {
            errorMessages += errorMsg + '       ';
        }
        return String.format(RESULT_ROW_TEMPLATE, new List<String>{
                res.Opportunity__c,
                res.Resource__c,
                String.valueOf(res.Time_Spent__c),
                res.Intensity_Forecast__c,
                res.RecordTypeId,
                res.OwnerId,
                String.valueOf(res.Week_End_Date__c),
                res.Opportunity_Type__c,
                errorMessages
        });
    }
}