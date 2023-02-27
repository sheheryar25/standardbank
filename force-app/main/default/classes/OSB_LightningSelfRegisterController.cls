/**
 * Controller class for OSB_Registration component
 *
 * @author Wayde Fagan (wayde.fagan@tetrad.co.za)
 * @date April 2020
 *
 **/
public without sharing class OSB_LightningSelfRegisterController {
	public static final String ONEHUB_SSO_CUSTOM = 'OSB_SSO';
    public static final String ONEHUB_BASE_CUSTOM = 'OSB_Base_URL';
    public static final String COUNTRY_CODES = 'countryCodes';
    public static final String OPERATING_COUNTRIES = 'operatingCountries';
    public static final String DP_ROLE = 'Designated Person';
    public static final String NP_ROLE = 'Nominated Person';
    public static Contact signUpContact;

    /**
     * Checks the password if it is valid
     *
     * @param password user password
     * @param confirmPassword is compared with password
     *
     * @return true if passwords are matching, otherwise false
     **/
    public static Boolean isValidPassword(String password, String confirmPassword) {
        return password == confirmPassword;
    }
    
    /**
     * Checks if the community is a site container
     *
     * @param communityUrl String
     *
     * @return Boolean
     **/
    public static boolean siteAsContainerEnabled(String communityUrl) {
        Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(communityUrl,'');
        return authConfig.isCommunityUsingSiteAsContainer();
    }

    /**
     * Checks the password if it is valid
     *
     * @param   u user which should have its password validated
     * @param   password password to be verified
     * @param   confirmPassword repeated password
     */
    @TestVisible 
    public static void validatePassword(User u, String password, String confirmPassword) {
        if(!Test.isRunningTest()) {
            Site.validatePassword(u, password, confirmPassword);
        }
        return;
    }
    
    /**
     * Creates a new user in ping directory
     * 
     * @param newContact Contact
     * @param password String of users password
     * @param idNum String of user id number
     *
	 * @return pingId ID of the newly created ping user 
     **/
    @AuraEnabled
    public static String sendDataToPing(Contact newContact, String password, String idNum){
        String pingId = null;
        String accessToken;
        try{
            if(newContact.Id != null){
                signUpContact = SEL_Contacts.newInstance().selectByIdWoSharing(new Set<Id>{newContact.Id})[0];
            }else{
                signUpContact = SEL_Contacts.newInstance().selectByIdentityNumberWoSharing(new Set<String>{idNum})[0];
            } 
            Map<String, Object> attributes = new Map<String, Object>();
            attributes.put('Contact',newContact);
            pingId = OSB_SRV_PingIntegration.newInstance().getUser(newContact.Email);   
            if(pingId == null){
                attributes.put('accessRole',signUpContact.OSB_Community_Access_Role__c);
                attributes.put('userPassword',password);
                pingId = OSB_SRV_PingIntegration.newInstance().createUser(attributes);
            }else{
                newContact.OSB_Community_Access_Role__c = signUpContact.OSB_Community_Access_Role__c;
                OSB_SRV_PingIntegration.newInstance().checkUserAndUpdate(pingId,newContact);
            }
        }catch (Exception e) {
            OSB_SRV_ActionFailureHandler.newInstance().handleError(e, OSB_LightningSelfRegisterController.class.getName());
        }
        return pingId; 
    } 
    
    /**
     * Searches Ping for the user 
     * 
     * @param userEmail type String
     * 
     * @return result type Boolean if found or not 
     **/
    @AuraEnabled
    public static Boolean checkForUser(String userEmail){
        Boolean result = false;
        String pingID = OSB_SRV_PingIntegration.newInstance().getUser(userEmail);
        if(pingID != null){
            result = true;
			return result;            
        }
        return result;
    }
    
    /**
     * Updates the contact record on Salesforce
     *
     * @param newContact Contact
     * @param idNum String of user on contact record
     * @param pingId String of user in ping
     *
	 * @return String contact Id
     **/
    @AuraEnabled
    public static String updateContact(Contact newContact,String idNum, String pingId){
        List <Contact> contactListUpdate = new List <Contact>();
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        
        try{
            if(newContact.Id != null){
                signUpContact = SEL_Contacts.newInstance().selectByIdWoSharing(new Set<Id>{newContact.Id})[0];
            }else{
                signUpContact = SEL_Contacts.newInstance().selectByIdentityNumberWoSharing(new Set<String>{idNum})[0];
            }
            
            signUpContact.OSB_User_Sign_Up_Complete__c = system.now();
            signUpContact.OSB_Expire_Sign_Up_Link__c = true;
            signUpContact.Ping_Id__c = PingId;

            if(signUpContact.OSB_Community_Access_Role__c == DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP){
                signUpContact.OSB_Community_Access_Status__c = DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED;   
            }else{
                signUpContact.Company_Industry__c = newContact.Company_Industry__c;
                signUpContact.OSB_Community_Access_Status__c = DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_PENDING_APPROVAL;
                signUpContact.OSB_Company_name__c = newContact.OSB_Company_name__c;
                signUpContact.Title = newContact.Title;
                signUpContact.Identity_Number__c = newContact.Identity_Number__c;
                signUpContact.Phone = newContact.Phone;
                signUpContact.Phone_Country__c = newContact.Phone_Country__c;
                signUpContact.OSB_Operating_Country__c = newContact.OSB_Operating_Country__c;
            }
            
            contactListUpdate.add(signUpContact); 
            uow.registerDirty(signUpContact); 

            if(signUpContact.OSB_Community_Access_Role__c == DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP || signUpContact.OSB_Community_Access_Role__c == DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_DP){
                OSB_SRV_EmailSender.newInstance().sendSignUpEmails(contactListUpdate, uow);
            }else{
                OSB_SRV_EmailSender.newInstance().sendApAccessApprovedEmail(contactListUpdate, uow);
            }
            uow.commitWork();

        } catch (Exception e) {
            OSB_SRV_ActionFailureHandler.newInstance().handleError(e, OSB_LightningSelfRegisterController.class.getName());
        }
        return contactListUpdate[0].Id;
    }

    /**
     * Retrives the contact industry picklist values for User_Industry__c
     *
     * @return List<string>
     **/
    @AuraEnabled      
    public static List<string> getIndustryValues()
    {
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Company_Industry__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry f : ple) {
            options.add(f.getValue());
        }
        return options;
    }

    /**
     * Retrives the list of phone country codes
     *
     * @return List<string>
     **/
    @AuraEnabled      
    public static Map<string,object> getCountryCodes()
    {
        List<String> countryValues = new List<String>();
        List<String> operatingCountries = new List<String>();
        for( Schema.PicklistEntry f : Contact.Phone_Country__c.getDescribe().getPicklistValues()) {
            countryValues.add(f.getValue());
        }
        for( Schema.PicklistEntry op : Contact.OSB_Operating_Country__c.getDescribe().getPicklistValues()){
            operatingCountries.add(op.getValue());
        }
        Map<String,object> options = new Map<String,object>{
            COUNTRY_CODES => countryValues,
            OPERATING_COUNTRIES => operatingCountries
        };
        return options;
    }
   
    /**
     * Retrives the contact record details for pre population on the AP form
     *
     * @param recordId String of the record to be retrived 
     *
     * @return List<Contact>
     **/
    @AuraEnabled
    public static List<Contact> getRecord(String recordId){
        List <Contact> userRecord = SEL_Contacts.newInstance().selectByIdWoSharing(new Set<Id>{recordId});
        return userRecord;
    }
    
    /**
     * Gets the contact record
     *
     * @param contactId String
     * @param encoded Boolean
     *
     * @return Contact created by team profile
     **/ 
    @AuraEnabled 
    public static List<Contact> getLightContact(String contactId, Boolean encoded){
        String decodedId;
        if(encoded){
            decodedId = OSB_SRV_EncryptionHelper.decryptString(contactId, OSB_SRV_EmailBuilder.OSB_MAIL_ENCRKEY);
        }else {
            decodedId = contactId;
        }

        List<Contact> userContacts = SEL_Contacts.newInstance().selectByIdForRegistration(new Set<Id>{decodedId});

        for(Contact ct : userContacts){
            if(ct.OSB_Community_Access_Role__c == DP_ROLE || ct.OSB_Community_Access_Role__c == NP_ROLE){
                ct.Identity_Number__c = null;
                ct.OSB_Community_Access_Role__c = null;
                ct.OSB_Company_name__c = null;
                ct.Company_Industry__c = null;
                ct.Title = null;
                ct.OSB_Operating_Country__c = null;
            }
        }

        return userContacts;
    }

    /**
     * Gets the custom setting urls
     *
     * @return String
     **/
    @AuraEnabled
    public static List <OSB_URLs__c> getCustomURLS(){
        List <OSB_URLs__c> customSettingUrls = OSB_URLs__c.getall().values();
        return customSettingUrls;
    }

    /**
     * Retrieves document link
     *
     * @param docName name of searched document
     *
     * @return url for accessing searched document
     */
    @AuraEnabled(Cacheable=true)
    public static String getOSBDocumentURL(String docName){
        return SRV_Document.newInstance().getDocumentLink(docName);
    }
}