trigger Product_Distribution_trigger on Product_Distribution__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.Instance.execute();
}