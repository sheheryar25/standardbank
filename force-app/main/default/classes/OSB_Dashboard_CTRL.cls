/**
* Controller class for OSBDashboard aura component
*
* @author Wojciech Kowalczyk (wkowalczyk@deloittece.com)
* @date June 2020
*/
public with sharing class OSB_Dashboard_CTRL {
    /**
* Checks if the user has been logged in for the first time for guided tour
*
* @return contact related to current user
**/
    @AuraEnabled(Cacheable=true)
    public static Contact getOnboardingDetails() {
        try{
            if (UTL_User.isLoggedInUser()) {
                return SEL_Contacts.newInstance().selectByUserId(new Set<Id>{UserInfo.getUserId()})[0];
            }
            return null;
        }
        catch(Exception ex){
            return null;
        }
    }
    
    /**
* Gets a list of solutions that a user is subscribed to
*
* @return List<Knowledge__kav> register applications
**/
    @AuraEnabled(Cacheable=true)
    public static List<Subscribed_Solutions__c> getRegisteredApplication() {
        return SEL_SubscribedSolutions.newInstance().selectByUserId(new Set<Id>{UserInfo.getUserId()});
    }
    
    /**
* Sets the user contact Onboarding_Tour_Date__c to current date time
*
* @param contactId id of contact
*
* @return String
**/
    @AuraEnabled(Cacheable=false)
    public static void setUserContactOnboardingDate(Id contactId) {
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        OSB_SRV_OnboardingHandler.newInstance().setUserContactOnboardingDate(new Set<Id>{contactId}, uow);
        uow.commitWork();
    }
    
    /**
* Checks if user has any registered device
*
* @return Map<String,Map<String,Object>> that contains the device details  */
    @AuraEnabled(Cacheable=true)
    public static Map<String,Map<String,Object>> hasRegisteredDevices(){
        Boolean hasRegisteredDevices;
        Map<String,Map<String,Object>> deviceHeaders2Values = OSB_SRV_NoknokIntegration.newInstance().getDeviceList();
        
        return deviceHeaders2Values; 
    }
    
}