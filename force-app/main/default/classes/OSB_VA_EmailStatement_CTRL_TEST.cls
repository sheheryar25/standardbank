/**
 *
 * Test class for OSB_VA_EmailStatement_CTRL
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
@IsTest
public with sharing class OSB_VA_EmailStatement_CTRL_TEST {

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
        BLD_Permissions permissionBld1 = new BLD_Permissions(uow2).name(EMAIL_STATEMENT);
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
    public static void testSuccessScenario(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString()))
                .thenReturn('https://onehub.standardbank.co.za');
        mocks.stopStubbing();

        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);

        OSB_VA_EmailStatement_CTRL.EmailStatementInput input = new OSB_VA_EmailStatement_CTRL.EmailStatementInput();
        SEL_Contacts selContacts = SEL_Contacts.newInstance();
        Contact con = selContacts.selectWithoutCondition(1).get(0);
        input.contactId = con.Id;
        input.accountNumber = '9090000341683';
        input.userId = UserInfo.getUserId();
        input.timePeriod = 'I would like to choose my own date range';
        input.statementEnd = Date.today().addDays(-50);
        input.statementStart = Date.today().addDays(-10);
        List<OSB_VA_EmailStatement_CTRL.EmailStatementInput> inputs = new List<OSB_VA_EmailStatement_CTRL.EmailStatementInput>{input};
        Test.startTest();
        List<String> result = OSB_VA_EmailStatement_CTRL.emailStatement(inputs);
        Test.stopTest();
        System.assertEquals(1, result.size());
    }
}