trigger RevenueAndProfitabilityTrigger on Revenue_And_Profitability__c (
		before insert, before update, before delete, 
		after insert, after update, after delete, after undelete
) {
	TriggerManager.instance.execute();
}