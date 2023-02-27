@isTest
private class PBB_SRV_GatewayRequestProviderTest {
	private static PBB_SRV_GatewayRequestProvider.OAuthResponse createMockedOAuthResponse(String expiresIn, String accessToken) {
		PBB_SRV_GatewayRequestProvider.OAuthResponse resp = new PBB_SRV_GatewayRequestProvider.OAuthResponse();
		resp.access_token = accessToken;
		resp.expires_in = expiresIn;
		resp.scope = PBB_SRV_GatewayRequestProvider.SCOPE;
		resp.token_type = 'Bearer';
		resp.consented_on = String.valueOf(System.now().getTime());
		return resp;
	}

	@IsTest
	private static void shouldReturnRequestWithBearerToken() {
		HttpRequest actual;
		String expectedTokenValue = 'testTokenValue';

		HttpResponse mockedResponse = new HttpResponse();
		mockedResponse.setStatusCode(200);
		System.debug(JSON.serialize(createMockedOAuthResponse('7200', expectedTokenValue)));
		mockedResponse.setBody(JSON.serialize(createMockedOAuthResponse('7200', expectedTokenValue)));
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		SRV_HttpRequestSender mockedHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);

		mocks.startStubbing();
		mocks.when(mockedHttpService.send((HttpRequest) fflib_Match.anyObject())).thenReturn(mockedResponse);
		mocks.stopStubbing();
		ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mockedHttpService);

		SRV_HttpRequestSender.IService ser = SRV_HttpRequestSender.newInstance();
		System.debug(ser.send(new HttpRequest()));

		Test.startTest();
		PBB_SRV_GatewayRequestProvider.IService requestProviderService = PBB_SRV_GatewayRequestProvider.newInstance();
		actual = requestProviderService.getRequestWithToken();
		Test.stopTest();

		Cache.OrgPartition orgPart = cache.Org.getPartition(PBB_SRV_GatewayRequestProvider.PARTITION_TOKENS);
		String actualCacheToken = (String) orgPart.get(PBB_SRV_GatewayRequestProvider.PARTITION_TOKEN_NAME);

		System.assertNotEquals(null, actual);
		System.assertEquals('Bearer ' + expectedTokenValue, actual.getHeader('authorization'));
		System.assertEquals(expectedTokenValue, actualCacheToken);
	}

	@IsTest
	private static void shouldThrowExceptionWhen404() {

		HttpResponse mockedResponse = new HttpResponse();
		mockedResponse.setStatusCode(404);
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		SRV_HttpRequestSender mockedHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);

		mocks.startStubbing();
		mocks.when(mockedHttpService.send((HttpRequest) fflib_Match.anyObject())).thenReturn(mockedResponse);
		mocks.stopStubbing();
		ORG_Application.service.setMock(SRV_HttpRequestSender.IService.class, mockedHttpService);

		SRV_HttpRequestSender.IService ser = SRV_HttpRequestSender.newInstance();
		System.debug(ser.send(new HttpRequest()));
		Boolean correctException = true;
		Test.startTest();
		try {
			PBB_SRV_GatewayRequestProvider.newInstance().getRequestWithToken();
		} catch(PBB_SRV_GatewayRequestProvider.AuthException ex) {
			correctException = true;
		}
		Test.stopTest();

		Cache.OrgPartition orgPart = cache.Org.getPartition(PBB_SRV_GatewayRequestProvider.PARTITION_TOKENS);
		String actualCacheToken = (String) orgPart.get(PBB_SRV_GatewayRequestProvider.PARTITION_TOKEN_NAME);

		System.assertEquals(true, correctException);
		System.assertEquals(null, actualCacheToken);
	}

	@IsTest
	private static void shouldGetTokenFromCache() {
		String expectedTokenValue = 'testTokenValueCache';
		HttpRequest actual;
		Cache.OrgPartition orgPart = cache.Org.getPartition(PBB_SRV_GatewayRequestProvider.PARTITION_TOKENS);
		orgPart.put(PBB_SRV_GatewayRequestProvider.PARTITION_TOKEN_NAME, expectedTokenValue, 7000);

		Test.startTest();
		actual = PBB_SRV_GatewayRequestProvider.newInstance().getRequestWithToken();

		Test.stopTest();

		System.assertEquals('Bearer ' + expectedTokenValue, actual.getHeader('authorization'));
	}
}