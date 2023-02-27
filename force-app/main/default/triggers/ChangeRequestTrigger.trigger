trigger ChangeRequestTrigger on Change_Request__e (after insert)  { 
	TriggerManager.instance.execute();
}