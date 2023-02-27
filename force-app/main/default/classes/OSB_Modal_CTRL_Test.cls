/**
 * Test class for OSB_Modal_CTRL
 *
 * @author Ephetehe Mokgopanyane (ephetehe.mokgopanyane@tetrad.co.za)
 * @date August 2020
 *
 **/
@SuppressWarnings('PMD.ApexUnitTestClassShouldHaveAsserts')
@IsTest
public class OSB_Modal_CTRL_Test {
	@IsTest
    static void shouldCreateUserSubscribedSolution(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        ORG_Application.unitOfWork.setMock(uowMock);
        
        Id knowledgeSolutionId = fflib_IDGenerator.generate(Knowledge__kav.SObjectType);
        
        Test.startTest();
        OSB_Modal_CTRL.createUserSubscribedSolution(knowledgeSolutionId);
        Test.stopTest();
        
        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerNew((Subscribed_Solutions__c) argument.capture());
    }
}