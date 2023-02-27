/**
 * Test class for DMN_Case class
 *
 * @author		Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date		March 2020
 */
@IsTest
private class DMN_Case_TEST {
	    
    private static final String TEST_USER_NAME     = 'caseTest@ccc.com';
    private static User usrOwner;
    private static String ServiceTier = 'Standard';
    private static String USER_TEAM = 'CIBSA-Transactional Products and Services-International Trade Services-Cross Border CoE';

	@TestSetup
	private static void prepareData() {
		TEST_DataFactory.generateConfiguration();
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        System.runAs(new User(Id = UserInfo.getUserId())){

            usrOwner = (User)new BLD_USER(uow).userName(TEST_USER_NAME+'1').useClientServiceUser().syncContact().getRecord();
            uow.commitWork();
        }
        Test.startTest();
        Test.stopTest(); 
        
        system.runAs(usrOwner){
            
          BLD_ServiceType serviceType = new BLD_ServiceType(uow).setRequiredFields()
              							.cibServiceTier(ServiceTier)
              							.useTeam(USER_TEAM);
          uow.commitwork();  
          BLD_Case parentCaseRec = new BLD_Case(uow).useCrossBorder()
                .serviceType(serviceType)
              	.cibServiceTier(ServiceTier)
                .close();
            uow.commitwork(); 
          BLD_Case childCaseRec = new BLD_Case(uow).useRtHandOff() 
                .serviceType(serviceType)
              	.cibServiceTier(ServiceTier)
                .parent(parentCaseRec);
            uow.commitwork(); 
        }
    }
    @IsTest
    static void shouldClearServiceTypeAfterClientChange() {
        Case caseRec = (Case) new BLD_Case().useCrossBorder()
            .serviceTypeId(fflib_IDGenerator.generate(Service_Type__c.SObjectType))
            .accountId(fflib_IDGenerator.generate(Account.SObjectType))
            .getRecord();

        Case oldCase = caseRec.clone(true);
        oldCase.AccountId = fflib_IDGenerator.generate(Account.SObjectType);

        Test.startTest();
        DMN_Case.assignServiceTypesForChangedClients(new List<Case> {caseRec}, new Map<Id, Case> {oldCase.Id => oldCase});
        Test.stopTest();

        System.assertEquals(null, caseRec.Service_Type_Name__c);
    }

    @IsTest
    static void shouldAssignDefaultEntitlement() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SRV_Entitlement entServiceMock = (SRV_Entitlement) mocks.mock(SRV_Entitlement.class);

        Entitlement defaultEntRec = new Entitlement(
            Id = fflib_IDGenerator.generate(Entitlement.SObjectType)
        );

        mocks.startStubbing();
        mocks.when(entServiceMock.getDefaultEntitlement()).thenReturn(defaultEntRec);
        mocks.stopStubbing();

        ORG_Application.service.setMock(SRV_Entitlement.IService.class, entServiceMock);

        Case caseRec = (Case) new BLD_Case().useCrossBorder().getRecord();

        Test.startTest();
        DMN_Case.assignEntitlements(new List<Case> {caseRec}, null);
        Test.stopTest();

        System.assertEquals(defaultEntRec.Id, caseRec.EntitlementId);
    }
    @IsTest
    static void shouldAssignEntitlementBasedOnServiceType() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SRV_Entitlement entServiceMock = (SRV_Entitlement) mocks.mock(SRV_Entitlement.class);
        SEL_ServiceTypes serviceTypesSelector = (SEL_ServiceTypes) mocks.mock(SEL_ServiceTypes.class);

        Service_Type__c serviceType = (Service_Type__c) new BLD_ServiceType()
            .entitlementId(fflib_IDGenerator.generate(Entitlement.SObjectType))
            .mock();

        mocks.startStubbing();
        mocks.when(serviceTypesSelector.sObjectType()).thenReturn(Service_Type__c.SObjectType);
        mocks.when(serviceTypesSelector.selectSObjectsById(new Set<Id> {serviceType.Id})).thenReturn(new List<Service_Type__c> {serviceType});
        mocks.stopStubbing();

        ORG_Application.service.setMock(SRV_Entitlement.IService.class, entServiceMock);
        ORG_Application.selector.setMock(serviceTypesSelector);

        Case caseRec = (Case) new BLD_Case().useCrossBorder()
            .serviceTypeId(serviceType.Id)
            .mock();

        Case oldCase = caseRec.clone(true);
        oldCase.Service_Type_Name__c = null;

        Test.startTest();
        DMN_Case.assignEntitlements(new List<Case> {caseRec}, new Map<Id, Case> {oldCase.Id => oldCase});
        Test.stopTest();

        System.assertEquals(serviceType.Entitlement__c, caseRec.EntitlementId);
        ((SRV_Entitlement) mocks.verify(entServiceMock, mocks.never())).getDefaultEntitlement();
    }
    
    @IsTest
    static void autoCloseChildCases() {
        List<CASE> parentCaseRec = [SELECT id,Status,recordTypeId,parentId FROM CASE WHERE parentId=null];
        List<CASE> parentCaseRec2 =  [SELECT id,Status, parentId FROM CASE];
        Case oldCase = parentCaseRec[0].clone(true);
        oldCase.Status = DMN_Case.STATUS_NEW;
        
        TEST.startTest(); 
        DMN_Case.autoCloseChildCases(new List<Case> {parentCaseRec[0]},new Map<Id, Case> {oldCase.Id => oldCase});               
        TEST.stopTest();
        List<CASE> childCaseRec = [SELECT id,Status FROM CASE WHERE parentId=:parentCaseRec[0].id];
        System.assertEquals(parentCaseRec[0].Status, childCaseRec[0].Status);

    }

}