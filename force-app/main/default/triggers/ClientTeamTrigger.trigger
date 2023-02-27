trigger ClientTeamTrigger on Custom_Client_Team__c (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    TriggerManager.instance.execute();
}