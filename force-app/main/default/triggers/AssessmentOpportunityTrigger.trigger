trigger AssessmentOpportunityTrigger on Assessment_Opportunity__c(before insert, after insert, before update, after update, before delete, after delete, after undelete) {
	TriggerManager.instance.execute();
}