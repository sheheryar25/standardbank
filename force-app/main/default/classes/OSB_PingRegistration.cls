/**
* Registration Handler for Ping Authentication Provider
* 
* @author Ayush Garg (ayusgarg@deloitte.com)
* @date October 2019
*/
public with sharing class OSB_PingRegistration implements Auth.RegistrationHandler {
    public class RegHandlerException extends Exception {}
    private static final String TIME_ZONE_SID = 'Africa/Johannesburg';
    private static final String EMAIL_ENCODING = 'UTF-8';
    private static final String USER_NOT_UPDATED_PING = 'User_not_updated_with_pingUUID';
    private static final String CONTACT_NOT_FOUND = 'Contact_not_found';
    private static final String USER_NOT_REGISTERED = 'User_not_registered';
    private static final String USER_ACCESS_REMOVED = 'User_Access_Removed';
    private static final String USER_APPROVAL_PENDING = 'User_Approval_Pending';
    private static final String USER_APPROVAL_DENIED = 'User_Approval_Denied';
    private static final String DATE_OF_BIRTH = 'DateOfBirth';
    private static final String KEY_FIRST_NAME = 'First_name';
    private static final String KEY_LAST_NAME = 'Last_name';
    private static final String KEY_CELLPHONE = 'Cellphone';
    private static final String KEY_NETWORK = 'sfdc_networkid';
    private static final String KEY_SUB = 'sub';
    private static final String KEY_ID = 'id';
    private static final String DATA_MISSING_MESSAGE = 'Auth.UserData was null';
    private static final String KEY_NETWORK_DATA_MISSING_MESSAGE = KEY_NETWORK + ' value not found in Auth.UserData';
    private static final String ONEHUB_SUFFIX = '.onehub';
    private static final String PING_START_VALUE = 'entryUUID=';
    private static final String PING_END_VALUE = ',ou=People,dc=sbsa,dc=com';
    
    /**
    * Prepare User Data for salesforce from the data received from Ping Auth. Provider
    * 
    * @param data User data recieved from auth provider
    * @param u User object instance created with the data
    * @param pingRegistrationResponseSettingsMap map of Ping user details 
    */
    private void prepareUserData(Auth.UserData data, User u, Map<String, OSB_PingRegistrationResponse__c> pingRegistrationResponseSettingsMap) {
        String firstName;
        String lastName;
        String username;
        String alias;
        String email;
        
        if (data != null) {
            firstName = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_FIRST_NAME).Value__c);
            lastName = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_LAST_NAME).Value__c);
            email = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c);
            username = UTL_User.applySuffix(data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c)+ONEHUB_SUFFIX);
            alias = firstName;
            if (alias.length() > 8) {
                alias = alias.substring(0, 8);
            }
            u.Username = username;
            u.Email = email;
            u.LastName = lastName;
            u.FirstName = firstName;
            u.Alias = alias;
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
    public void updateUser(Id userId, Id portalId, Auth.UserData data) {
        Map<String, OSB_PingRegistrationResponse__c> pingRegistrationResponseSettingsMap = OSB_PingRegistrationResponse__c.getAll();
        try {
            if (data != null) {
                fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
                Contact foundContact = findContact(data, pingRegistrationResponseSettingsMap);
                User user = new User(Id = userId);
                user.Email = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c);
                user.LastName = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_LAST_NAME).Value__c);
                user.FirstName = data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_FIRST_NAME).Value__c);
                List<User> existingUsers = SEL_Users.newInstance().selectById(new Set<Id>{userId});
                if(foundContact != null){
                    if(foundContact.OSB_Contact_Re_invited__c && !user.isActive && foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED){
                        user.isActive = true;
                    }
                    if(!existingUsers.isEmpty() && existingUsers[0].Frozen_Account__c){
                        throw new RegHandlerException(USER_ACCESS_REMOVED + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                    } 
                    if (foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE) {
                        throw new RegHandlerException(USER_ACCESS_REMOVED + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                    }
                    if (foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED) {
                        throw new RegHandlerException(USER_APPROVAL_DENIED + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                    }}else{
                        throw new RegHandlerException(CONTACT_NOT_FOUND);
                    }
                uow.registerDirty(user);
                uow.commitWork();
            } else {
                throw new RegHandlerException(DATA_MISSING_MESSAGE);
            }
        } catch (Exception e) {
            List<String> messages = new List<String>{'User id: ' + userId};
            messages.add('User Email: ' + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c));
            SRV_Logger.newInstance().log(e, DMN_Log.AREA_ONEHUB, OSB_PingRegistration.class.getName(), messages);
            throw e;
        }
    }
    
    /**
    * Returns a User object using the specified portal ID and user information from Ping
    * The User object corresponds to the Pings’s user information
    * 
    * @param portalId Id of the portal configured with this provider.
    * @param data User data recieved from auth provider
    * @return User record for creation
    */
    public User createUser(Id portalId, Auth.UserData data) {
        Map<String, OSB_PingRegistrationResponse__c> pingRegistrationResponseSettingsMap = OSB_PingRegistrationResponse__c.getAll();
        List<String> messages = new List<String>();
        String PingID = PING_START_VALUE+data.attributeMap.get(KEY_ID)+PING_END_VALUE;
        User u = new User();
        prepareUserData(data, u, pingRegistrationResponseSettingsMap);
        List<User> existingUsers = SEL_Users.newInstance().selectByPingUUID(new Set<String>{PingID});
        if(!existingUsers.isEmpty()){
            u.Id = existingUsers[0].Id;
        }
        try {
            if (data.attributeMap.containsKey(KEY_NETWORK)) {
                Contact foundContact = findContact(data,pingRegistrationResponseSettingsMap);
                if (foundContact == null && data.attributeMap.containsKey(pingRegistrationResponseSettingsMap.get(DATE_OF_BIRTH).Value__c)) {
                    Blob encodeUserDetails = Blob.valueOf(data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_FIRST_NAME).Value__c) + '|'
                                                                         + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_LAST_NAME).Value__c) + '|'
                                                                         + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c) + '|'
                                                                         + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_CELLPHONE).Value__c));
                    
                    throw new RegHandlerException(USER_NOT_REGISTERED + '&encodeDetails=' + EncodingUtil.base64Encode(encodeUserDetails));
                }
                if (foundContact == null) {
                    throw new RegHandlerException(CONTACT_NOT_FOUND);
                }
                if (foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_PENDING_APPROVAL) {
                    if(foundContact.OSB_Contact_Re_invited__c){
                        throw new RegHandlerException(USER_APPROVAL_PENDING + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                    }
                    else{
                        throw new RegHandlerException(USER_APPROVAL_PENDING);
                    }
                }
                if (foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE) {
                    throw new RegHandlerException(USER_ACCESS_REMOVED + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                }
                if (foundContact.OSB_Community_Access_Status__c == DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED) {
                    throw new RegHandlerException(USER_APPROVAL_DENIED + '&contactid=' + foundContact.OSB_Community_Access_Manager__c);
                }
                u.ProfileId = UTL_Profile.getProfileId(DMN_Profile.ONE_HUB_COMMUNITY);
                u.ContactId = foundContact.Id;
                u.Ping_UUID__c = PingID;
                return u;
            } else {
                messages.add('User Email: ' + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c));
                SRV_Logger.newInstance().log(new RegHandlerException(KEY_NETWORK_DATA_MISSING_MESSAGE), DMN_Log.AREA_ONEHUB, OSB_PingRegistration.class.getName());
                return null;
            }
        } catch (Exception e) {
            messages.add('User Email: ' + data.attributeMap.get(pingRegistrationResponseSettingsMap.get(KEY_SUB).Value__c));
            messages.add('User Info: ' + data);
            SRV_Logger.newInstance().log(e, DMN_Log.AREA_ONEHUB, OSB_PingRegistration.class.getName(),messages);
            throw e;
        }
    }
    
    /**
    * Returns a Contact record on the basis of Ping Id
    * 
    * @param data User data recieved from auth provider
    * @param pingRegistrationResponseSettingsMap map of Ping user details
    * 
    * @return Contact record
    */
    private static Contact findContact(Auth.UserData data,Map<String, OSB_PingRegistrationResponse__c> pingRegistrationResponseSettingsMap){
        String pingId = data.attributeMap.get(KEY_ID);
        Contact foundContact;
        List<Contact> lstContact = SEL_Contacts.newInstance()
            .selectByPingUUID(
                new Set<String>{PING_START_VALUE+pingId+PING_END_VALUE}
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