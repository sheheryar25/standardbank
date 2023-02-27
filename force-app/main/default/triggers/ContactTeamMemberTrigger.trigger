/*****************************************************************************************************\
    @ Func Area     : Contact Team Member
    @ Author        : Jorel Naidoo
    @ Date          : 22/01/2013
    @ Test File     : 
    @ Description   : This is a Before Delete trigger on the Contact Team Member Object
---------------------------------------------------------------------------------------------------------------------------    
   @ Func Area     : Contacts, Contact Team Members
   @ Last Modified By  : Jorel Naidoo
   @ Last Modified On  : 26/02/2013
   @ Modification Description : EN#0099.
                                Added Validation to stop Users from updating the Primary Contact Person via the Contact Team.
---------------------------------------------------------------------------------------------------------------------------
******************************************************************************************************/

trigger ContactTeamMemberTrigger on SA_Contact_Team_Member__c (Before Delete, Before Update, Before Insert) {

if(Trigger.IsDelete){
    for(SA_Contact_Team_Member__c teamMember : Trigger.old){
        if(teamMember.Primary_Contact_Person__c == True){
            teamMember.addError('You cannot Delete a Primary Contact Person, Please specify a new Primary Contact Person and try again');
        }
    }

}

if(Trigger.IsInsert && ContactTriggerFuctions.isAutomatedUpdate == False){
    for(SA_Contact_Team_Member__c teamMember : Trigger.new){
        if(teamMember.Primary_Contact_Person__c == True)
        {
                teamMember.addError('You cannot insert a Primary Contact Person, please specify a new Primary Contact Person on the Contact to update the Contact Team');
        }
    }

}

if(Trigger.IsUpdate && ContactTriggerFuctions.isAutomatedUpdate == False){
    for(SA_Contact_Team_Member__c teamMember : Trigger.new){
        if((trigger.oldMap.get(teamMember.Id).Primary_Contact_Person__c == False && teamMember.Primary_Contact_Person__c == True) || 
           (trigger.oldMap.get(teamMember.Id).Primary_Contact_Person__c == True && teamMember.Primary_Contact_Person__c == False) ||
           (trigger.oldMap.get(teamMember.Id).SA_User__c != teamMember.SA_User__c && teamMember.Primary_Contact_Person__c == True))
        {
                teamMember.addError('You cannot update a Primary Contact Person, please specify a new Primary Contact Person on the Contact to update the Contact Team');
        }
    }

}

}