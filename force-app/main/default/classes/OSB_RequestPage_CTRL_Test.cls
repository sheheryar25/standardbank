/**
 * Test class for OSB_RequestPage_CTRL
 *
 * @author Wayde Fagan(Wayde.fagan@tetrad.co.za)
 * @date May 2021
 */
@IsTest(IsParallel=true)
public class OSB_RequestPage_CTRL_Test {
    private static final String TEST_USER_NAME = 'test@test.com';
    private static final String CASE_SUBJECT = 'OneHub - Refinitiv';
    private static final String TEST_CONTACT_FISRT_NAME = 'Test';
    private static final String TEST_CONTACT_LAST_NAME = 'Manager';
    private static final String TEST_COMPANY = 'Disney';
    private static final String TEST_SOLUTIONAME = 'FRDM';
    
    private static User testUser {
        get {
            if(testUser == null) {
                testUser = [SELECT Id, ContactId,Email FROM User WHERE Username = :TEST_USER_NAME LIMIT 1];
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
            		.name(TEST_CONTACT_FISRT_NAME,TEST_CONTACT_LAST_NAME)
            		.companyName(TEST_COMPANY)
                    .account(new BLD_Account(uow))
                    .getRecord();
        
        uow.commitWork();

        System.runAs(new User(Id = UserInfo.getUserId())) {
            User u = (User) new BLD_USER()
                    .useOneHub()
                    .userName(TEST_USER_NAME)
                    .contactId(con.Id)
                    .commitWork().getRecord();
        }
    }
    
    @IsTest
    static void shouldGetDocumentLink() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_Documents docSelector = (SEL_Documents) mocks.mock(SEL_Documents.class);
        Document sampleDocument = (Document) new BLD_Document().mock();

        mocks.startStubbing();
        mocks.when(docSelector.sObjectType()).thenReturn(Document.SObjectType);
        mocks.when(docSelector.selectByDeveloperName((Set<String>) fflib_Match.anyObject())).thenReturn(new List<Document> {sampleDocument});
        mocks.stopStubbing();
        ORG_Application.selector.setMock(docSelector);

        Test.startTest();
        String url = OSB_RequestPage_CTRL.getOSBDocumentURL('');
        Test.stopTest();
        System.assert(url.contains(sampleDocument.Id));
    }
    
	@IsTest
    static void shouldGetUserContactDetails() {
        List<Contact> result;
        Test.startTest();
        System.runAs(testUser) {
            result = OSB_RequestPage_CTRL.getUserDetails();
        }
        Test.stopTest();
        System.assertNotEquals(null, result[0].Email);
    }
    
    @isTest
    static void shouldCheckUser(){
        Boolean isLoggedIn = false;
        Test.startTest();
        System.runAs(testUser) {
        	isLoggedIn = OSB_RequestPage_CTRL.isUserLoggedIn();
        }
        Test.stopTest();
        System.assertEquals(true,isLoggedIn);
    }
    
    private class RestMock implements HttpCalloutMock {
        
        public HTTPResponse respond(HTTPRequest req) {         
            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setStatusCode(200);
            return res;
        }
    }
    
    @IsTest
    static void shouldCreateCase() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_Contacts contSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        Case c = (Case) new BLD_Case().setOSBData().getRecord();
        String urlName = 'FRDM_Registration_URL';
        insert new OSB_URLs__c(Name=urlName,Value__c='123');
        Test.setMock(HttpCalloutMock.class, new RestMock());
        Test.startTest();
        System.runAs(testUser) {
            OSB_RequestPage_CTRL.createCaseWithContactId(c,'FRDM_Registration_URL');
        }
        Test.stopTest();
        Case createdCase = [SELECT Id, ContactId FROM Case WHERE CreatedById = :testUser.Id LIMIT 1];
        System.assertEquals(testUser.ContactId, createdCase.ContactId);
    }
    
    @isTest
    static void shouldFindCase(){
        Test.startTest();
		Case c = (Case) new BLD_Case().setOSBData().suppliedEmail(TEST_USER_NAME).subject(CASE_SUBJECT).commitWork().getRecord();
        List<case> caseRecord = OSB_RequestPage_CTRL.CaseCheck(TEST_USER_NAME,CASE_SUBJECT);
        Test.stopTest();
        System.assertEquals(CASE_SUBJECT, caseRecord[0].Subject);
    }
    
    @isTest
    static void shouldSendEmail(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender serviceMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        BLD_Account accBld = new BLD_Account().name(DMN_Account.STANDARD_BANK_EMPLOYEES);
        
        Contact contactFound = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME, TEST_CONTACT_LAST_NAME)
            .email(TEST_USER_NAME)
            .mock();
        
        mocks.startStubbing();
        mocks.when(contSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contSelector.selectByUserId((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {contactFound});
        mocks.stopStubbing();
        ORG_Application.selector.setMock(contSelector);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, serviceMock);
        
        Test.startTest();
        OSB_RequestPage_CTRL.sendEmail(contactFound,TEST_SOLUTIONAME);
        Test.stopTest();
        ((OSB_SRV_EmailSender) mocks.verify(serviceMock, 1)).sendSolutionEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject(),(String) fflib_Match.anyString());
    }
}