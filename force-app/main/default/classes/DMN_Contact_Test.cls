/**
 * Test class for DMN_Contact
 *
 * @AUTHOR Omar Berraj
 * @date August 2020
 */
@IsTest (IsParallel = true)
private class DMN_Contact_Test {

    @IsTest
    public static void shouldUpdateEventReportCSuiteFlagToChecked() {

        // Create Mocks
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_CallReportAttendees eventAttendeesSelectorMock = (SEL_CallReportAttendees) mocks.mock(SEL_CallReportAttendees.class);

        Contact testContact = (Contact) new BLD_Contact().contactCategory('CEO').mock();
        Call_Report_Attendees__c testAttendee = (Call_Report_Attendees__c) new BLD_CallReportAttendee()
                .contactId(testContact.Id)
                .callReport(new BLD_CallReport().createdDate(Datetime.now()))
                .status('Invited')
                .mock();

        Contact oldContact = (Contact) testContact.clone();
        oldContact.Contact_Category__c = 'Developer';

        // Given
        mocks.startStubbing();
        mocks.when(eventAttendeesSelectorMock.sObjectType()).thenReturn(Call_Report_Attendees__c.SObjectType);
        mocks.when(eventAttendeesSelectorMock
                .selectByContactIdAndStatus(new Set<Id> { testAttendee.Contact_id__c },
                DMN_CallReportAttendee.STATUS_INVITED,
                DMN_CallReportAttendee.STATUS_ATTENDED))
                .thenReturn(new List<Call_Report_Attendees__c> { testAttendee });
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.selector.setMock(eventAttendeesSelectorMock);

        // When
        Test.startTest();
        DMN_Contact.updateEventReportCSuiteFlag(new Contact[] { testContact }, new Map<Id, Contact> { testContact.Id => oldContact });
        Test.stopTest();

        // Then
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(Call_Report__c.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerDirty((Call_Report__c) argument.capture());
        Call_Report__c updatedCallReport = (Call_Report__c) argument.getValue();
        System.assertEquals(true, updatedCallReport.C_Suite_Attendance__c);
    }

    @IsTest
    public static void shouldNotRetrieveAnyEventReportForUpdate() {

        // Create Mocks
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_CallReportAttendees eventAttendeesSelectorMock = (SEL_CallReportAttendees) mocks.mock(SEL_CallReportAttendees.class);

        Contact testContact = (Contact) new BLD_Contact().contactCategory('CEO').mock();
        Call_Report_Attendees__c testAttendee = (Call_Report_Attendees__c) new BLD_CallReportAttendee()
                .contactId(testContact.Id)
                .callReport(new BLD_CallReport().createdDate(Datetime.newInstance(2019, 9, 15)))
                .status('Invited')
                .mock();

        Contact oldContact = (Contact) testContact.clone();
        oldContact.Contact_Category__c = 'Developer';

        // Given
        mocks.startStubbing();
        mocks.when(eventAttendeesSelectorMock.sObjectType()).thenReturn(Call_Report_Attendees__c.SObjectType);
        mocks.when(eventAttendeesSelectorMock
                .selectByContactIdAndStatus(new Set<Id> { testAttendee.Contact_id__c },
                        DMN_CallReportAttendee.STATUS_INVITED,
                        DMN_CallReportAttendee.STATUS_ATTENDED))
                .thenReturn(new List<Call_Report_Attendees__c> { testAttendee });
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.selector.setMock(eventAttendeesSelectorMock);

        // When
        Test.startTest();
        DMN_Contact.updateEventReportCSuiteFlag(new Contact[] { testContact }, new Map<Id, Contact> { testContact.Id => oldContact });
        Test.stopTest();

        // Then
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(Call_Report__c.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 0)).registerDirty((Call_Report__c) argument.capture());
        Call_Report__c updatedCallReport = (Call_Report__c) argument.getValue();
        System.assertEquals(null, updatedCallReport);
    }

    @IsTest
    public static void shouldSetEmailAndMobileFromAccount() {
        Account testAccount = (Account) new BLD_Account().name('testAcc').email('test@test.com').phone('123456789').getRecord();
        insert testAccount;
        Contact testContact = (Contact) new BLD_Contact().accountId(testAccount.Id).name('test', 'contact').email(null).phone(null).getRecord();
        Test.startTest();
        insert testContact;
        Test.stopTest();
        Contact createdContact = [SELECT Id, Name, Phone, Email FROM Contact WHERE Id = :testContact.Id];
        System.assertEquals(testAccount.Phone, createdContact.Phone);
        System.assertEquals(testAccount.Email_Address__c, createdContact.Email);
    }

    @IsTest
    public static void shouldKeepEmailAndMobileFromContact() {
        Account testAccount = (Account) new BLD_Account().name('testAcc').email('test@test.com').phone('123456789').getRecord();
        insert testAccount;
        Contact testContact = (Contact) new BLD_Contact().accountId(testAccount.Id).name('test', 'contact').getRecord();
        Test.startTest();
        insert testContact;
        Test.stopTest();
        Contact createdContact = [SELECT Id, Name, Phone, Email FROM Contact WHERE Id = :testContact.Id];
        System.assertNotEquals(testAccount.Phone, createdContact.Phone);
        System.assertNotEquals(testAccount.Email_Address__c, createdContact.Email);
    }
}