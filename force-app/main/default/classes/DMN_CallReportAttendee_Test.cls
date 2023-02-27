/**
 * Test class for DMN_CallReportAttendee
 *
 * @author Omar Berraj
 * @Date August 2020
 *
 */
@IsTest (IsParallel = true)
private class DMN_CallReportAttendee_Test {

    @IsTest
    public static void shouldUpdateEventReportCSuiteFlagToChecked() {

        // Create mocks
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactSelectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);

        Contact testContact = (Contact) new BLD_Contact().contactCategory('CEO').mock();
        Call_Report_Attendees__c testAttendee = (Call_Report_Attendees__c) new BLD_CallReportAttendee()
                .contactId(testContact.Id)
                .callReport(new BLD_CallReport())
                .mock();

        // Given
        mocks.startStubbing();
        mocks.when(contactSelectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactSelectorMock.selectById(new Set<Id> { testContact.Id })).thenReturn( new List<Contact> { testContact });
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.selector.setMock(contactSelectorMock);

        // When
        Test.startTest();
        DMN_CallReportAttendee.updateEventReportCSuiteFlag(new Call_Report_Attendees__c[] { testAttendee });
        Test.stopTest();

        // Then
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(Call_Report__c.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerDirty((Call_Report__c) argument.capture());
        Call_Report__c updatedCallReport = (Call_Report__c) argument.getValue();
        System.assertEquals(true, updatedCallReport.C_Suite_Attendance__c);
    }

    @IsTest
    public static void shouldUpdateEventReportCSuiteFlagToUnchecked() {

        // Create mocks
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactSelectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);

        Contact testContact = (Contact) new BLD_Contact().contactCategory('Develop').mock();
        Call_Report_Attendees__c testAttendee = (Call_Report_Attendees__c) new BLD_CallReportAttendee()
                .contactId(testContact.Id)
                .callReport(new BLD_CallReport())
                .mock();

        // Given
        mocks.startStubbing();
        mocks.when(contactSelectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactSelectorMock.selectById(new Set<Id> { testContact.Id })).thenReturn( new List<Contact> { testContact });
        mocks.stopStubbing();

        ORG_Application.unitOfWork.setMock(uowMock);
        ORG_Application.selector.setMock(contactSelectorMock);

        // When
        Test.startTest();
        DMN_CallReportAttendee.updateEventReportCSuiteFlag(new Call_Report_Attendees__c[] { testAttendee });
        Test.stopTest();

        // Then
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(Call_Report__c.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 0)).registerDirty((Call_Report__c) argument.capture());
        Call_Report__c updatedCallReport = (Call_Report__c) argument.getValue();
        System.assertEquals(null, updatedCallReport);
    }
}