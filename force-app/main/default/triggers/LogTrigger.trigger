trigger LogTrigger on Log__c (after insert)  { TriggerManager.instance.execute();  }