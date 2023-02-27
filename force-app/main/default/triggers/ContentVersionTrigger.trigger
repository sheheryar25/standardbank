trigger ContentVersionTrigger on ContentVersion (before delete, before insert, before update, after delete, after insert, after update) {
    TriggerManager.instance.execute();
}