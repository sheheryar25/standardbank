/**
* Registration Handler for Mulesoft Ping Authentication Provider For Anypoint Community Manager(ACM)
* New Class created to be used in Auth provider
* @author Swapnil Walse (swapnil.walse@tetrad.co.za)
* @date October 2019
* 
*/
global with sharing class ACM_PingRegistration implements Auth.RegistrationHandler {
    public class RegHandlerException extends Exception {}
    @TestVisible
    private static final String DEFAULT_ACCOUNT_NAME = 'ACM Registered Users';
    public static final String ACM_AUTH_PROVIDER_NAME = 'Mulesoft_ACM_Ping_Authentication'; 
    @AuraEnabled public final String ACM_AUTH_PROVIDER_NAME_URL = System.URL.getSalesforceBaseUrl().toExternalForm() + '/services/auth/sso/Mulesoft_ACM_Ping_Authentication';
    @AuraEnabled public final String ACM_REGISTRATION_TERMS_AND_CONDITIONS_URL = System.URL.getSalesforceBaseUrl().toExternalForm() + '/APIMarketplace/s/registration-terms-and-conditions';
    public static final String ACM_COMMUNITY = 'ACM Community User Login';
    public static final String ACM_COMMUNITY_PERMISSION_SET = 'API Marketplace Member';
    public static final String AREA_ACM = 'MulesoftACM';
    @TestVisible
    private static final String DEFAULT_CONTACT_RECORD_TYPE = 'Individual_Client';
    private static final String TIME_ZONE_SID = 'Africa/Johannesburg';
    private static final String EMAIL_ENCODING = 'UTF-8';
    //new variables
    private static final String DATE_OF_BIRTH = 'dateofbirth';
    private static final String BIRTHDATE = 'birthdate';
    private static final String KEY_NAME = 'name';
    private static final String KEY_LAST_NAME = 'last_name';
    private static final String KEY_FAMILY_NAME = 'family_name';
    private static final String KEY_FIRST_NAME = 'first_name';
    private static final String KEY_GIVEN_NAME = 'given_name';
    private static final String KEY_MIDDLE_NAME = 'middle_name';
    private static final String KEY_NICKNAME = 'nickname';
    private static final String KEY_PREFFERED_USERNAME = 'preferred_username';
    private static final String KEY_PROFILE = 'profile';
    private static final String KEY_PICTURE = 'picture';
    private static final String KEY_WEBSITE = 'website';
    private static final String KEY_GENDER = 'gender';
    private static final String KEY_ZONEINFO = 'zoneinfo';
    private static final String KEY_LOCALE = 'locale';
    private static final String KEY_UPDATED_AT = 'updated_at';
    private static final String KEY_ADDRESS = 'address';
    private static final String KEY_EMAIL_VERIFIED = 'email_verified';
    private static final String KEY_CELLPHONE = 'phone_number';
    private static final String KEY_CELLPHONE_VERIFIED = 'phone_number_verified';
    //new variables end
    private static final String KEY_COMPANY =  'organization';
    private static final String KEY_COUNTRY_CODE =  'countrycode';
    private static final String KEY_SUB = 'sub';
    private static final String KEY_EMAIL = 'email';
    
    private static final String KEY_ID = 'id';
    private static final String TEMP_FIRST_NAME = 'Awesome';
    private static final String DATA_MISSING_MESSAGE = 'Auth.UserData was null';
    private static final String ACM_SUFFIX = '';
    @TestVisible private static final String PING_START_VALUE = 'entryUUID=';
    @TestVisible private static final String PING_END_VALUE = ',ou=People,dc=sbsa,dc=com';
    
    /**
* Prepare User Data for salesforce from the data received from Ping Auth. Provider
* 
* @param data User data recieved from auth provider
* @param u User object instance created with the data
* @param pingRegistrationResponseSettingsMap map of Ping user details 
*/
    private void prepareUserData(Auth.UserData data, User u) {
        String firstName;
        String lastName;
        String username;
        String alias;
        String email;
        String cellNumber;
        String dob;
        String nickName;
        String profile;
        String address;
        Boolean emailVerified;
        Boolean phoneVerified;
        
        if (data != null) {
            if(data.attributeMap.containsKey(KEY_GIVEN_NAME)){
                firstName = data.attributeMap.get(KEY_GIVEN_NAME);
            }
            else if(data.attributeMap.containsKey(KEY_FIRST_NAME)){
                firstName = data.attributeMap.get(KEY_FIRST_NAME);
            }
            if(data.attributeMap.containsKey(KEY_FAMILY_NAME)){
                lastName = data.attributeMap.get(KEY_FAMILY_NAME);
            }
            else if(data.attributeMap.containsKey(KEY_LAST_NAME)){
                lastName = data.attributeMap.get(KEY_LAST_NAME);
            }
            else{
                lastName = firstName;
                firstName = TEMP_FIRST_NAME;
            }
            if(data.attributeMap.containsKey(KEY_NICKNAME)){
                nickName = data.attributeMap.get(KEY_NICKNAME);
            }
            
            
            if(data.attributeMap.containsKey(KEY_EMAIL))
                email = data.attributeMap.get(KEY_EMAIL);
            else
                email = data.attributeMap.get(KEY_SUB);
            
            if(data.attributeMap.containsKey(KEY_CELLPHONE))
                cellNumber = data.attributeMap.get(KEY_CELLPHONE);
            
            if(data.attributeMap.containsKey(KEY_EMAIL_VERIFIED))
                emailVerified = Boolean.valueOf(data.attributeMap.get(KEY_EMAIL_VERIFIED));
            if(data.attributeMap.containsKey(KEY_CELLPHONE_VERIFIED))
                phoneVerified = Boolean.valueOf(data.attributeMap.get(KEY_CELLPHONE_VERIFIED));
            
            if(data.attributeMap.containsKey(KEY_PREFFERED_USERNAME))
                username = data.attributeMap.get(KEY_PREFFERED_USERNAME);
            else
                username = UTL_User.applySuffix(data.attributeMap.get(KEY_SUB) + ACM_SUFFIX);
            // if(data.attributeMap.containsKey(KEY_PROFILE))
            //     profile = data.attributeMap.get(KEY_PROFILE);
            // else
            //     profile=ACM_COMMUNITY;
            alias = firstName.left(1) + lastName.left(1) + String.valueOf(Math.round((Math.random() * (900000) + 100000))); //Append 6 digit random number
            if (alias.length() > 8) alias = alias.substring(0, 8);
            
            u.Ping_UUID__c = PING_START_VALUE + data.attributeMap.get(KEY_ID) + PING_END_VALUE;
            u.Username = username;
            u.Email = email;
            u.LastName = lastName;
            u.FirstName = firstName;
            u.MobilePhone = cellNumber;
            u.Alias = alias;
            u.CommunityNickname = nickName;
            u.LanguageLocaleKey = UserInfo.getLocale();
            u.LocaleSidKey = UserInfo.getLocale();
            u.EmailEncodingKey = EMAIL_ENCODING;
            u.TimeZoneSidKey = TIME_ZONE_SID;
            u.UserPreferencesDisableBookmarkEmail = true;
            u.UserPreferencesDisableAllFeedsEmail = true;
            u.UserPreferencesDisableBookmarkEmail = true;
            u.UserPreferencesDisableFollowersEmail = true;
            u.UserPreferencesDisableLaterCommentEmail = true;
            u.UserPreferencesDisableLikeEmail = true;
            u.UserPreferencesDisableMentionsPostEmail = true;
            u.UserPreferencesDisableMessageEmail = true;
            u.UserPreferencesDisableProfilePostEmail = true;
            u.UserPreferencesDisableSharePostEmail = true;
            u.UserPreferencesDisCommentAfterLikeEmail = true;
            u.UserPreferencesDisMentionsCommentEmail = true;
            u.UserPreferencesDisProfPostCommentEmail = true;
            u.UserPreferencesHideChatterOnboardingSplash = true;
            u.UserPreferencesEmailVerified=emailVerified;
            u.UserPreferencesPhoneNumberVerified=phoneVerified;
            u.ProfileId = UTL_Profile.getProfileId(ACM_COMMUNITY);
            u.ContactId = createContact(data);
        }
    }
    
    /**
* Updates the specified user’s information.
* This method is called if the user has logged in before with the authorization provider and then logs in again.
* 
* @param userId Id of the existing user to update
* @param portalId Id of the portal configured with this provider.
* @param data User data recieved from auth provider
*/
    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        system.debug('::updateUser Auth.UserData::'+data);
    }
    
    /**
* Returns a User object using the specified portal ID and user information from Ping
* The User object corresponds to the Pings’s user information
* 
* @param portalId Id of the portal configured with this provider.
* @param data User data recieved from auth provider
* @return User record for creation
*/
    global User createUser(Id portalId, Auth.UserData data) {
        system.debug('::createUser Auth.UserData::'+data);
        try{
            User u = new User();
            prepareUserData(data, u);
            List<User> existingUsers = SEL_Users.newInstance().selectByContactId(new Set<Id>{u.ContactId});
            
            if(existingUsers.size() > 0){
                u = existingUsers[0];
            }
            return u;
        } catch (Exception e) {
            e.setMessage(e.getMessage() + 'Ping Response:' +  JSON.serialize(data));
            SRV_Logger.newInstance().log(e, AREA_ACM, ACM_PingRegistration.class.getName());
            throw e;
        }
        
    }
    @TestVisible
    private Id createContact(Auth.UserData data){
        Contact contact = new Contact();
        if(data.attributeMap.containsKey(KEY_GIVEN_NAME)){
            contact.FirstName = data.attributeMap.get(KEY_GIVEN_NAME);
        } 
        else if(data.attributeMap.containsKey(KEY_FIRST_NAME)){
            contact.FirstName = data.attributeMap.get(KEY_FIRST_NAME);
        }
        if(data.attributeMap.containsKey(KEY_FAMILY_NAME)){
            contact.LastName = data.attributeMap.get(KEY_FAMILY_NAME);
        }
        else if(data.attributeMap.containsKey(KEY_LAST_NAME)){
            contact.LastName = data.attributeMap.get(KEY_LAST_NAME);
        }else{
            contact.LastName = contact.FirstName;
            contact.FirstName = TEMP_FIRST_NAME;
        }
        if(data.attributeMap.containsKey(KEY_EMAIL))
            contact.Email = data.attributeMap.get(KEY_EMAIL);
        else
            contact.Email = data.attributeMap.get(KEY_SUB);
        if(data.attributeMap.containsKey(KEY_CELLPHONE)){
            contact.MobilePhone = data.attributeMap.get(KEY_CELLPHONE);
            contact.Phone = data.attributeMap.get(KEY_CELLPHONE);
        }
        if(data.attributeMap.containsKey(KEY_GENDER)){
            contact.FinServ__Gender__c = data.attributeMap.get(KEY_GENDER);
        }
        if(data.attributeMap.containsKey(KEY_ZONEINFO)){
            contact.FinServ__CustomerTimezone__c = data.attributeMap.get(KEY_ZONEINFO);
        }
        if(data.attributeMap.containsKey(KEY_EMAIL_VERIFIED)){
            contact.FinServ__EmailVerified__c = Boolean.valueOf(data.attributeMap.get(KEY_EMAIL_VERIFIED));
        }
        if(data.attributeMap.containsKey(KEY_CELLPHONE_VERIFIED)){
            contact.FinServ__MobileVerified__c = Boolean.valueOf(data.attributeMap.get(KEY_CELLPHONE_VERIFIED));
        }
        if(data.attributeMap.containsKey(KEY_COMPANY))
            contact.OSB_Company_name__c = data.attributeMap.get(KEY_COMPANY);
        
        if(data.attributeMap.containsKey(KEY_COUNTRY_CODE))
            contact.Phone_Country__c = data.attributeMap.get(KEY_COUNTRY_CODE);
        
        contact.RecordTypeId = UTL_RecordType.getRecordTypeId('Contact', DEFAULT_CONTACT_RECORD_TYPE);
        Contact.Ping_Id__c = PING_START_VALUE + data.attributeMap.get(KEY_ID) + PING_END_VALUE;
        
        
        // set Account Id
        if (data.attributemap.get('accountId') != null){
            contact.accountId = data.attributemap.get('accountId');
        } else {
            List<Account> accounts = [select Id from Account where Name =:DEFAULT_ACCOUNT_NAME];
            contact.accountId = accounts[0].Id;
        }
        Contact foundContact = findContact(data);
        if(foundContact == null){
            insert contact;
        }else{
            contact.Id = foundContact.Id;
        }
        
        return contact.id; 
    }
    /**
* Returns a Contact record on the basis of Ping Id
* 
* @param data User data recieved from auth provider
* @param pingRegistrationResponseSettingsMap map of Ping user details
* 
* @return Contact record
*/
    private static Contact findContact(Auth.UserData data){
        String pingId = data.attributeMap.get(KEY_ID);
        Contact foundContact;
        List<Contact> lstContact = SEL_Contacts.newInstance()
            .selectByPingUUID(
                new Set<String>{PING_START_VALUE + pingId + PING_END_VALUE}
            );
        for(Contact con:lstContact){
            if(!String.isBlank(con.Ping_Id__c)&&con.Ping_Id__c.contains(pingId)){
                foundContact = con;
                break;
            }
        }
        return foundContact;
    }
}