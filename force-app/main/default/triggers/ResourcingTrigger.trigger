/**
 * @description Trigger for Resourcing object
 *
 * @author Konrad Bruszewski
 * @date July 2020
 */
trigger ResourcingTrigger on Resourcing__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.Instance.execute();
}