/*************************************************************************************************
Class Name          : OpportunityProgressTrackerExt
Version             : 1.0
Date Created        : 
Function            : This class acts as Controller of Opportunity Stage visual displayed on 
                      Opportunity Page. This class will manipulate different scenarios on Opportunity
                      record and highlight the corresponding panel on Opportunity Visual.                                                                
Modification Log    :
--------------------------------------------------------------------------------------------------
* Developer              Date                    Description
* ---------------        -----------             ----------------------------------------------
    Shubham               6/2/2014               Initial version of the class.
    Cechova               21/10/2016             Added styling for Lightning
    Olteanu Andrei        11/09/2016             Added green color for Closed - Won
************************************************************* *************************************/
public class OpportunityProgressTrackerExt {
    
    public Id oppId {get;set;}
    public Boolean boolLeadStage {get;set;}
    public Boolean boolLeadWithMileStone {get;set;}
    public Boolean boolDevelopStage {get;set;}
    public Boolean boolDevelopWithMileStone {get;set;}
    public Boolean boolClosedStage {get;set;}
    public Boolean boolLeadStageExpired {get;set;}
    public Boolean boolLeadWithMileStoneExpired {get;set;}
    public Boolean boolDevelopStageExpired {get;set;}
    public Boolean boolDevelopWithMileStoneExpired {get;set;}
    public Boolean boolOrangeOpp {get;set;}
    
    private final Boolean isLightning;
    public String naviLead {get; set;}
    public String naviDevelop {get; set;}
    public String naviClosed {get; set;}
    
    /*
    Method Name - OpportunityProgressTrackerExt()
    Function - Constructor of the class which initializes all the member variables required through out the page.
    Also retrieve Opportunity details and help in checking different scenarios on the page.
    */
    public OpportunityProgressTrackerExt(ApexPages.StandardController controller) {
       
        // Get the current record's id from the page
        oppId = controller.getId();
        initialize();
        processOpportunity();
        isLightning = isPageOriginLightning(ApexPages.currentPage().getParameters());
    }
    
    /*
    Method Name - initialize()
    Function - Called from Constructor of the class and used to initialize different members across the page.
    */
    public void initialize(){
        boolLeadStage = false;
        boolLeadWithMileStone = false;
        boolDevelopStage = false;
        boolDevelopWithMileStone = false;
        boolClosedStage = false;
        boolLeadStageExpired = false;
        boolLeadWithMileStoneExpired = false;
        boolDevelopStageExpired = false;
        boolDevelopWithMileStoneExpired = false;
        boolOrangeOpp = false;
        naviLead = 'incomplete';
        naviDevelop = 'incomplete';
        naviClosed = 'incomplete';
    }
    
    /*
    Method Name - processOpportunity()
    Function - Called from Constructor of the class and used to check different combinations on Opportunity and higlight the particular portion on VF Page.
    */
    public void processOpportunity(){

        //check if opp ID is invalid
        if( oppId == NULL )
            return;

        Boolean ownerChanged = false;
        Opportunity opp = new Opportunity();
        opp = [select Name,StageName, CloseDate, Amount,
                (Select id,name from Products__r), 
                (Select id from OpportunityTeamMembers) from Opportunity where Id =: oppId limit 1];
        
        // Checking if Owner is changed for an Opportunity or Not.
        for(OpportunityFieldHistory oFH : [SELECT Id, IsDeleted, OpportunityId, Field, OldValue, NewValue from OpportunityFieldHistory where OpportunityId =:oppId]){
            if(oFH.Field=='Owner' && oFH.OldValue!=oFH.NewValue)
                ownerChanged = true;
        }
        if(opp.StageName!=null) {   
            if(opp.StageName.equals(OpportunityTriggerUtility.LEAD_STAGE_VALUE)){
                if((opp.OpportunityTeamMembers!=null && opp.OpportunityTeamMembers.size()>0) || ownerChanged){
                    if(opp.CloseDate < Date.today()){
                        boolLeadWithMileStoneExpired = true;
                        naviLead = 'current';
                        naviDevelop = 'incomplete';
                        naviClosed = 'incomplete';
                    }else{
                        boolLeadWithMileStone = true;
                        naviLead = 'current';
                        naviDevelop = 'incomplete';
                        naviClosed = 'incomplete';
                    }    
                } 
                else if(opp.CloseDate < Date.today()){
                    boolLeadStageExpired = true;
                    naviLead = 'current';
                    naviDevelop = 'incomplete';
                    naviClosed = 'incomplete';
                }else{
                    boolLeadStage = true;
                    naviLead = 'current';
                    naviDevelop = 'incomplete';
                    naviClosed = 'incomplete';
               }
            }
        
            if(opp.StageName.equals(OpportunityTriggerUtility.DEVELOP_STAGE_VALUE)){
                if(opp.Products__r==null || opp.Products__r.size()==0 || opp.Amount==0.00){ 
                    boolOrangeOpp = true;
                    naviLead = 'complete';
                    naviDevelop = 'warning';
                    naviClosed = 'incomplete';
                }else if(opp.Products__r!=null && opp.Products__r.size()>0){
                    if(opp.CloseDate < Date.today()){
                        boolDevelopWithMileStoneExpired = true;
                        naviLead = 'complete';
                        naviDevelop = 'current';
                        naviClosed = 'incomplete';
                    }else{
                        boolDevelopWithMileStone = true;
                        naviLead = 'complete';
                        naviDevelop = 'current';
                        naviClosed = 'incomplete';
                   }
                } 
                else if(opp.CloseDate < Date.today()){
                    boolDevelopStageExpired = true;
                    naviLead = 'complete';
                    naviDevelop = 'current';
                    naviClosed = 'incomplete';
                }else{
                    boolDevelopStage = true;
                    naviLead = 'complete';
                    naviDevelop = 'current';
                    naviClosed = 'incomplete';
               }
            }
        
            if(opp.StageName=='3 - Closed Won'){
                boolClosedStage = true;
                naviLead = 'complete';
                naviDevelop = 'complete';
                naviClosed = 'complete';
            }else if (opp.StageName=='4 - Closed Lost'){
                boolClosedStage = true;
                naviLead = 'complete';
                naviDevelop = 'complete';
                naviClosed = 'lost';
            }else if (opp.StageName=='Cancel'){
                boolClosedStage = true;
                naviLead = 'complete';
                naviDevelop = 'complete';
                naviClosed = 'current';
            }   
        }
        
    }
    public Boolean getIsLightning() {
        return this.isLightning;
    }

    public Boolean getIsClassic() {
        return !this.isLightning;
    }

    private Boolean isPageOriginLightning(Map<String, Object> params) {
        if (params.get('sfdcIFrameHost') != null ||
                params.get('sfdcIFrameOrigin') != null ||
                params.get('isdtp') == 'p1') {
            return true;
        } else {
            return false;
        }
    }

}