trigger EcosystemEntityTrigger on Ecosystem_Entity__c (
		before insert, 
		before update, 
		before delete, 
		after insert, 
		after update, 
		after delete, 
		after undelete) {
	TriggerManager.instance.execute();
}