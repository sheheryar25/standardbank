/**  * Test class for OSB_YourSolutionTile_CTRL
 *
 * @author Ephetehe Mokgopanyane (ephetehe.mokgopanyane@tetrad.co.za)
 * @date August 2020
 *
 **/
@IsTest
public class OSB_YourSolutionTile_CTRL_Test {
     private static final Boolean STRONGAUTH_FALSE =false;
@IsTest
    static void shouldRemoveUserSubscribedSolution(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        fflib_ISObjectUnitOfWork uowMock = new fflib_SObjectMocks.SObjectUnitOfWork(mocks);
        ORG_Application.unitOfWork.setMock(uowMock);

        Id subscribedSolutionId = fflib_IDGenerator.generate(Subscribed_Solutions__c.SObjectType);

        Test.startTest();
        OSB_YourSolutionTile_CTRL.removeUserSubscribedSolution(subscribedSolutionId);
        Test.stopTest();

        fflib_ArgumentCaptor argument = fflib_ArgumentCaptor.forClass(fflib_ISObjectUnitOfWork.class);
        ((fflib_ISObjectUnitOfWork) mocks.verify(uowMock, 1)).registerDeleted((Subscribed_Solutions__c) argument.capture());
        Subscribed_Solutions__c subscribedSolution = (Subscribed_Solutions__c) argument.getValue();
        System.assertEquals(subscribedSolutionId, subscribedSolution.Id);
    }

    @isTest
    static void checkMfaLogin(){
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        OSB_SRV_PingIntegration serviceMock = (OSB_SRV_PingIntegration) mocks.mock(OSB_SRV_PingIntegration.class);
        ORG_Application.service.setMock(OSB_SRV_PingIntegration.IService.class, serviceMock);
        Test.startTest();
        Boolean strongAuth = OSB_YourSolutionTile_CTRL.mfaLogin();
        Test.stopTest();
        System.assertEquals(strongAuth, STRONGAUTH_FALSE);
        
    }
}