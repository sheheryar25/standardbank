/**
 * APEX Test class for PBB_Lifestyle_RefreshConversations_CTRL.
 * <br/> US-1017
 *
 * @Author Mikołaj Rzepiński (mrzepinski@deloittece.com)
 * @Date September 2020
 */
@isTest
public with sharing class PBB_Smart2RefresherTest {

    @TestSetup
    private static void setupData(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        PBB_SRV_GatewayRequestProvider mockedRequestProvider = (PBB_SRV_GatewayRequestProvider) mocks.mock(PBB_SRV_GatewayRequestProvider.class);
        SRV_HttpRequestSender mockedRequestProvider2 = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
        mocks.startStubbing();
        mocks.when(mockedRequestProvider.getRequestWithToken()).thenReturn(new HttpRequest());
        mocks.stopStubbing();
        ORG_Application.service.setMock(PBB_SRV_GatewayRequestProvider.IService.class, mockedRequestProvider);
        ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mockedRequestProvider2);

        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        BLD_Account account = new BLD_Account(uow)
                .name('test2')
                .guid('4554f98f7cc50135000000000ab6f434')
                .bpid('0530759246');
        BLD_USER user = new BLD_USER(uow)
                .profile('Personal Business Banking Custom Std User - Mobile');
        account.addConversation(
                new BLD_Conversation(uow)
                        .externalId('100908675')
                        .externalIdLeadKey('130679526976'));

        uow.commitWork();
    }

    @isTest
    public static void fetchConversations(){
        String resBody = '{"totalSize": 1, "clientPortfolioConversationList": [{ "newCustN": 530759246, "clientType": "E", "clientName": "SHIVANI", "identification": "8204120062088", "identifier": "11", "tier": "a.BLUE", "conversationId": 100908675, "aeNumber": "0073Y61", "category": "Next Best Offer", "catPosition": 6, "subCategory": "TPFA", "subCatPosition": 59, "detail": "Client.", "actionScript": null, "contactType": null, "response": null, "reason": null, "additionalInformation": null, "expectedRevenue": 0.0,"futureContactDate": 1601547492107, "leadKey": "130679526976"}]}';
        User user = [SELECT Id FROM User][0];

        fflib_ApexMocks mocks = new fflib_ApexMocks();
        PBB_SRV_GatewayApi_Conversations mockedRequestProvider = (PBB_SRV_GatewayApi_Conversations) mocks.mock(PBB_SRV_GatewayApi_Conversations.class);
        PBB_SRV_GatewayRequestProvider mockedRequestProvider3 = (PBB_SRV_GatewayRequestProvider) mocks.mock(PBB_SRV_GatewayRequestProvider.class);
        SRV_HttpRequestSender mockedRequestProvider2 = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
        mocks.startStubbing();
        mocks.when(mockedRequestProvider.getPortfolioConversations(user.Id)).thenReturn((PBB_SRV_GatewayApi_Conversations.Response)JSON.deserialize(resBody, PBB_SRV_GatewayApi_Conversations.Response.class));
        mocks.when(mockedRequestProvider3.getRequestWithToken()).thenReturn(new HttpRequest());
        mocks.stopStubbing();
        ORG_Application.service.setMock(PBB_SRV_GatewayApi_Conversations.IService.class, mockedRequestProvider);
        ORG_Application.service.setMock(PBB_SRV_GatewayRequestProvider.IService.class, mockedRequestProvider3);
        ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mockedRequestProvider2);

        Test.startTest();
        system.runAs(user) {
            PBB_Smart2Refresher.fetchConversationsAndUpdateRecords();
        }
        Test.stopTest();
        List<Conversation__c> conversations = [SELECT Id, Reason__c, OwnerId FROM Conversation__c];
        system.assertEquals(1, conversations.size());
        system.assertEquals(null, conversations[0].Reason__c);
        system.assertEquals(user.Id, conversations[0].OwnerId);
    }

    @isTest
    public static void fetchConversationsNoRecords(){
        String resBody = '{"totalSize": 0, "clientPortfolioConversationList": []}';
        User user = [SELECT Id FROM User][0];

        fflib_ApexMocks mocks = new fflib_ApexMocks();
        PBB_SRV_GatewayApi_Conversations mockedRequestProvider = (PBB_SRV_GatewayApi_Conversations) mocks.mock(PBB_SRV_GatewayApi_Conversations.class);
        mocks.startStubbing();
        mocks.when(mockedRequestProvider.getPortfolioConversations(user.Id)).thenReturn((PBB_SRV_GatewayApi_Conversations.Response)JSON.deserialize(resBody, PBB_SRV_GatewayApi_Conversations.Response.class));
        mocks.stopStubbing();
        ORG_Application.service.setMock(PBB_SRV_GatewayApi_Conversations.IService.class, mockedRequestProvider);

        Test.startTest();
        system.runAs(user) {
            PBB_Smart2Refresher.fetchConversationsAndUpdateRecords();
        }
        Test.stopTest();
        List<Conversation__c> conversations = [SELECT Id, Reason__c, OwnerId FROM Conversation__c];
        system.assertEquals(1, conversations.size());
    }
}