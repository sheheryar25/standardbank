/*************************************************************************\
    @ Author        :     Anurag Jain
    @ Date          :     21 June 2011 
    @ Test File     :     UserClassAndTriggerTests
    @ Description   :     General Trigger for User object.
                          Following coding principals set out by 
                          CRM IT Developer team 
                          All trigger code will be updated here going forward
                          More information will be on the Classes specified

    @ Last Modified By  : Anurag Jain    
    @ Last Modified On  : 17 August 2011
    @ Last Modified Reason  : The users were encountering the Mixed DMl operation error while 
                              updating the user records who is the owner of any open case. 
                              To fix the error the instead of sending Map(Id,User) to method 'handleUserBeforeUpdateTrigger' Set<ID> is sent  
                              
    @ Last Modified By  : Balabramham.y    
    @ Last Modified On  : 23 August 2011
    @ Last Modified Reason  : case -2039 :Before inserting the user ids in set , i am comaparing new valu with old value.
                              variable name modified usr to userInfo.

    @ Last Modified By  : Petr Svestka
    @ Last Modified On  : Aug 11, 2015
    @ Modification Description : Force.com reviewer - Blocker and Critical issues - 20150608.xlsx
    
    @ Last Modified By  :     Abhishek V
    @ Last Modified On  :     08 Mar 2016
    @ Description       :     EN - 1168: Calling new method described in UserTriggerUtility_Oppty class 
                              to set the Opportunity Owner user fields based on the User Object custom fields when User record is edited.
                              
    @ Last Modified By  :     Jana Cechova
    @ Last Modified On  :     4 Nov 2016
    @ Description       :     US-1655: OB: Delegated Approver for Client Onboarding. Users (except Admin) are not able to change Delegated Approver.
****************************************************************************/
trigger UserTrigger on User (after insert, after update, before update, before insert) {
    
    if(Trigger.isBefore){
        if (Trigger.isUpdate) {
            //Get current user Profile
            //List<Profile> profileOfCurrUser = [SELECT Id, Name FROM Profile WHERE Id=:userinfo.getProfileId() LIMIT 1];
            String profileOfCurrUser = UTL_Profile.getProfileName(userinfo.getProfileId());
            for (User userInfo : Trigger.new) {
                User oldUserInfo = System.Trigger.oldMap.get(userInfo.Id);
                if((profileOfCurrUser != 'System Administrator' && profileOfCurrUser != 'Business Administrator') && (oldUserInfo.DelegatedApproverId != userInfo.DelegatedApproverId)){
                    userInfo.DelegatedApproverId.addError(Label.Delegated_Approver_Error);
                } 
            }
        }
    }
    
    if (Trigger.isAfter) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            //Create a list of USERS to send to FUTURE Class
            List<Id> lUser = new List<Id>();
            Set<Id> newOSBUserIdSet = new Set<Id>(); 
            //Create a new Contact or Link an existing Contact to this USER record
            //loop through USER records
            for (User u : Trigger.new) {
                if (UserTriggerUtility.needsContactUpdate(u, Trigger.isInsert, Trigger.oldMap)) {
                    lUser.add(u.Id);
                }
                if (Trigger.isInsert && u.ProfileId==UTL_Profile.getProfileId(DMN_Profile.ONE_HUB_COMMUNITY)){
                    newOSBUserIdSet.add(u.Id);
                }
            }
            if(newOSBUserIdSet.size()>0){
                UserTriggerUtility.handleWelcomeNotificationInsert(newOSBUserIdSet);
            }
            //Send list to FUTURE class
            if (!User_BankContact_Sync_HelperClass.hasAlreadySyncContact() && !lUser.isEmpty()) {
                
                User_BankContact_Sync_HelperClass.setAlreadySyncContact();
                
                try {
                    User_BankContact_Sync_Future.Main(lUser);
                } catch (System.AsyncException e) {
                    SRV_Logger.newInstance().log(e, DMN_Log.TYPE_ERROR, 'UserTrigger');
                }
            }
        }
        
        
        
        if (Trigger.isUpdate) {
            Map<Id, User> usersMap = new Map<Id, User>();
            Map<Id, User> usersOpptyMap = new Map<Id, User>();
            for (User userInfo : Trigger.new) {
                User oldUserInfo = System.Trigger.oldMap.get(userInfo.Id);
                
                if (oldUserInfo.User_CIB_Global_Area__c != userInfo.User_CIB_Global_Area__c || oldUserInfo.User_Division__c != userInfo.User_Division__c
                    || oldUserInfo.Business_Unit__c != userInfo.Business_Unit__c || oldUserInfo.User_Team__c != userInfo.User_Team__c
                    || oldUserInfo.City != userInfo.city || oldUserInfo.State != userInfo.State || oldUserInfo.Country != userInfo.Country
                   ) {

                    usersMap.put(userInfo.Id, userInfo);
                   }
                
                if (oldUserInfo.User_CIB_Global_Area__c != userInfo.User_CIB_Global_Area__c || oldUserInfo.User_Division__c != userInfo.User_Division__c
                    || oldUserInfo.Business_Unit__c != userInfo.Business_Unit__c || oldUserInfo.User_Team__c != userInfo.User_Team__c
                    || oldUserInfo.City != userInfo.city || oldUserInfo.State != userInfo.State || oldUserInfo.Country != userInfo.Country 
                    || oldUserInfo.User_Franco__c != userInfo.User_Franco__c ) {

                    usersOpptyMap.put(userInfo.Id, userInfo);
                    }
            }
            
            if (usersMap.size() > 0) {
                UserTriggerUtility.handleUserBeforeUpdateTrigger(usersMap);
            }
            
            if (usersOpptyMap.size() > 0) {
                UserTriggerUtility_Oppty.handleUserBeforeUpdateTrigger_Oppty(usersOpptyMap);
            }
        }
    }
    
}