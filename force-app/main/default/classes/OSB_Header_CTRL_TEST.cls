/**
 * Test class for OSB_Header_CTRL
 * 
 * @author Ayush Garg (ayusgarg@deloitte.com)
 * @date April 2020
 */
@IsTest(IsParallel=true)
public with sharing class OSB_Header_CTRL_TEST {
    private static final String TEST_USER_NAME = 'testRandom1011@test.com';
    private static final String TEST_CONTACT_PHONE = '123123123';
    private static final String TEST_USER_FIRSTNAME = 'Test';
    private static final String TEST_TERMSANDCONDITIONS = 'https://termsandconditions.test';
    private static final String TEST_APIMARKETPLACE = 'https://sit-standardbankgroupcommunity.cs128.force.com/APIMarketplace';
    private static final String TEST_LOGIN = '/services/auth/sso/Ping_Authentication';
    private static final String TEST_IELOGIN = '/s/unsupported-internet-explorer';

    private static User testUser {
        get {
            if(testUser == null) {
                testUser = [SELECT Id, ContactId,Email, Phone FROM User WHERE Username = :TEST_USER_NAME LIMIT 1];
            }
            return testUser;
        }
        set;
    }
    
    @TestSetup
    static void setup() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        Contact con = (Contact) new BLD_Contact(uow)
            .ownerId(UserInfo.getUserId())
            .communityAccessRole(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP)
            .account(
                new BLD_Account(uow)
            )
            .getRecord();
        
        uow.commitWork();
        
        System.runAs(new User(Id = UserInfo.getUserId())) {
            User u = (User) new BLD_USER()
                .useOneHub()
                .userName(TEST_USER_NAME)
                .contactId(con.Id)
                .phone(TEST_CONTACT_PHONE)
                .firstName(TEST_USER_FIRSTNAME)
                .email(TEST_USER_NAME)
                .commitWork().getRecord();
        }
    }
    
    @IsTest
    static void shouldGetNotification() {
        Integer actualNotificationCount;
        Test.startTest();
        System.runAs(testUser) {
            actualNotificationCount = OSB_Header_CTRL.getUnreadFeedItemsNumberForUser();//Notification is created when user is created
        }
        Test.stopTest();
        System.assertEquals(1, actualNotificationCount);
    }
    
    @IsTest
    static void shouldGetUserName() {
        User currentUser;
        Test.startTest();
        System.runAs(testUser) {
            currentUser = OSB_Header_CTRL.getUserNameIfLoggedIn();
        }
        Test.stopTest();
        System.assertEquals(TEST_USER_FIRSTNAME, currentUser.FirstName);
    }
    
    @IsTest
    static void shouldGetContactRole() {
        String role;
        Test.startTest();
        System.runAs(testUser) {
            role = OSB_Header_CTRL.getContactAuth();
        }
        Test.stopTest();
        System.assertEquals(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, role);
    }
    
    @IsTest
    static void shouldGetPingPasswordChangeURL() {
        insert TEST_DataFactory.getOsbUrls();
        String url;
        Test.startTest();
        System.runAs(testUser) {
            url = OSB_Header_CTRL.getChangePasswordUrlPing();
        }
        Test.stopTest();
        System.assertEquals(true, url.containsIgnoreCase(testUser.Email));
    }

    @IsTest
    static void checkGettingLink(){
        insert TEST_DataFactory.getOsbUrls();

        String url;
        Test.startTest();
        System.runAs(testUser) {
            url = OSB_Header_CTRL.getTermsLink();
        }
        Test.stopTest();

        System.assertEquals(TEST_TERMSANDCONDITIONS, url);
    }

    @IsTest
    static void getApiLink(){
        List<OSB_URLs__c> customSettingList = TEST_DataFactory.getOsbUrls();
        OSB_URLs__c urls = new OSB_URLs__c();
        urls.name = 'OSB_APImarketPlaceUrl';
        urls.Value__c = TEST_APIMARKETPLACE;
        customSettingList.add(urls);
        insert customSettingList;

        String url;
        Test.startTest();
        System.runAs(testUser) {
            url = OSB_Header_CTRL.getApiLink();
        }
        Test.stopTest();
        System.assertEquals(TEST_APIMARKETPLACE, url);
    }

    @IsTest
    static void getLoginUrlTest(){
        String url;
        Test.startTest();
        System.runAs(testUser) {
            url = OSB_Header_CTRL.getLoginURL();
        }
        Test.stopTest();
        System.assertEquals(TEST_LOGIN, url);
    }

    @IsTest
    static void getIeLoginUrlTest(){
        String url;
        Test.startTest();
        System.runAs(testUser) {
            url = OSB_Header_CTRL.getIELoginURL();
        }
        Test.stopTest();
        System.assertEquals(TEST_IELOGIN, url);
    }
}