/*****************************************************************************************************\
    @ Author        : Praneeth Indraganti
    @ Date          : 5/2015
    @ Test File     : ClientPlanTrigger_test
    @ Description   : Trigger that makes sure that mail is sent to all the core CST
    members when client plan status is approved,EN-0721         
******************************************************************************************************/
trigger ClientPlanTrigger on Client_Plan__c ( before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.instance.execute();
}