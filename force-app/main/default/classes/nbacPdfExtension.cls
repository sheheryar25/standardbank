/***
  	@ Func Area     	:  IB
  	@ Author        	:  Wayne Solomon
  	@ Modified Date    	:  17 Feb 2020
  	@ User Story    	:  US-4493 -- DM NBAC: SPV New PDF format linked to JV record type
  	@ Description 	    :  As a member of the NBAC team, I should not be allowed to update information on the NBAC once
  	                       the milestone has progressed to "Supported" or "Submitted", however the NBAC should still be
  	                       allowed to generate and attach the PDF, and be able to proceed to the next milestone.  In
  	                       this code I added new field for the constructor to grab and removed commented code.
***/

public class nbacPdfExtension {

    private final Business_Assessment__c b; //Business assessment object 
    public Boolean isCibNbacSpvNoCif {get;set;}
    public Boolean isCibNbacSpvCif {get;set;}
    static final String CIBNBACSPVNOCIF = 'CibNbacSpvNoCif';
    static final String CIBNBACSPVCIF = 'CibNbacSpvCif';

    public nbacPdfExtension(ApexPages.StandardController standardPageController) {
        List<String> fields = new List<String> {'Account__r.Id','Account__r.Primary_Relationship_Holder__c','Account__r.CIF__c','RecordType.DeveloperName'};
        if(!Test.isRunningTest()) standardPageController.addFields(fields);
        b = (Business_Assessment__c)standardPageController.getRecord();
        isCibNbacSpvNoCif = FeatureManagement.checkPermission(CIBNBACSPVNOCIF);
        isCibNbacSpvCif = FeatureManagement.checkPermission(CIBNBACSPVCIF);
    }
    
    public List <Task> getActionItems(){
        List <Task> actionList = new List <Task> ();
		List<Account> clients = [SELECT Id, (SELECT  Account.Name,Subject, Owner.Name, ActivityDate FROM Tasks WHERE
                                             IsClosed = false AND Type = 'NBAC Action Item') FROM Account WHERE
                                 Id = :b.Account__c OR ParentID = :b.Account__c OR Parent.ParentID = :b.Account__c];
		for(Account acc : clients){
		actionList.addAll(acc.Tasks);
        }
        return actionList;
    }
    
    public List <Custom_Client_Team__c> getTeam(){
        List <Custom_Client_Team__c> teamList = new List <Custom_Client_Team__c> 
            ([SELECT Team_Member__r.Name, Client_Role__c FROM Custom_Client_Team__c WHERE Account__c =:b.Account__c AND (Core__c = true OR Client_Coordinator_BM__c = true)]);
        return teamList;
    }

    public List <Opportunity> getOpportunityTeam(){
        return DMN_Opportunity.getOpportunitiesWithTeamMembers(b.Id);
    }

}