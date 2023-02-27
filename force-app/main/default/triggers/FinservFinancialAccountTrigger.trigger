trigger FinservFinancialAccountTrigger on finserv__FinancialAccount__c (after insert, after update, after delete) {

    TriggerManager.instance.execute();
}