/*************************************************************************\
    @ Func Area:    Tasks, Confidential Tasks, Outlook Sync, Client Service Team Alerts
    @ Last Modified By  :   Y.Balabramham
    @ Last Modified On  :   4/11/2011
    @ Last Modified Reason  : Case - 1845 , When task is created for Account\Opportunity\Contact  Update 2 fileds :
                              Task_name__c,Task_URL__c values in Account\Opportunity\Contact Object
    @ Last Modified By  :   C Reinecke
    @ Last Modified On  :   06/03/2012
    @ Last Modified Reason  : Case - 5158, CST Alerts must only be sent on new event records inserted.
    
    @ Still TODO: Enhance Error Handling; Cater for mixed batches of associated events e.g. opportunities/accounts/contacts from outlook sync.
    
    @ Last Modified By  :   J Naidoo
    @ Last Modified On  :   26/09/2012
    @ Last Modified Reason  : Case - 8163, Added functionality to make existing Task confidential and create a link to the previously related record.    

    @ Last Modified By  :   Abhishek V
    @ Last Modified On  :   19/04/2016
    @ Last Modified Reason  : US: 1280 - Included logic to avoid deletion of tasks by non-admin users

    @ Last Modified By  :   Jarred Schultz
    @ Last Modified On  :   02/11/2018
    @ Last Modified Reason  : US: 3287 - Included Trigger.isUpdate in Trigger.isAfter to create tasks for end to end opporunity tracking
****************************************************************************/

trigger StdBank_TaskAfterInsertUpdate_Trigger on Task (after insert, after update, before update,before delete) {

if(Trigger.isAfter){

    Set<Id> acctIdSet=new Set<ID>();
    Map<Id,Account> acctMap=new Map<Id,Account>();
    Map<Id,Opportunity> oppMap=new Map<Id,Opportunity>();
    Map<Id,Contact> conMap=new Map<Id,Contact>();
    List <Account> lstAcc = new List<Account>(); 
    List <Opportunity> lstOpp = new List<Opportunity>(); 
    List <Contact> lstCon = new List<Contact>();
    
    /***
    
    Checking added task is confidential or not, If it’s confidential not storing any data.
    Checking for task is created for ‘WhatId’ (Opportunity & Client), ‘Whoid’ (Contact).
    
    ***/
    
    for(Task tskObj:Trigger.new)
    {  
       if(tskObj.WhatId!=null){
            acctIdSet.add(tskObj.WhatId);   
       }else{
            acctIdSet.add(tskObj.WhoId);
       }
    }
    
    /***
     Based on accountset getting the valus from object and creating map for the objects .
    ***/
    if(acctIdSet!=null && acctIdSet.size()>0)
    
    {
        lstAcc = [select Id,Task_Name__c,Task_URL__c from Account where Id in : acctIdSet];
        if(lstAcc.size()==0){
            lstOpp = [select Id,Task_Name__c,Task_URL__c from Opportunity where Id in : acctIdSet];
            if(lstOpp.size()==0){
                lstCon = [select Id,Task_Name__c,Task_URL__c from Contact where Id in : acctIdSet];
            
            }
        }
        if(lstAcc.size()>0){
            for(Integer c=0;c<lstAcc.size();c++){
               acctMap.put(lstAcc[c].Id,lstAcc[c]);
            }
        }else if(lstOpp.size()>0){
            
            for(Integer c=0;c<lstOpp.size();c++){
               oppMap.put(lstOpp[c].Id,lstOpp[c]);
            }
        }else if(lstCon.size()>0){
            
            for(Integer c=0;c<lstCon.size();c++){
               conMap.put(lstCon[c].Id,lstCon[c]);
            }
        }
    }
    
    /***
    After inserting Task ,Assign Task subject and Task id values to  Object fields.
    ***/
    
    for (integer i=0; i<Trigger.new.size();i++) {
        
        if(acctMap!=null && acctMap.size()>0){
        
            Account actObj=acctMap.get(Trigger.new[i].whatId);
            if(actObj!=null)
            {
                actobj.Task_Name__c=Trigger.new[i].Subject;
                actObj.Task_URL__c=Trigger.new[i].Id;
                acctMap.put(Trigger.new[i].whatId,actObj);   
            }
        }else if(oppMap!=null && oppMap.size()>0){
            
            Opportunity oppObj=oppMap.get(Trigger.new[i].whatId);
            if(oppObj!=null)
            {
                oppObj.Task_Name__c=Trigger.new[i].Subject;
                oppObj.Task_URL__c=Trigger.new[i].Id;
                oppMap.put(Trigger.new[i].whatId,oppObj);   
            }
         }else if(conMap!=null && conMap.size()>0){  
            
            Contact conObj=conMap.get(Trigger.new[i].WhoId);
            if(conObj!=null)
            {
                conObj.Task_Name__c=Trigger.new[i].Subject;
                conObj.Task_URL__c=Trigger.new[i].Id;
                conMap.put(Trigger.new[i].WhoId,conObj);   
            }
        }
    }

    /***
       Updating objects (Account\Opportunity\Contact ) with   Task subject  and task id   
    ***/
    if (Trigger.isInsert) { // Case 5158
        if(acctMap!=null && acctMap.size()>0){
            Database.SaveResult[] resultSet=Database.update(acctMap.values(),false);
        } 
        if (oppMap!=null && oppMap.size()>0){   
            Database.SaveResult[] resultSet=Database.update(oppMap.values(),false);
        } 
        if (conMap!=null && conMap.size()>0){   
            Database.SaveResult[] resultSet=Database.update(conMap.values(),false);
        }
    }

    if(Trigger.isUpdate)
    {
        System.debug('TEST TASK: Trigger.isUpdate');
        for (integer i=0; i<Trigger.new.size();i++) {
            Task existingTask = Trigger.old[i];
            Task updatedTask = Trigger.new[i];

        }
    }
  }
    
    //US:1280 - Logic to avoid deletion of tasks by non-admin users
    if(Trigger.isBefore){
        if(Trigger.isDelete){
            String ProfileId = userinfo.getprofileid().substring(0,15);
            Boolean adminProfile = false;
            List<SystemAdmin_BA_profileID_task_Deletion__c> profilesIds = SystemAdmin_BA_profileID_task_Deletion__c.getall().values();
            for(SystemAdmin_BA_profileID_task_Deletion__c profId: profilesIds){
                if(ProfileId == profId.Profile_ID__c){
                    adminProfile = True;
                }
            }
            
            for (Task a : Trigger.old){
                if (!adminProfile){
                    a.addError(Label.TaskDeletionErrorMsg,False);
                }
            }
        }
    }
    
}