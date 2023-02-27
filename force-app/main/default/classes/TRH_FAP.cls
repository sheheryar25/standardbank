public class TRH_FAP extends ABS_TriggerHandlerBase 
{
    private list<Financial_Account_Permission__c> records
    {
        get { return (list<Financial_Account_Permission__c>)Trigger.new; }
    } 
    
	public override void handleBeforeInsert()
    {
		OSB_FAP_DuplicatePrevention.preventDupe(records);
	}
    
    public override void handleBeforeUpdate()
    {  
		OSB_FAP_DuplicatePrevention.preventDupe(records);
	}
}