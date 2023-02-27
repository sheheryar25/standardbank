/**
 * 
 * Test class for OSB_TeamProfile_Ctrl
 *
 * @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
 * @date July 2020
 */
@IsTest 
public class OSB_TeamProfile_Ctrl_Test {
    private static final String TEST_USER_NAME = 'test@test.com';
    private static final String TEST_EMAIL = 'osbtest@test.com';
    private static final String TEST_CONTACT_FISRT_NAME = 'Test';
    private static final String TEST_CONTACT_LAST_NAME = 'Manager';
    private static final String TEST_CONTACT_PING_ID = '123456789';

    @TestSetup
    static void setup() {
        List<OSB_URLs__c> osbUrls = TEST_DataFactory.getOsbUrls();
        insert osbUrls;
    }

    @IsTest
    static void testGetTeamContacts() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_Users usersSel = (SEL_Users) mocks.mock(SEL_Users.class);
        SEL_Contacts contactsSel = (SEL_Contacts) mocks.mock(SEL_Contacts.class);

        Contact managerContact = (Contact) new BLD_Contact().mock();
        
        Contact teamContact = (Contact) new BLD_Contact()
            .communityAccessManager(managerContact.Id)
            .mock();

        User userMock = (User) new BLD_USER()
            .contactId(managerContact.Id)
            .mock();

        mocks.startStubbing(); 
        mocks.when(usersSel.sObjectType()).thenReturn(User.SObjectType);
        mocks.when(usersSel.selectById(new Set<Id> {UserInfo.getUserId()})).thenReturn(new List<User> {userMock});
        mocks.when(contactsSel.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSel.selectByOneHubManager(new Set<Id> {managerContact.Id})).thenReturn(new List<Contact> {teamContact});
        mocks.when(contactsSel.selectById(new Set<Id> {managerContact.Id})).thenReturn(new List<Contact> {managerContact});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(usersSel); 
        ORG_Application.selector.setMock(contactsSel);

        Map<String, Object> teamContacts = OSB_TeamProfile_Ctrl.getTeamContacts();
        System.assertNotEquals(null, teamContacts);
        System.assertEquals(((List<Contact>) teamContacts.get( OSB_TeamProfile_Ctrl.TEAM_INVITES_KEY))[0], teamContact);
    }

    @isTest
    static void testCreateLightContact() {
        String testContactPingIdTwo = '123456789';
        String testContactEmail = 'test@Contact.testcom';
        String testContactAccessRole = 'Authorised Person';
        String testUserNameStandard = 'test12452Test@standardbank.co.za';
        
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SEL_Accounts accountsSelector = (SEL_Accounts) mocks.mock(SEL_Accounts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);

        BLD_Account accBld = new BLD_Account().name(DMN_Account.STANDARD_BANK_EMPLOYEES);

        Contact commContact = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME,TEST_CONTACT_LAST_NAME)
            .communityAccessRole(testContactAccessRole)
            .email(testContactEmail)
            .pingId(testContactPingIdTwo)
            .commitWork().getRecord();

        Contact contactFound = (Contact) new BLD_Contact()
            .account(accBld)
            .name(TEST_CONTACT_FISRT_NAME, TEST_CONTACT_LAST_NAME)
            .email(TEST_USER_NAME)
            .mock();

        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByUserId(new Set<Id> {UserInfo.getUserId()})).thenReturn(new List<Contact> {commContact});
        mocks.when(contactsSelector.selectByFirstNameLastNameEmail(new Set<String> {TEST_CONTACT_FISRT_NAME}, new Set<String> {TEST_CONTACT_LAST_NAME}, new Set<String> {testContactEmail})).thenReturn(new List<Contact> {commContact});
        mocks.when(contactsSelector.selectByFirstNameLastNameEmail(new Set<String> {TEST_CONTACT_FISRT_NAME}, new Set<String> {TEST_CONTACT_LAST_NAME}, new Set<String> {TEST_USER_NAME})).thenReturn(new List<Contact> {});
        mocks.when(accountsSelector.sObjectType()).thenReturn(Account.SObjectType);
        mocks.when(accountsSelector.selectByRegisteredName(new Set<String> {DMN_Account.STANDARD_BANK_EMPLOYEES})).thenReturn(new List<Account> {(Account) accBld.getRecord()});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.selector.setMock(accountsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);

		List<Contact> contactList = new List<Contact>();
        contactList.add(commContact);
		
        List<Contact> contactList2 = new List<Contact>();
        contactList2.add(contactFound);
        
        Test.startTest();
        Boolean firstContact = OSB_TeamProfile_Ctrl.createLightContact(contactList);
        Boolean secondContact = OSB_TeamProfile_Ctrl.createLightContact(contactList2);
        Test.stopTest();
        
        System.assertNotEquals(null, firstContact);
        System.assertEquals(firstContact,true);
        System.assertNotEquals(null, secondContact);
        System.assertEquals(secondContact,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 4)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 2)).sendDPNpInviteEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }
	
    @isTest
    static void shouldCreateLightContactReinvite() {
    	fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        
        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .setField(Contact.Ping_Id__c, TEST_CONTACT_PING_ID)
            .mock();
		
        Contact designatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_DP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_DECLINED)
            .setField(Contact.Ping_Id__c, TEST_CONTACT_PING_ID)
            .mock();

        Contact missingNominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .email(TEST_EMAIL)
            .mock();
		
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByUserId((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {designatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {designatedPerson.Id})).thenReturn(new List<Contact> {designatedPerson});
        mocks.when(contactsSelector.selectByUserId((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByFirstNameLastNameEmail((Set<String>) fflib_Match.anyObject(), (Set<String>) fflib_Match.anyObject(), (Set<String>) fflib_Match.anyObject())).thenReturn(new List<Contact> {nominatedPerson, designatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {accessManager.Id})).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);
		
        Test.startTest();
        Boolean testResult = OSB_TeamProfile_Ctrl.createLightContact(new List<Contact>{nominatedPerson, designatedPerson, missingNominatedPerson});
        Test.stopTest();
        
        System.assertNotEquals(null, testResult);
        System.assertEquals(testResult,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 3)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendReinviteEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }
    
    @IsTest
    static void shouldApproveNewUserAccess() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);
        
        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();

        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectById(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);

        Test.startTest();
        Boolean approveResult = OSB_TeamProfile_Ctrl.approveNewUserAccess(nominatedPerson.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, approveResult);
        System.assertEquals(approveResult,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendDpNpAccessApprovedEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldDeclineNewUserAccess() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();
        
        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {accessManager.Id})).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);

        Test.startTest();
        Boolean declineResult = OSB_TeamProfile_Ctrl.declineNewUserAccess(nominatedPerson.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, declineResult);
        System.assertEquals(declineResult,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendDpNpAccessDeclinedEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldResendUserInviteLink() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();

        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectById(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {accessManager});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);

        Test.startTest();
        Boolean resendResult = OSB_TeamProfile_Ctrl.resendUserInviteLink(nominatedPerson.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, resendResult);
        System.assert(resendResult,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendDPNpInviteEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldRemoveAccess(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        SEL_Users usersSelector = (SEL_Users) mocks.mock(SEL_Users.class);
        OSB_SRV_EmailSender emailSenderMock = (OSB_SRV_EmailSender) mocks.mock(OSB_SRV_EmailSender.class);

        Contact accessManager = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .mock();

        Contact nominatedPerson = (Contact) new BLD_Contact()
            .communityAccessManager(accessManager.Id)
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_NP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_INACTIVE)
            .mock();
                
        User testUser = (User) new BLD_USER()
            .contactId(nominatedPerson.Id)
            .mock();

        mocks.startStubbing();
        mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(contactsSelector.selectByIdWoSharing(new Set<Id> {accessManager.Id})).thenReturn(new List<Contact> {accessManager});
        mocks.when(contactsSelector.selectByUserId((Set<Id>) fflib_Match.anyObject())).thenReturn(new List<Contact> {nominatedPerson});
        mocks.when(usersSelector.sObjectType()).thenReturn(User.SObjectType); 
        mocks.when(usersSelector.selectByContactId(new Set<Id> {nominatedPerson.Id})).thenReturn(new List<User> {testUser});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(contactsSelector);
        ORG_Application.selector.setMock(usersSelector);
        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.service.setMock(OSB_SRV_EmailSender.IService.class, emailSenderMock);

        Boolean removeResult;
        System.runAs(new User(Id = UserInfo.getUserId())) {
            Test.startTest();
            removeResult = OSB_TeamProfile_Ctrl.deactivateUserOneHubAccessApex(testUser.ContactId);    
            Test.stopTest();
        }
        System.assertNotEquals(null, removeResult);
        System.assertEquals(removeResult,true);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 2)).commitWork();
        ((OSB_SRV_EmailSender) mocks.verify(emailSenderMock, 1)).sendDpNpAccessRemovedEmail((List<Contact>) fflib_Match.anyObject(),(fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldSetOnboardingDate() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        ORG_Application.unitOfWork.setMock(uowMock);

        Id testContactId = fflib_IDGenerator.generate(Contact.SObjectType);

        Test.startTest();
        OSB_TeamProfile_Ctrl.setOnboardingDate(testContactId);
        Test.stopTest();

        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(Contact.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerDirty((Contact) argument.capture());
        Contact editedContact = (Contact) argument.getValue();
        System.assertNotEquals(null, editedContact.OSB_Team_Profile_Onboarding_Tour_Date__c);
    }

}