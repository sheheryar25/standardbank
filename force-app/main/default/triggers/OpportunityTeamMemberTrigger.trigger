/*****************************************************************************************************
    @ Author        : Petr Roubal
    @ Date          : 7 Jan 2016
    @ Test File     : None
    @ Description   : EN-0947 CST - dependency between Opp team role and user global area
                      Trigger helper class that validate user global area and opportunity team role
                      
    @ Last Modified By  : Manoj Gupta
    @ Last Modified on  :  December 2016
    @ Last Modified Reason  : EN-1484 RTB - Sharing is added twice for Opportunity Team Members                      
                      
 ******************************************************************************************************/

trigger OpportunityTeamMemberTrigger on OpportunityTeamMember (before insert, before update, after delete) {
    
   if (Trigger.isInsert || Trigger.isUpdate){
    OpportunityTeamMemberHelper.validateOpportunityTeamMemmbers(Trigger.New);

    }

}