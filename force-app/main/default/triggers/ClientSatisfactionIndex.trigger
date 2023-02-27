trigger ClientSatisfactionIndex on Client_Satisfaction_Index__c (before insert, before update, before delete, after insert,after update, after delete) {
    TriggerManager.instance.execute();
}