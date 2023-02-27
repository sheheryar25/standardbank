/**
 *
 * Test class for OSB_VA_ViewBalance_CTRL
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
@IsTest
public with sharing class OSB_VA_ViewBalance_CTRL_TEST {

    private static final String TEST_USER_EMAIL = 'randomname3533@test.com';
    private static final String TEST_USER_FIRST_NAME = 'Random5';
    private static final String TEST_USER_LAST_NAME = 'Name9';
    private static final String BALANCE_INQUIRY = 'Balance inquiry';
    private static final String EMAIL_STATEMENT = 'Email statement';
    private static final String COMPANY_NAME = 'Company1';

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
    public static void testSuccessScenario() {
        String testResponses = [SELECT Body FROM StaticResource WHERE Name = 'DCS_TestResponses'].Body.toString();
        Map<String, Object> parsedResponses = (Map<String, Object>) JSON.deserializeUntyped(testResponses);
        String responseBody = (String) parsedResponses.get('OSB_VA_ViewBalance_CTRL_TEST_testSuccessScenario');
        OSB_VA_ViewBalance_CTRL.ViewBalanceInput input = new OSB_VA_ViewBalance_CTRL.ViewBalanceInput();
        input.accessToken = 'ACCESSTOKEN';
        SEL_Contacts selContacts = SEL_Contacts.newInstance();
        Contact con = selContacts.selectWithoutCondition(1).get(0);
        input.contactId = con.Id;
        input.accountNumber = '9090000341683';
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(200, 'OK', responseBody, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        List<OSB_VA_ViewBalance_CTRL.ViewBalanceInput> inputs = new List<OSB_VA_ViewBalance_CTRL.ViewBalanceInput>{input};
        Test.startTest();
        List<OSB_VA_ViewBalance_CTRL.ViewBalanceOutput> result = OSB_VA_ViewBalance_CTRL.viewBalance(inputs);
        Test.stopTest();
        System.assertEquals(1, result.size());
        System.assertEquals(null, result.get(0).hasError);
        System.assertEquals(null, result.get(0).errorLogId);
        System.assertEquals(null, result.get(0).errorOutputMessage);
        System.assertEquals('Close Success', result.get(0).actionType);
    }

    @IsTest
    public static void testRequestError() {
        OSB_VA_ViewBalance_CTRL.ViewBalanceInput input = new OSB_VA_ViewBalance_CTRL.ViewBalanceInput();
        input.accessToken = 'ACCESSTOKEN';
        SEL_Contacts selContacts = SEL_Contacts.newInstance();
        Contact con = selContacts.selectWithoutCondition(1).get(0);
        input.contactId = con.Id;
        input.accountNumber = '9090000341683';
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(500, 'Error', null, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        List<OSB_VA_ViewBalance_CTRL.ViewBalanceInput> inputs = new List<OSB_VA_ViewBalance_CTRL.ViewBalanceInput>{input};
        Test.startTest();
        List<OSB_VA_ViewBalance_CTRL.ViewBalanceOutput> result = OSB_VA_ViewBalance_CTRL.viewBalance(inputs);
        Test.stopTest();
        System.assertEquals(1, result.size());
        System.assertNotEquals(null, result.get(0).errorLogId);
        System.assertEquals('HTTP_REQUEST_SEND_ERROR', result.get(0).errorType);
        System.assertEquals(System.Label.OSB_VA_BA_TechnicalErrorSingle, result.get(0).errorOutputMessage);
        System.assertEquals('Create Child On Error', result.get(0).actionType);
    }
}