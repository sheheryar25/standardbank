trigger CreditLineTrigger on Credit_Line__c (before insert, after insert, before update, after update, after delete) {
    TriggerManager.instance.execute();
}