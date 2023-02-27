/**
 * Test class for the OSB_LightningSelfRegisterController class
 *
 * @author Wayde Fagan (wayde.fagan@tetrad.co.za)
 * @date April 2020
 *
 **/
@SuppressWarnings('PMD.AvoidHardcodingId')
@IsTest
public with sharing class OSB_LightningSelfRegisterController_Test {

    private static final String TEST_PASSWORD = 'Popcorn*963';
    private static final String TEST_DUMMY_ID = '0039E000010KurFQAS';
    private static final String TEST_IDENTITYNUM = '124578235689';
    private static fflib_ApexMocks mocks = new fflib_ApexMocks();
    private static fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);

    @TestSetup
    static void setup() {
        List<OSB_URLs__c> osbUrls = TEST_DataFactory.getOsbUrls();
        insert osbUrls;
    }
    
    @IsTest 
    static void testIsValidPassword() {
        String testPasswordDummy = 'dummyPassword?@12334';
        User testUser = new user();
        System.assert(OSB_LightningSelfRegisterController.isValidPassword(TEST_PASSWORD, TEST_PASSWORD) == true);
        System.assert(OSB_LightningSelfRegisterController.isValidPassword(TEST_PASSWORD, testPasswordDummy) == false);
        System.assert(OSB_LightningSelfRegisterController.isValidPassword(TEST_PASSWORD, null) == false);
        System.assert(OSB_LightningSelfRegisterController.isValidPassword(null, testPasswordDummy) == false);
        OSB_LightningSelfRegisterController.validatePassword(testUser, TEST_PASSWORD, testPasswordDummy);
    }

    @IsTest
    static void testSiteAsContainerEnabled() {
        String testUrlSite = 'https://portaleu1-developer-edition.eu11.force.com';
        System.assertNotEquals(null, OSB_LightningSelfRegisterController.siteAsContainerEnabled(testUrlSite));
    }

    @IsTest
    static void testSendDataToPing() {
        Contact idContact = initializeContact();
        Contact notInsertedContact = initializeContactNotMock();

        OSB_SRV_PingIntegration serviceMock = (OSB_SRV_PingIntegration) mocks.mock(OSB_SRV_PingIntegration.class);
        ORG_Application.service.setMock(OSB_SRV_PingIntegration.IService.class, serviceMock);
		SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        
        mocks.startStubbing();
        mocks.when(serviceMock.getUser(fflib_Match.anyString())).thenReturn(null);
        mocks.when(serviceMock.createUser((Map<String, Object>) fflib_Match.anyObject())).thenReturn('dsad');
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {idContact.Id})).thenReturn(new List<Contact> {idContact});
        mocks.when(contactsSelector.selectByIdentityNumberWoSharing(new Set<String> {TEST_IDENTITYNUM})).thenReturn(new List<Contact> {notInsertedContact});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        
        Test.startTest();
        Object result = OSB_LightningSelfRegisterController.sendDataToPing(idContact, TEST_PASSWORD, TEST_IDENTITYNUM);
        Object resultNoId = OSB_LightningSelfRegisterController.sendDataToPing(notInsertedContact, TEST_PASSWORD, TEST_IDENTITYNUM);
        Test.stopTest();

        System.assertEquals(result,'dsad');
        
        ((OSB_SRV_PingIntegration) mocks.verify(serviceMock, 1))
                .getUser(idContact.Email);
        ((OSB_SRV_PingIntegration) mocks.verify(serviceMock, 2))
                .createUser((Map<String, Object>) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldUpdateContactExistingContact(){
        Contact idContact = initializeContact();

		SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {idContact.Id})).thenReturn(new List<Contact> {idContact});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);
        
        Test.startTest();
        Object resultUpdate = OSB_LightningSelfRegisterController.updateContact(idContact, TEST_IDENTITYNUM, TEST_DUMMY_ID);
        Test.stopTest();

        System.assertEquals(resultUpdate,idContact.Id);
 
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendApAccessApprovedEmail(new List<Contact>{idContact}, uowMock);
    }

    @IsTest
    static void shouldUpdateContactNewRecord() {
        Contact notInsertedContact = initializeContactNotMock();

		SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdentityNumberWoSharing(new Set<String> {TEST_IDENTITYNUM})).thenReturn(new List<Contact> {notInsertedContact});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);
        
        Test.startTest();
        Object resultUpdateNoId = OSB_LightningSelfRegisterController.updateContact(notInsertedContact, TEST_IDENTITYNUM, TEST_DUMMY_ID);
        Test.stopTest();

        System.assertEquals(resultUpdateNoId,notInsertedContact.Id);
 
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerDirty((Contact) argument.capture());
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendApAccessApprovedEmail(new List<Contact>{notInsertedContact}, uowMock);
    }
    
    @IsTest
    static void shouldUpdateContactDp() {
        Contact idContact = initializeContact();
        Contact idContactDp = initializeContact(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_DP,idContact.Id);

		SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {idContact.Id})).thenReturn(new List<Contact> {idContact});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {idContactDp.Id})).thenReturn(new List<Contact> {idContactDp});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);
        
        Test.startTest();
        Object resultUpdateDp = OSB_LightningSelfRegisterController.updateContact(idContactDp, TEST_IDENTITYNUM, TEST_DUMMY_ID);
        Test.stopTest();

        System.assertEquals(resultUpdateDp,idContactDp.Id);
 
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendSignUpEmails(new List<Contact>{idContactDp}, uowMock);
    }
    
    @IsTest
    static void testGetterMethod() {
        Contact testContact = initializeContact();
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {testContact.Id})).thenReturn(new List<Contact> {testContact});
        mocks.when(contactsSelector.selectByIdForRegistration(new Set<Id> {testContact.Id})).thenReturn(new List<Contact> {testContact});
        mocks.stopStubbing();
        
        ORG_Application.selector.setMock(contactsSelector);
		
        Object resultIndustry = OSB_LightningSelfRegisterController.getIndustryValues();
        System.assertNotEquals(resultIndustry, null);

        Object resultCountryCodes = OSB_LightningSelfRegisterController.getCountryCodes();
        System.assertNotEquals(resultCountryCodes, null);

        List<Contact> resultContact = OSB_LightningSelfRegisterController.getRecord(testContact.Id);
        System.assertEquals(resultContact[0],testContact);

        List<Contact> resultContactLight = OSB_LightningSelfRegisterController.getLightContact(testContact.Id, false);
        System.assertEquals(resultContactLight[0], testContact);

        Object resultUrls = OSB_LightningSelfRegisterController.getCustomURLS();
        System.assertNotEquals(resultUrls, null);
                 
    }

    @IsTest
    static void lightningSelfRegisterControllerInstantiation() {
        OSB_LightningSelfRegisterController controller = new OSB_LightningSelfRegisterController();
        System.assertNotEquals(controller, null);
    }

    @SuppressWarnings('PMD.ApexUnitTestClassShouldHaveAsserts')
    @isTest
    static void shouldGetDocumentUrl(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        Test.startTest();
        OSB_LightningSelfRegisterController.getOSBDocumentURL('');
        Test.stopTest();
        ((SRV_Document) mocks.verify(serviceMock, 1))
                .getDocumentLink('');
    }

    private static Contact initializeContact() {
        Contact con = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();
        return con;
    }

    private static Contact initializeContact(String osbCommunityAccessRoleDp, Id accessManagerId) {
        Contact con = (Contact) new BLD_Contact()
            .communityAccessManager(accessManagerId)
            .setOSBDefaultData(osbCommunityAccessRoleDp, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();
        return con;
    }

    private static Contact initializeContactNotMock() {
        String defFirstName = 'testFirstName';
        String defLastName = 'testLastName';
        Contact con = (Contact) new BLD_Contact()
            .identityNumber(TEST_IDENTITYNUM)
            .name(defFirstName,defLastName)
            .getRecord();
        return con;
    }
}