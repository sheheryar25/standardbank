trigger SB_Product_Trigger on SB_Product__c (before insert, after insert, before update, after update, before delete, after delete, after undelete) {
    SB_Product_TriggerHandler.handleTrigger(Trigger.new, Trigger.old, Trigger.newMap, Trigger.operationType);
    TriggerManager.instance.execute();
}