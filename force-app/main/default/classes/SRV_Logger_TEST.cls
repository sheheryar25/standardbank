@IsTest
private inherited sharing class SRV_Logger_TEST {

	@IsTest
	private static void shouldLogExceptionAndSource() {
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
		ORG_Application.unitOfWork.setMock(uowMock);

		String expectedArea = 'area';
		Test.startTest();
		new SRV_Logger().log(new DmlException('test'), expectedArea);
		Test.stopTest();

		fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
		((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerPublishBeforeTransaction((Log_Event__e) argument.capture());
		Log_Event__e publishedEvent = (Log_Event__e) argument.getValue();
		System.assertEquals(DMN_Log.TYPE_ERROR, publishedEvent.Type__c);
		System.assertEquals(expectedArea, publishedEvent.Area__c);
	}

	@IsTest
	private static void shouldLogExceptionAndSourceAndArea() {
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
		ORG_Application.unitOfWork.setMock(uowMock);
		String expectedSource = 'source';
		String expectedArea = 'area';

		Test.startTest();
		new SRV_Logger().log(new DmlException('test'), expectedArea, expectedSource);
		Test.stopTest();
		fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
		((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerPublishBeforeTransaction((Log_Event__e) argument.capture());
		Log_Event__e publishedEvent = (Log_Event__e) argument.getValue();

		System.assertEquals(DMN_Log.TYPE_ERROR, publishedEvent.Type__c);
		System.assertEquals(expectedSource, publishedEvent.Source__c);
		System.assertEquals(expectedArea, publishedEvent.Area__c);
	}

	@IsTest
	private static void shouldLogExceptionAndSourceAndAreaAndMessages() {
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
		ORG_Application.unitOfWork.setMock(uowMock);
		String expectedSource = 'source';
		String expectedArea = 'area';
		String message = 'test';
		DmlException ex = new DmlException(message);
		List<String> additionalMessages = new List<String>{'message'};

		Test.startTest();
		new SRV_Logger().log(ex, expectedArea, expectedSource, additionalMessages);
		Test.stopTest();
		fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
		((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerPublishBeforeTransaction((Log_Event__e) argument.capture());
		Log_Event__e publishedEvent = (Log_Event__e) argument.getValue();

		System.assertEquals(DMN_Log.TYPE_ERROR, publishedEvent.Type__c);
		System.assertEquals(expectedSource, publishedEvent.Source__c);
		System.assertEquals(expectedArea, publishedEvent.Area__c);
		System.assertEquals(ex.getTypeName() + ': ' + ex.getMessage() + '\n' +additionalMessages[0], publishedEvent.Message__c);
	}
}