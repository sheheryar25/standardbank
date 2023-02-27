/**
* @description  : Controller for Client Related Revenues LWC Component
* User Story : SFP-7470
*
* @author Michal Pesko (mpesko@deloittece.com)
* @date October 2021
*/
public with sharing class CRT_clientRelatedRevenues_CTRL {
    /**
    * @description  : Aura Enabled method for getting Global Client Revenues by Account
    * @param clientId - Id of Account
    * @return List of client related Global Revenues
    */
    @AuraEnabled(Cacheable=true)
    public static List<DataTableWrapper> getRelatedRevenues(Id clientId) {
        RecordType crtRecordType = [SELECT Id, Name FROM RecordType
        WHERE Name = 'CRT Global Client Revenue'];
        List<Global_Client_Revenue__c> revenues =  [SELECT Id, CRT_Department__c, CRT_BookingCountry__c, CRT_AverageCreditBalanceYTDZAR__c, CRT_AverageDebitBalanceYTDZAR__c, CRT_ActualRevenueYTDZAR__c,CRT_GCRName__c
        FROM Global_Client_Revenue__c
        WHERE Client__c = :clientId
        AND RecordTypeId = :crtRecordType.Id];

        List<DataTableWrapper> wrappers = new List<DataTableWrapper>();
        for(Global_Client_Revenue__c revenue: revenues){
            DataTableWrapper wrapper = new DataTableWrapper();
            wrapper.department = revenue.CRT_Department__c;
            wrapper.gcrName = 'View Details';
            wrapper.nameUrl = '/' + revenue.Id;
            wrapper.bookingCountry = revenue.CRT_BookingCountry__c;
            wrapper.averageCreditBalanceYTDZAR = revenue.CRT_AverageCreditBalanceYTDZAR__c?.setScale(2).format();
            wrapper.averageDebitBalanceYTDZAR = revenue.CRT_AverageDebitBalanceYTDZAR__c?.setScale(2).format();
            wrapper.actualRevenueYTDZAR = revenue.CRT_ActualRevenueYTDZAR__c?.setScale(2).format();
            wrappers.add(wrapper);
        }
        return wrappers;
    }

    /**
    * @description  : Aura Enabled method to check if user is assigned to CRT Permission Set
    * @param userId - Id of User
    * @param clientId - Id of Account
    * @return Boolean answer
    */
    @AuraEnabled(Cacheable=true)
    public static Boolean hasUserAccessToRevenues(Id userId, Id clientId){
        return (isUserAssignedToCrtPermissionSet(userId) && isUserInClientTeam(userId, clientId))|| isUserAdminProfile(userId);
    }

    private static Boolean isUserAssignedToCrtPermissionSet(Id userId){
        List<PermissionSetAssignment> assignments = [SELECT Id, AssigneeId
        FROM PermissionSetAssignment
        WHERE PermissionSet.Name = 'CRT_Global_Revenue_Permission_Set' AND AssigneeId = :userId];

        return assignments.size()>0;
    }

    private static Boolean isUserAdminProfile(Id userId){
        User user = SEL_Users.newInstance().selectById(new Set<Id>{userId}).get(0);
        List<String> profileAdmins = new List<String>{
                'System Administrator',
                'System Administrator - Premier Support',
                'Business Administrator'
        };
        List<Profile> profiles = SEL_Profiles.newInstance().selectByIdAndNames(new Set<Id>{user.ProfileId}, profileAdmins);
        return !profiles.isEmpty();
    }

    private static Boolean isUserInClientTeam(Id userId, Id clientId){
        List<Custom_Client_Team__c> clientTeams = SEL_ClientTeams.newInstance().selectByTeamMemberAndAccount(userId, clientId);
        return !clientTeams.isEmpty();
    }

    /**
    * @description  : Private Class to wrap Global Client Revenues details
    */
    @TestVisible
    private class DataTableWrapper {
        @AuraEnabled
        public String department {get;set;}
        @AuraEnabled
        public String gcrName {get;set;}
        @AuraEnabled
        public String nameUrl {get;set;}
        @AuraEnabled
        public String bookingCountry {get;set;}
        @AuraEnabled
        public String averageCreditBalanceYTDZAR {get;set;}
        @AuraEnabled
        public String averageDebitBalanceYTDZAR {get;set;}
        @AuraEnabled
        public String actualRevenueYTDZAR {get;set;}
    }
}