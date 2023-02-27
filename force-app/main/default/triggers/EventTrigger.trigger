trigger EventTrigger on Event (before insert, after insert, before update, after update, after delete) {
    TriggerManager.instance.execute();
}