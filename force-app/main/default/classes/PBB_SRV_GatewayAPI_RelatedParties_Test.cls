@isTest
private class PBB_SRV_GatewayAPI_RelatedParties_Test {

	@IsTest
	private static void shouldThrowExceptionWhen500Returned() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		HttpResponse mockedResponse = new HttpResponse();
		mockedResponse.setBody('');
		mockedResponse.setStatusCode(500);
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayRequestProvider mockedRequestProvider = (PBB_SRV_GatewayRequestProvider) mocks.mock(PBB_SRV_GatewayRequestProvider.class);
		SEL_Accounts mockedSelector = (SEL_Accounts) mocks.mock(SEL_Accounts.class);
		mocks.startStubbing();
		mocks.when(mocekdHttpService.send((HttpRequest) fflib_Match.anyObject(), (Integer) fflib_Match.anyObject())).thenReturn(mockedResponse);
		mocks.when(mockedRequestProvider.getRequestWithToken()).thenReturn(new HttpRequest());
		mocks.when(mockedSelector.sObjectType()).thenReturn(Account.SObjectType);
		mocks.when(mockedSelector.selectGuidById(new Set<Id> { mockedId })).thenReturn(new Account[] { new Account(GUID__c = new Uuid().getValue()) });

		mocks.stopStubbing();
		ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mocekdHttpService);
		ORG_Application.selector.setMock(mockedSelector);
		ORG_Application.service.setMock(PBB_SRV_GatewayRequestProvider.IService.class, mockedRequestProvider);

		Boolean correctExceptionThrown = false;

		Test.startTest();
		try {
			actual = new PBB_SRV_GatewayAPI_RelatedParties().getRelatedParties(mockedId);
		} catch(PBB_SRV_GatewayAPI_RelatedParties.ApiException ex) {
			correctExceptionThrown = true;
		}
		Test.stopTest();
		System.assert(correctExceptionThrown);
	}

	@IsTest
	private static void shouldReturnNullWhen204ClientNotFound() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		HttpResponse mockedResponse = new HttpResponse();
		mockedResponse.setBody('');
		mockedResponse.setStatusCode(204);
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayRequestProvider mockedRequestProvider = (PBB_SRV_GatewayRequestProvider) mocks.mock(PBB_SRV_GatewayRequestProvider.class);
		SEL_Accounts mockedSelector = (SEL_Accounts) mocks.mock(SEL_Accounts.class);
		mocks.startStubbing();
		mocks.when(mocekdHttpService.send((HttpRequest) fflib_Match.anyObject(), (Integer) fflib_Match.anyObject())).thenReturn(mockedResponse);
		mocks.when(mockedRequestProvider.getRequestWithToken()).thenReturn(new HttpRequest());
		mocks.when(mockedSelector.sObjectType()).thenReturn(Account.SObjectType);
		mocks.when(mockedSelector.selectGuidById(new Set<Id> { mockedId })).thenReturn(new Account[] { new Account(GUID__c = new Uuid().getValue()) });

		mocks.stopStubbing();
		ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mocekdHttpService);
		ORG_Application.selector.setMock(mockedSelector);
		ORG_Application.service.setMock(PBB_SRV_GatewayRequestProvider.IService.class, mockedRequestProvider);

		Test.startTest();
		actual = new PBB_SRV_GatewayAPI_RelatedParties().getRelatedParties(mockedId);
		Test.stopTest();
		System.assertEquals(null, actual);
	}

	@IsTest
	private static void shouldReturnResponseWhen200() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;

		HttpResponse mockedResponse = new HttpResponse();
		PBB_SRV_GatewayAPI_RelatedParties.Response expectedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		expectedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		expectedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship> ();

		mockedResponse.setBody(JSON.serialize(expectedResponse));
		mockedResponse.setStatusCode(200);

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayRequestProvider mockedRequestProvider = (PBB_SRV_GatewayRequestProvider) mocks.mock(PBB_SRV_GatewayRequestProvider.class);
		SEL_Accounts mockedSelector = (SEL_Accounts) mocks.mock(SEL_Accounts.class);
		mocks.startStubbing();
		mocks.when(mocekdHttpService.send((HttpRequest) fflib_Match.anyObject(), (Integer) fflib_Match.anyObject())).thenReturn(mockedResponse);
		mocks.when(mockedRequestProvider.getRequestWithToken()).thenReturn(new HttpRequest());
		mocks.when(mockedSelector.sObjectType()).thenReturn(Account.SObjectType);
		mocks.when(mockedSelector.selectGuidById(new Set<Id> { mockedId })).thenReturn(new Account[] { new Account(GUID__c = new Uuid().getValue()) });

		mocks.stopStubbing();
		ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mocekdHttpService);
		ORG_Application.selector.setMock(mockedSelector);
		ORG_Application.service.setMock(PBB_SRV_GatewayRequestProvider.IService.class, mockedRequestProvider);

		Test.startTest();
		actual = new PBB_SRV_GatewayAPI_RelatedParties().getRelatedParties(mockedId);
		Test.stopTest();
		System.assertNotEquals(null, actual);
		System.assertNotEquals(null, actual.relationshipInformation);
		System.assertNotEquals(null, actual.relationshipInformation.relationship);
		System.assertEquals(0, actual.relationshipInformation.relationship.size());
	}

}