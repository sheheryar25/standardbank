/**
 *
 * Test class for OSB_VA_AccountSearch_CTRL
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
@IsTest
public with sharing class OSB_VA_AccountSearch_CTRL_TEST {

    private static final String TEST_USER_EMAIL = 'randomname3533@test.com';
    private static final String TEST_USER_FIRST_NAME = 'Random5';
    private static final String TEST_USER_LAST_NAME = 'Name9';
    private static final String BALANCE_INQUIRY = 'Balance inquiry';
    private static final String EMAIL_STATEMENT = 'Email statement';
    private static final String COMPANY_NAME = 'Company1';
    private static final String ACCESS_TOKEN = 'ACCESS_TOKEN';

    @TestSetup
    static void setup() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        BLD_Account accBld1 = new BLD_Account(uow).CIF('12345').Name(COMPANY_NAME);
        BLD_Contact conBld = new BLD_Contact(uow)
                .name(TEST_USER_FIRST_NAME, TEST_USER_LAST_NAME)
                .email(TEST_USER_EMAIL)
                .ownerId(UserInfo.getUserId())
                .cifNumber('12345')
                .communityAccessRole(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP)
                .account(
                        accBld1
                );
        uow.commitWork();
        fflib_SObjectUnitOfWork uow2 = ABS_ObjectBuilderBase.getNewUnitOfWork(new List<SObjectType>{
                Permissions__c.getSObjectType(),
                Financial_Account__c.getSObjectType(),
                Financial_Account_Permission__c.getSObjectType()
        });
       
        BLD_Permissions permissionBld1 = new BLD_Permissions(uow2).name(BALANCE_INQUIRY);
        BLD_FinancialAccount financialAccountBld1 = new BLD_FinancialAccount(uow2)
                .client(accBld1)
                .name(COMPANY_NAME)
                .externalId('9090000341683');
        BLD_FinancialAccountPermission finAccPermBld1 = new BLD_FinancialAccountPermission(uow2)
                .financialAccount(financialAccountBld1)
                .permission(permissionBld1)
                .active(true)
                .authorizedPerson(conBld);
        uow2.commitWork();
    }

    @IsTest
    public static void testAccountWithPermissionFound() {
        String testResponses = [SELECT Body FROM StaticResource WHERE Name = 'DCS_TestResponses'].Body.toString();
        Map<String, Object> parsedResponses = (Map<String, Object>) JSON.deserializeUntyped(testResponses);
        String responseBody = (String) parsedResponses.get('OSB_VA_AccountSearch_CTRL_TEST_testAccountWithPermissionFound');
        OSB_VA_AccountSearch_CTRL.AccountSearchInput input = new OSB_VA_AccountSearch_CTRL.AccountSearchInput();
        input.customerIdentifier = '20900012761';
        input.accessToken = ACCESS_TOKEN;
        input.serviceType = BALANCE_INQUIRY;
        SEL_Contacts selContacts = SEL_Contacts.newInstance();
        Contact con = selContacts.selectWithoutCondition(1).get(0);
        input.contactId = con.Id;
        input.accountType = [SELECT Id, Label, Code__c, Service_Type__c FROM OSB_VA_Account_Types__mdt WHERE Service_Type__c = :BALANCE_INQUIRY AND Code__c = 'OD005'];
        List<OSB_VA_AccountSearch_CTRL.AccountSearchInput> inputs = new List<OSB_VA_AccountSearch_CTRL.AccountSearchInput>{
                input
        };
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(200, 'OK', responseBody, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_AccountSearchOutput> result = OSB_VA_AccountSearch_CTRL.searchForAccounts(inputs);
        Test.stopTest();
        System.assertEquals(inputs.size(), result.size());
        List<OSB_VA_AccountInfo> accounts = result.get(0).accounts;
        System.assertEquals(2, accounts.size());
    }

    @IsTest
    public static void testRequestError() {
        OSB_VA_AccountSearch_CTRL.AccountSearchInput input = new OSB_VA_AccountSearch_CTRL.AccountSearchInput();
        input.customerIdentifier = '20900012761';
        input.accessToken = ACCESS_TOKEN;
        input.serviceType = BALANCE_INQUIRY;
        SEL_Contacts selContacts = SEL_Contacts.newInstance();
        Contact con = selContacts.selectWithoutCondition(1).get(0);
        input.contactId = con.Id;
        input.accountType = [SELECT Id, Label, Code__c, Service_Type__c FROM OSB_VA_Account_Types__mdt WHERE Service_Type__c = :BALANCE_INQUIRY AND Code__c = 'OD005'];
        List<OSB_VA_AccountSearch_CTRL.AccountSearchInput> inputs = new List<OSB_VA_AccountSearch_CTRL.AccountSearchInput>{
                input
        };
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(500, 'Error', null, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_AccountSearchOutput> result = OSB_VA_AccountSearch_CTRL.searchForAccounts(inputs);
        Test.stopTest();
        System.assertEquals(inputs.size(), result.size());
        System.assertEquals(true, result.get(0).hasError);
        System.assertEquals(System.Label.OSB_VA_BA_TechnicalErrorSingle, result.get(0).errorOutPutMessage);
        System.assertEquals('HTTP_REQUEST_SEND_ERROR', result.get(0).errorType);
    }
}