@isTest
private class PBB_SRV_RefreshRelatedParties_Test {

	@isTest
	private static void shouldNotCreateAnyRecordsAsNoDataIsReturned() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;
		BLD_Account bAccount = new BLD_Account();
		bAccount.usePBB().guid(new Uuid().getValue());
		bAccount.commitWork();

		PBB_SRV_GatewayAPI_RelatedParties.Response mockedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		mockedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		mockedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship>();

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayAPI_RelatedParties mockedRelatedPartiesService = (PBB_SRV_GatewayAPI_RelatedParties) mocks.mock(PBB_SRV_GatewayAPI_RelatedParties.class);
		mocks.startStubbing();
		mocks.when(mockedRelatedPartiesService.getRelatedParties(bAccount.getRecordId())).thenReturn(mockedResponse);

		mocks.stopStubbing();
		ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RelatedParties.IService.class, mockedRelatedPartiesService);

		Test.startTest();
			PBB_SRV_RefreshRelatedParties.upsertRelatedParties(bAccount.getRecordId());		
		Test.stopTest();
		System.assertEquals(0,[SELECT Id FROM Contact where AccountId = :bAccount.getRecordId()].size());
		System.assertEquals(0,[SELECT Id FROM Individual].size());
	} 
	@isTest
	private static void shouldNotCreateAnyRecordAsNoIndividualPassed() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;
		BLD_Account bAccount = new BLD_Account();
		bAccount.usePBB().guid(new Uuid().getValue());
		bAccount.commitWork();

		PBB_SRV_GatewayAPI_RelatedParties.Response mockedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		mockedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		mockedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship>();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship testRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		testRelatedParty.relationshipType = 'Client';
		testRelatedParty.companyLegalName = 'Acme';
		testRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		mockedResponse.relationshipInformation.relationship.add(testRelatedParty);


		fflib_ApexMocks mocks = new fflib_ApexMocks();
		
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayAPI_RelatedParties mockedRelatedPartiesService = (PBB_SRV_GatewayAPI_RelatedParties) mocks.mock(PBB_SRV_GatewayAPI_RelatedParties.class);
		mocks.startStubbing();
		mocks.when(mockedRelatedPartiesService.getRelatedParties(bAccount.getRecordId())).thenReturn(mockedResponse);

		mocks.stopStubbing();
		ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RelatedParties.IService.class, mockedRelatedPartiesService);

		Test.startTest();
			PBB_SRV_RefreshRelatedParties.upsertRelatedParties(bAccount.getRecordId());		
		Test.stopTest();
		System.assertEquals(0,[SELECT Id FROM Contact where AccountId = :bAccount.getRecordId()].size());
		System.assertEquals(0,[SELECT Id FROM Individual].size());
	}

	@isTest
	private static void shouldCreateOneIndividualAndOneContact() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;
		BLD_Account bAccount = new BLD_Account();
		bAccount.usePBB().guid(new Uuid().getValue());
		bAccount.commitWork();

		PBB_SRV_GatewayAPI_RelatedParties.Response mockedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		mockedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		mockedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship>();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship testRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		testRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL;
		testRelatedParty.companyLegalName = 'Acme';
		testRelatedParty.lastName = 'Apex';
		testRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		mockedResponse.relationshipInformation.relationship.add(testRelatedParty);
		PBB_SRV_GatewayAPI_RelatedParties.Relationship johnRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		johnRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.ENTERPRISE;
		johnRelatedParty.companyLegalName = 'Acme';
		johnRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		johnRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		mockedResponse.relationshipInformation.relationship.add(johnRelatedParty);


		fflib_ApexMocks mocks = new fflib_ApexMocks();
		
		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayAPI_RelatedParties mockedRelatedPartiesService = (PBB_SRV_GatewayAPI_RelatedParties) mocks.mock(PBB_SRV_GatewayAPI_RelatedParties.class);
		mocks.startStubbing();
		mocks.when(mockedRelatedPartiesService.getRelatedParties(bAccount.getRecordId())).thenReturn(mockedResponse);

		mocks.stopStubbing();
		ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RelatedParties.IService.class, mockedRelatedPartiesService);

		Test.startTest();
			PBB_SRV_RefreshRelatedParties.upsertRelatedParties(bAccount.getRecordId());		
		Test.stopTest();
		System.assertEquals(1,[SELECT Id FROM Contact where AccountId = :bAccount.getRecordId()].size());
		System.assertEquals(1,[SELECT Id FROM Individual].size());
	}
	@isTest
	private static void shouldCreateOneIndividualAndOneContactForManyRelationships() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;
		BLD_Account bAccount = new BLD_Account();
		bAccount.usePBB().guid(new Uuid().getValue());
		bAccount.commitWork();

		PBB_SRV_GatewayAPI_RelatedParties.Response mockedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		mockedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		mockedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship> ();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship testRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		testRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL;
		testRelatedParty.companyLegalName = 'Acme';
		testRelatedParty.relationshipType = 'SHAREHOLDER';
		testRelatedParty.lastName = 'Apex';
		testRelatedParty.firstName = 'John';
		testRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship johnRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		johnRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL;
		johnRelatedParty.companyLegalName = 'Acme';
		johnRelatedParty.relationshipType = 'CONTACT PERSON';
		johnRelatedParty.lastName = 'Apex';
		johnRelatedParty.firstName = 'John';
		johnRelatedParty.relatedCustomerGuid = testRelatedParty.relatedCustomerGuid;
		mockedResponse.relationshipInformation.relationship.add(testRelatedParty);
		mockedResponse.relationshipInformation.relationship.add(johnRelatedParty);


		fflib_ApexMocks mocks = new fflib_ApexMocks();

		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
		PBB_SRV_GatewayAPI_RelatedParties mockedRelatedPartiesService = (PBB_SRV_GatewayAPI_RelatedParties) mocks.mock(PBB_SRV_GatewayAPI_RelatedParties.class);
		mocks.startStubbing();
		mocks.when(mockedRelatedPartiesService.getRelatedParties(bAccount.getRecordId())).thenReturn(mockedResponse);

		mocks.stopStubbing();
		ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RelatedParties.IService.class, mockedRelatedPartiesService);

		Test.startTest();
		PBB_SRV_RefreshRelatedParties.upsertRelatedParties(bAccount.getRecordId());
		Test.stopTest();
		System.assertEquals(1, [SELECT Id FROM Contact where AccountId = :bAccount.getRecordId()].size());
		System.assertEquals(1, [SELECT Id FROM Individual].size());
	}

	@isTest
	private static void shouldCreateOneIndividualWithOneTitleForManySameRelationships() {
		Id mockedId = fflib_IDGenerator.generate(Account.getSobjectType());
		PBB_SRV_GatewayAPI_RelatedParties.Response actual;
		BLD_Account bAccount = new BLD_Account();
		bAccount.usePBB().guid(new Uuid().getValue());
		bAccount.commitWork();

		PBB_SRV_GatewayAPI_RelatedParties.Response mockedResponse = new PBB_SRV_GatewayAPI_RelatedParties.Response();
		mockedResponse.relationshipInformation = new PBB_SRV_GatewayAPI_RelatedParties.RelationshipInformation();
		mockedResponse.relationshipInformation.relationship = new List<PBB_SRV_GatewayAPI_RelatedParties.Relationship> ();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship testRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		testRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL;
		testRelatedParty.companyLegalName = 'Acme';
		testRelatedParty.relationshipType = 'SHAREHOLDER';
		testRelatedParty.lastName = 'Apex';
		testRelatedParty.firstName = 'John';
		testRelatedParty.relatedCustomerGuid = new Uuid().getValue();
		PBB_SRV_GatewayAPI_RelatedParties.Relationship johnRelatedParty = new PBB_SRV_GatewayAPI_RelatedParties.Relationship();
		johnRelatedParty.relatedCustomerClassification = PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL;
		johnRelatedParty.companyLegalName = 'Acme';
		johnRelatedParty.lastName = 'Apex';
		johnRelatedParty.firstName = 'John';
		johnRelatedParty.relationshipType = 'SHAREHOLDER';
		johnRelatedParty.relatedCustomerGuid = testRelatedParty.relatedCustomerGuid;
		mockedResponse.relationshipInformation.relationship.add(testRelatedParty);
		mockedResponse.relationshipInformation.relationship.add(johnRelatedParty);

		fflib_ApexMocks mocks = new fflib_ApexMocks();

 		SRV_HttpRequestSender mocekdHttpService = (SRV_HttpRequestSender) mocks.mock(SRV_HttpRequestSender.class);
 		PBB_SRV_GatewayAPI_RelatedParties mockedRelatedPartiesService = (PBB_SRV_GatewayAPI_RelatedParties) mocks.mock(PBB_SRV_GatewayAPI_RelatedParties.class);
 		mocks.startStubbing();
 		mocks.when(mockedRelatedPartiesService.getRelatedParties(bAccount.getRecordId())).thenReturn(mockedResponse);
 
 		mocks.stopStubbing();
 		ORG_Application.service.setMock(PBB_SRV_GatewayAPI_RelatedParties.IService.class, mockedRelatedPartiesService);
 
 		Test.startTest();
 			PBB_SRV_RefreshRelatedParties.upsertRelatedParties(bAccount.getRecordId());
 		Test.stopTest();
 		List<Contact> contacts = [SELECT Id, LastName, FirstName, Title FROM Contact where AccountId = :bAccount.getRecordId()];
 		List<Individual> individuals = [SELECT Id, LastName, FirstName FROM Individual];
 		System.assertEquals(1, individuals.size());
 		System.assertEquals(1, contacts.size());
 
 		System.assertEquals('Apex', individuals[0].LastName);
 		System.assertEquals('John', individuals[0].FirstName);
 
 		System.assertEquals('shareholder', contacts[0].Title.toLowerCase());
 		System.assertEquals('Apex', contacts[0].LastName);
		System.assertEquals('John', contacts[0].FirstName);
 	}
}