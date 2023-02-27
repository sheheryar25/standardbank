trigger BusinessAssessmentTrigger on Business_Assessment__c (before update, after update, before insert, after insert, after delete, after undelete) {
    TriggerManager.instance.execute();
}