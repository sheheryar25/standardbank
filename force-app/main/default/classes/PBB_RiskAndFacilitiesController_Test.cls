/**
 * Test class for PBB_RiskAndFacilitiesController
 * US-1008
 *
 * @author Mikołaj Rzepiński (mrzepinski@deloittece.com)
 * @date September 2020
 */
@isTest
private class PBB_RiskAndFacilitiesController_Test {

    @TestSetup
    private static void setup() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        BLD_Account acc = new BLD_Account(uow)
                .name('test')
                .guid('4554f98f7cc50135000000000ab6f52b');
        acc.addAccountInformation(
                new BLD_AccountInformation(uow)
                        .currentBalance(10)
                        .name('testInfo')
                        .accountName('test')
        );
        uow.commitWork();
    }

    @IsTest
    private static void fetchRiskAndFacilities() {
        Account account = [SELECT Id, GUID__c FROM Account][0];
        PBB_SRV_GatewayAPI_RiskAndFacilities.RiskAndFacilities risk = new PBB_SRV_GatewayAPI_RiskAndFacilities.RiskAndFacilities();
        risk.CURRENT_LIMIT = 800;
        risk.DAYS_DISHONOURS_L6M = 0;
        risk.DAYS_IN_EXCESS_L6M = 0;
        risk.DIRECTOR_JUDGEMENT_FLAG = false;
        risk.ERI1=14;
        risk.ERL1=0;
        risk.EXP_MONTHLY_CR_TURN='0';
        risk.HEADROOM='0';
        risk.JUDGEMENT_FLAG=false;
        risk.RISK_MONITORING_TYPE=null;

        fflib_ApexMocks mocks = new fflib_ApexMocks();
        PBB_SRV_GatewayAPI_RiskAndFacilities mockedRequestProvider = (PBB_SRV_GatewayAPI_RiskAndFacilities) mocks.mock(PBB_SRV_GatewayAPI_RiskAndFacilities.class);
        PBB_SRV_GatewayApi_AccountInformation mockedRequestProvider2 = (PBB_SRV_GatewayApi_AccountInformation) mocks.mock(PBB_SRV_GatewayApi_AccountInformation.class);
        mocks.startStubbing();
        mocks.when(mockedRequestProvider.getData(account.GUID__c)).thenReturn(new List<PBB_SRV_GatewayAPI_RiskAndFacilities.RiskAndFacilities>{risk});
        mocks.when(mockedRequestProvider2.getAccountsBalances(account.GUID__c)).thenReturn(new List<PBB_SRV_GatewayApi_AccountInformation.AccountBalances>());
        mocks.stopStubbing();
        ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RiskAndFacilities.IService.class, mockedRequestProvider);
        ORG_Application.service.setMock(PBB_SRV_GatewayApi_AccountInformation.IService.class, mockedRequestProvider2);

        PBB_RiskAndFacilitiesController.DataWrapper wrapper = (PBB_RiskAndFacilitiesController.DataWrapper) PBB_RiskAndFacilitiesController.fetchData(account.Id);

        System.assertEquals(false, wrapper.riskAndFacilitiesAPIReturnedError);
        System.assertEquals(false, wrapper.balanceAPIReturnedError);
    }

    @IsTest
    private static void fetchRiskAndFacilitiesNoData() {
        Account account = [SELECT Id, GUID__c FROM Account][0];

        fflib_ApexMocks mocks = new fflib_ApexMocks();
        PBB_SRV_GatewayAPI_RiskAndFacilities mockedRequestProvider = (PBB_SRV_GatewayAPI_RiskAndFacilities) mocks.mock(PBB_SRV_GatewayAPI_RiskAndFacilities.class);
        PBB_SRV_GatewayApi_AccountInformation mockedRequestProvider2 = (PBB_SRV_GatewayApi_AccountInformation) mocks.mock(PBB_SRV_GatewayApi_AccountInformation.class);
        mocks.startStubbing();
        mocks.when(mockedRequestProvider.getData(account.GUID__c)).thenReturn(new List<PBB_SRV_GatewayAPI_RiskAndFacilities.RiskAndFacilities>());
        mocks.when(mockedRequestProvider2.getAccountsBalances(account.GUID__c)).thenReturn(new List<PBB_SRV_GatewayApi_AccountInformation.AccountBalances>());
        mocks.stopStubbing();
        ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RiskAndFacilities.IService.class, mockedRequestProvider);
        ORG_Application.service.setMock(PBB_SRV_GatewayApi_AccountInformation.IService.class, mockedRequestProvider2);

        PBB_RiskAndFacilitiesController.DataWrapper wrapper = (PBB_RiskAndFacilitiesController.DataWrapper) PBB_RiskAndFacilitiesController.fetchData(account.Id);

        System.assertEquals(false, wrapper.riskAndFacilitiesAPIReturnedError);
        System.assertEquals(false, wrapper.balanceAPIReturnedError);
    }

    @IsTest
    private static void fetchRiskAndFacilitiesError() {
        Account account = [SELECT Id, GUID__c FROM Account][0];

        PBB_RiskAndFacilitiesController.DataWrapper wrapper = (PBB_RiskAndFacilitiesController.DataWrapper) PBB_RiskAndFacilitiesController.fetchData(account.Id);

        System.assertEquals(true, wrapper.riskAndFacilitiesAPIReturnedError);
        System.assertEquals(true, wrapper.balanceAPIReturnedError);
    }

}