trigger CallReportTrigger on Call_Report__c (before insert, before update, before delete, after insert,after update, after delete) {
    TriggerManager.instance.execute();
}