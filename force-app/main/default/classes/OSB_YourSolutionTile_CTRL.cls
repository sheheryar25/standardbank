/**
 * OSB_YourSolutionTile_CTRL class for OSBYourSolutionTile Lightning Component
 *
 * @author Ephetehe Mokgopanyane (ephetehe.mokgopanyane@tetrad.co.za)
 * @date August 2020
 *
 **/
public class OSB_YourSolutionTile_CTRL {
	
    /**
     * Deletes a Subscribed Solution record and returns true if successful and false if not
     * 
     * @param  solutionId String
     *
     **/
    @AuraEnabled(Cacheable=false)
    public static void removeUserSubscribedSolution(Id solutionId) {
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        Subscribed_Solutions__c subscribedSolution = new Subscribed_Solutions__c(Id=solutionId);
        uow.registerDeleted(subscribedSolution);
        uow.commitWork();
    }
    /**
    * Checks if the user signed in using Multi-factor Authentication or not
    * @return Boolean strongAuth
    **/
     @AuraEnabled(Cacheable=true)
    public static Boolean mfaLogin() {
        Boolean strongAuth =false;
        if(!Test.isRunningTest()){ 
        strongAuth = OSB_SRV_PingIntegration.newInstance().mfaLogin();
        }
        return strongAuth;
    }
}