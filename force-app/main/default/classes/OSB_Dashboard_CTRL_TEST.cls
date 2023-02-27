/**
 * Test class for OSB_Dashboard_CTRL
 *
 * @author Wojciech Kowalczyk (wkowalczyk@deloittece.com)
 * @date June 2020
 */
@SuppressWarnings('PMD.ApexUnitTestClassShouldHaveAsserts')
@IsTest(IsParallel=true)
private class OSB_Dashboard_CTRL_TEST {
    @IsTest
    static void shouldGetOnboardingDetails() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_Contacts selectorMock = (SEL_Contacts) mocks.mock(SEL_Contacts.class);

        Contact testContact = (Contact) new BLD_Contact().mock();
        mocks.startStubbing();
        mocks.when(selectorMock.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(selectorMock.selectByUserId((Set<Id>) fflib_Match.anyObject()))
                .thenReturn(new List<Contact> {testContact});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        Contact contacts = OSB_Dashboard_CTRL.getOnboardingDetails();
        Test.stopTest();
        ((SEL_Contacts) mocks.verify(selectorMock, 1))
                .selectByUserId((Set<Id>) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldGetRegisteredApplication() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_SubscribedSolutions selectorMock = (SEL_SubscribedSolutions) mocks.mock(SEL_SubscribedSolutions.class);

        Subscribed_Solutions__c testSubscribedSolution = (Subscribed_Solutions__c) new BLD_Subscribed_Solutions().mock();
        mocks.startStubbing();
        mocks.when(selectorMock.sObjectType()).thenReturn(Subscribed_Solutions__c.SObjectType);
        mocks.when(selectorMock.selectByUserId((Set<Id>) fflib_Match.anyObject()))
                .thenReturn(new List<Subscribed_Solutions__c> {testSubscribedSolution});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(selectorMock);

        Test.startTest();
        OSB_Dashboard_CTRL.getRegisteredApplication();
        Test.stopTest();
        ((SEL_SubscribedSolutions) mocks.verify(selectorMock, 1))
                .selectByUserId((Set<Id>) fflib_Match.anyObject());
    }

    @IsTest
    static void shouldSetOnboardingDate() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        OSB_SRV_OnboardingHandler serviceMock = (OSB_SRV_OnboardingHandler) mocks.mock(OSB_SRV_OnboardingHandler.class);
        ORG_Application.service.setMock(OSB_SRV_OnboardingHandler.IService.class, serviceMock);

        Contact testContact = (Contact) new BLD_Contact().mock();
        Test.startTest();
        OSB_Dashboard_CTRL.setUserContactOnboardingDate(testContact.Id);
        Test.stopTest();
        ((OSB_SRV_OnboardingHandler) mocks.verify(serviceMock, 1))
                .setUserContactOnboardingDate((Set<Id>) fflib_Match.anyObject(), (fflib_ISObjectUnitOfWork) fflib_Match.anyObject());
    }

    @isTest
    static void shouldGetDeviceDetails(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        OSB_SRV_NoknokIntegration serviceMock = ( OSB_SRV_NoknokIntegration) mocks.mock(OSB_SRV_NoknokIntegration.class);
        ORG_Application.service.setMock( OSB_SRV_NoknokIntegration.IService.class, serviceMock);
        Test.startTest();	
        Map<String,Map<String, Object>> responseMap = OSB_Dashboard_CTRL.hasRegisteredDevices();
        Test.stopTest();
       ((OSB_SRV_NoknokIntegration) mocks.verify(serviceMock,1)).getDeviceList();
    }


}