/**
 * Global Client Revenue SObject Trigger
 *
 * @author		Unknown
 * @date		Unknown
 */
trigger GlobalClientRevenueTrigger on Global_Client_Revenue__c (before insert, before update, before delete, after insert, after update, after delete) {
    TriggerManager.instance.execute();
}