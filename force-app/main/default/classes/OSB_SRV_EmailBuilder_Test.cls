/**
 * Test class for OSB_SRV_Email
 *
 * @author Wayde Fagan(Wayde.fagan@tetrad.co.za)
 * @date July 2020
 *
 **/
@IsTest(IsParallel=true)
public class OSB_SRV_EmailBuilder_Test {
    
    private static final String TEST_USER_NAME = 'testCommunityUser124542@test.com';
    private static final String TEST_CONTACT_FISRT_NAME = 'Test';
    private static final String TEST_CONTACT_LAST_NAME = 'Manager';
    private static final String TEST_COMPANY_NAME = 'StandardBank';
    
    @TestSetup
    static void makeData(){
        List<OSB_URLs__c> osbUrls = TEST_DataFactory.getOsbUrls(); 
        insert osbUrls;
        
        SB_Parameters__c sbParameters = new SB_Parameters__c();
        sbParameters.Name = 'OSB_AuthentifiSolutionEmail';
        sbParameters.Value__c = 'test@testemail2312.co.za';
        insert sbParameters;
    }

    @IsTest
    static void shouldCreateCommunityEmailAP() {
        List<Contact> contactList = new List<Contact>();
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        
        BLD_Account accBld = new BLD_Account().name(DMN_Account.STANDARD_BANK_EMPLOYEES);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);
        SEL_Contacts contactsSel = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        
        Contact contactFound = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME, TEST_CONTACT_LAST_NAME)
            .email(TEST_USER_NAME)
            .mock();
        
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(contactsSel.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSel.selectById(new Set<Id> {contactFound.Id})).thenReturn(new List<Contact> {contactFound});
        mocks.stopStubbing();
        
        ORG_Application.selector.setMock(contactsSel);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);

        contactList.add(contactFound);
        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createCommunityEmailAP(contactList);
        Test.stopTest();
        
        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)) .getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)) .getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

    
    @IsTest
    static void shouldCreateCommunityEmailDpNp() { 
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        
        BLD_Account accBld = new BLD_Account().name(DMN_Account.STANDARD_BANK_EMPLOYEES);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);
        
        Contact contactFound = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME, TEST_CONTACT_LAST_NAME)
            .email(TEST_USER_NAME)
            .mock();
        
        Contact contactFoundTwo = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME, TEST_CONTACT_LAST_NAME)
            .email(TEST_USER_NAME)
            .mock();
        
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        
        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createCommunityEmailDP_NP(new List<Contact>{contactFound, contactFoundTwo});
        Test.stopTest();

        System.assertEquals(2, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

    @IsTest
    static void shouldCreateSignUpEmails(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();
        
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);
 
        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createSignUpEmails(new List<Contact>{nominatedPerson});
        Test.stopTest();

        System.assertEquals(2, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 2)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 2)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

    @IsTest
    static void shouldCreateCommunityReinviteEmailDpNp(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();
        
        Contact designatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_DP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED)
            .mock();
        
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createCommunityReinviteEmailDP_NP(new List<Contact>{nominatedPerson, designatedPerson});
        Test.stopTest();

        System.assertEquals(4, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 2)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 2)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }
    
    @IsTest
    static void shouldSendDpNpAccessRemovedEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createDpNpAccessRemovedEmail(new List<Contact>{nominatedPerson});
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

	@IsTest
    static void shouldSendAPAccessApprovedEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createApAccessApprovedEmail(new List<Contact>{accessManager});
        Test.stopTest();
        
        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
	}

	@IsTest
    static void shouldSendAPAccessDeclinedEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createApAccessDeclinedEmail(new List<Contact>{accessManager});
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
	}

    
    @IsTest
    static void shouldCreateDpNpReinviteAccessApprovedEmail(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .setField(Contact.OSB_Contact_Re_invited__c, true)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createDpNpReinviteAccessApprovedEmail(new List<Contact>{accessManager});
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

    @IsTest
    static void shouldSendDpNpAccessDeclinedEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

		Test.startTest();
		List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createDpNpAccessDeclinedEmail(new List<Contact>{nominatedPerson});
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }

    @IsTest
    static void shouldSendNPAccessApprovedEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createDpNpAccessApprovedEmail(new List<Contact>{nominatedPerson});
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }
    
    @IsTest
    static void shouldSendCommunitySolutionEmail() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SRV_Document serviceMock = (SRV_Document) mocks.mock(SRV_Document.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Account newAccount = (Account) new BLD_Account()
            .useCommB()
            .name(TEST_COMPANY_NAME)
            .getRecord();
        
        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .companyName(TEST_COMPANY_NAME)
            .accountId(newAccount.Id)
	        .name(TEST_CONTACT_FISRT_NAME,TEST_CONTACT_LAST_NAME)
            .mock();
	    
	    Formula.recalculateFormulas(new List<Contact> {nominatedPerson});
        mocks.startStubbing();
        mocks.when(serviceMock.getImageLink(fflib_Match.anyString())).thenReturn('https://onehub.standardbank.co.za');
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(SRV_Document.IService.class, serviceMock);
        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        insert new OSB_URLs__c(Name='OSB_FiDEMSolutionEmail',Value__c='test@test.com');
        List<Messaging.SingleEmailMessage> emails = OSB_SRV_EmailBuilder.newInstance().createCommunitySolutionEmail(new List<Contact>{nominatedPerson},'FIDEM');
        Test.stopTest();

        System.assertEquals(1, emails.size());
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_BANNER_IMAGE_NAME);
        ((SRV_Document) mocks.verify(serviceMock, 1)).getImageLink(OSB_SRV_EmailBuilder.OSB_EMAIL_FOOTER_IMAGE_NAME);
    }
}