trigger ClientDataChangeTrigger on Client_Data_Change__c (before insert, before update, before delete, after insert,after update, after delete) {
    TriggerManager.instance.execute();
}