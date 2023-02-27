/**
* Test class for DMN_Knowledge
*
* @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
* @date March 2021
*
**/
@isTest
private class DMN_Knowledge_Test{
    
	@isTest
    static void updateSubSolutionsTest(){
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        String articleId;
        Subscribed_Solutions__c subSolution = (Subscribed_Solutions__c) new BLD_Subscribed_Solutions()
            .setOSBData()
            .commitWork()
            .getRecord(); 
        
        List<Knowledge__kav> knowledgeList = [SELECT KnowledgeArticleId, Id, Title,PublishStatus  FROM Knowledge__kav];
        
        User userMock = (User) new BLD_USER()
            .useOneHubAdmin()
            .commitWork()
            .getRecord();
        
        System.runAs(userMock){
            KbManagement.PublishingService.publishArticle(knowledgeList.get(0).KnowledgeArticleId, true);
            knowledgeList = [SELECT RecordTypeId, KnowledgeArticleId, Id, Title,PublishStatus  FROM Knowledge__kav];
        }
        
        Test.startTest();
        DMN_Knowledge.updateSubSolutions(knowledgeList);
        Test.stopTest();
        
        List <Subscribed_Solutions__c> solutions = [SELECT Id, Solution__c FROM Subscribed_Solutions__c];
        System.assertequals(solutions[0].Solution__c, knowledgeList.get(0).Id); 
    }
    
    @isTest
    static void updateChildrenApiTest(){
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        String articleId;
        Child_products__c childProduct = (Child_products__c) new BLD_Child_Products()
            .setOSBData()
            .commitWork()
            .getRecord(); 
        
        List<Knowledge__kav> knowledgeList = [SELECT KnowledgeArticleId, Id, Title,PublishStatus  FROM Knowledge__kav];
        
        User userMock = (User) new BLD_USER()
            .useOneHubAdmin()
            .commitWork()
            .getRecord();
        
        System.runAs(userMock){
            KbManagement.PublishingService.publishArticle(knowledgeList.get(0).KnowledgeArticleId, true);
            knowledgeList = [SELECT RecordTypeId, KnowledgeArticleId, Id, Title,PublishStatus  FROM Knowledge__kav];
        }
        
        Test.startTest();
        DMN_Knowledge.updateChildrenApi(knowledgeList);
        Test.stopTest();
        
        List <Child_products__c> children = [SELECT Id, Knowledge_Parent__c FROM Child_products__c];
        System.assertequals(children[0].Knowledge_Parent__c, knowledgeList.get(0).Id); 
    }
}