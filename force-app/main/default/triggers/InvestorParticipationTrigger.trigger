trigger InvestorParticipationTrigger on Investor_Participation__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.Instance.execute();
}