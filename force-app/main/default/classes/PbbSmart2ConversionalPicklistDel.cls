/**
* This is Batch class that will deletes records at a scheduled time before making a Callout to Smart2 
* @author       Sandile Mathe
* @date         April 2021
**/
Public class PbbSmart2ConversionalPicklistDel implements Database.Batchable<sObject>,Database.AllowsCallouts{
    
    /**
    * This is Start method for a Batch to run the Qyery locator
    * @param	bc Database.BatchableContext of the Apex batch
    * @return   Query locator results
    **/
    public Database.QueryLocator start(Database.BatchableContext bc)
    {
        return Database.getQueryLocator([SELECT Id, Reason__c,Sub_Category__c,Response__c FROM Conversation_Value__c]);
    }

    /**
    * This is exucute method for a Batch to run the and execute results from Query locator
    * @param	bc Database.BatchableContext of the Apex batch
    * @param	scope Object List
    **/
    public void execute(Database.BatchableContext bc, list<sObject> scope)
    {

    	delete scope;
    }
    
    /**
    * This is Finish Method for a batch Job
    * @param	bc Database.BatchableContext of the Apex batch
    **/
    public void finish(Database.BatchableContext bc)
    {
        PbbSmart2ConversationPicklistSync.mergeResponseAndReason();
    }
}