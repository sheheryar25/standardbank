/**
* Test class for OSB_NewDeviceModal_CTRL
* 
* @author Rasmi Panthangi (rasmi.panthangi@tetrad.co.za)
* @date April 2021
* 
*/
@isTest
public class OSB_NewDeviceModal_CTRL_TEST {
    private static final String TEST_USER_NAME = 'caseTest@ccc.com';
    public static final String OOB_STATUS_HANDLE = 'oobStatusHandle';
    public static final String TEST_USER = 'testUser';
    public static final String TEST_ORG_EMAIL = '@testorg.com';
    
    
    @isTest
    static void shouldCheckLoginStatus(){
        Test.startTest();
        Boolean isLoggedIn = OSB_NewDeviceModal_CTRL.isUserLoggedIn();
        Test.stopTest();
        System.assert(isLoggedIn);
    }
    @isTest
    static void shouldGetQrCode(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        OSB_SRV_NoknokIntegration serviceMock = (OSB_SRV_NoknokIntegration) mocks.mock(OSB_SRV_NoknokIntegration.class);
        ORG_Application.service.setMock(OSB_SRV_NoknokIntegration.IService.class, serviceMock);
        
        Test.startTest();
        Map<String, String> responseMap = OSB_NewDeviceModal_CTRL.getQrCodeDetails();
        Test.stopTest();
        ((OSB_SRV_NoknokIntegration) mocks.verify(serviceMock,1)).getNoknokQrCode();
    }
    @isTest
    static void shouldGetStatusofRegistration(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        OSB_SRV_NoknokIntegration serviceMock = (OSB_SRV_NoknokIntegration) mocks.mock(OSB_SRV_NoknokIntegration.class);
        ORG_Application.service.setMock(OSB_SRV_NoknokIntegration.IService.class, serviceMock);
        
        Test.startTest();
        Map<String, String> responseMap = OSB_NewDeviceModal_CTRL.getStatusofRegistration(OOB_STATUS_HANDLE); 
        Test.stopTest();
        ((OSB_SRV_NoknokIntegration) mocks.verify(serviceMock,1)).getRegistrationStatus(OOB_STATUS_HANDLE);
    }
    
    @IsTest
    static void shouldFlagContact() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        SEL_Contacts contactsSelector = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        
        Account testAcc = (Account)new BLD_Account()
            .useCommB()
            .mock();
        
        Contact nominatedPerson = (Contact) new BLD_Contact()
            .setOSBDefaultData(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP, DMN_Contact.OSB_COMMUNITY_ACCESS_STATUS_APPROVED)
            .accountId(testAcc.Id)
            .contactCategory('Staff')
            .mock();
        
        Profile p = [SELECT Id FROM Profile WHERE Name='OneHub Community User'];
        String uniqueUserName = TEST_USER + DateTime.now().getTime() + TEST_ORG_EMAIL;
        
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        User u = (User)new BLD_USER(uow).userName(TEST_USER_NAME+'1').useClientServiceUser().syncContact().getRecord();
        uow.commitWork();
        
        System.runAs(u) {
            mocks.startStubbing();
            mocks.when(contactsSelector.sObjectType()).thenReturn(Contact.SObjectType);
            mocks.when(contactsSelector.selectByUserId(new Set<Id>{u.id})).thenReturn(new List<Contact>{nominatedPerson});
            mocks.stopStubbing();
            
            ORG_Application.unitOfWork.setMock(uowMock);
            ORG_Application.selector.setMock(contactsSelector);
            
            
            Test.startTest();
            String approveResult = OSB_NewDeviceModal_CTRL.flagContact();
            Test.stopTest();
            
            System.assertEquals(approveResult, OSB_NewDeviceModal_CTRL.MFA_UPDATED_SUCCESS);
            System.assertEquals(true, nominatedPerson.OSB_HideMFA__c);
        }
        
    }
    
    
}