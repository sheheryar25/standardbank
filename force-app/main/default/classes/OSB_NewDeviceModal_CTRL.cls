/**
* This is the server side controller class for NewDeviceModal aura component
* 
* @author Rasmi Panthangi (rasmi.panthangi@tetrad.co.za)
* @date April 2021
* 
*/
public without sharing class OSB_NewDeviceModal_CTRL {
    public static final String MFA_UPDATED_SUCCESS = 'not_showing';
    public static final String MFA_UPDATED_FAILURE = 'not_updated';
    
    /**
* Checks if the current user is login to community
*
* @return Boolean
**/    
    @AuraEnabled(Cacheable=true)
    public static Boolean isUserLoggedIn() {
        return UTL_User.isLoggedInUser();
    }
    
    /**
* Gets the qrcode details for the user to register for MFA.
*
* @return Map<String, String>
**/    
    @AuraEnabled
    public static Map<String, String> getQrCodeDetails(){
        Map<String, String> registrationHeaders2Values = OSB_SRV_NoknokIntegration.newInstance().getNoknokQrCode();
        return registrationHeaders2Values;
    }
    
    /**
* Gets the status of the MFA registration.
* @param String  
* @return Map<String, String>
**/
    @AuraEnabled
    public static Map<String, String> getStatusofRegistration(String oobStatusHandle){
        Map<String, String> statusHeaders2values = OSB_SRV_NoknokIntegration.newInstance().getRegistrationStatus(oobStatusHandle);
        return statusHeaders2values;
    }
    
    /**
* Updates the user contact in the org if they don't want to be prompted to register for MFA on dashboard everytime they login
* @return String
**/ 
    @AuraEnabled
    public static String flagContact(){
        Contact userContact = new Contact();
       fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        try{
            if (UTL_User.isLoggedInUser()) {
                userContact = SEL_Contacts.newInstance().selectByUserId(new Set<Id>{UserInfo.getUserId()})[0];
            }
        }catch(Exception ex){
            OSB_SRV_ActionFailureHandler.newInstance().handleError(ex, OSB_NewDeviceModal_CTRL.class.getName());
            return MFA_UPDATED_FAILURE; 
        }
        userContact.OSB_HideMFA__c = true;
        uow.registerDirty(userContact); 
	    uow.commitWork();
        return MFA_UPDATED_SUCCESS;
    }
}