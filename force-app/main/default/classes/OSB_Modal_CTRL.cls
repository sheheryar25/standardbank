/**
 * OSB_Modal_CTRL class for OSBModal Lightning Component
 *
 * @author Ephetehe Mokgopanyane (ephetehe.mokgopanyane@tetrad.co.za)
 * @date August 2020
 *
 **/
public class OSB_Modal_CTRL {

	/**
     * Inserts a new Subscribed Solution record and returns true if successful and false if not
     * 
     * @param  solutionId String
     *
     **/
    @AuraEnabled(Cacheable=false)
    public static void createUserSubscribedSolution(Id solutionId) {
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        Subscribed_Solutions__c subscribedSolution = new Subscribed_Solutions__c();
        subscribedSolution.User__c = UserInfo.getUserId();
        subscribedSolution.Solution__c = solutionId;
        
        uow.registerNew(subscribedSolution);
        uow.commitWork();
    }
    
}