trigger OSB_FAP_Trigger on Financial_Account_Permission__c (before insert, before update)
{
    TriggerManager.Instance.execute();
}