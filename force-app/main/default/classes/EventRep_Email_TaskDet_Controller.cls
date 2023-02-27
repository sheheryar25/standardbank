/******************************************************************\
@Author: Anurag Jain
@Date: 26-May-2010 
@Description: Created controller for Custom Components

@Last Modified By: Charles Mutsu
@Last Modified On: 8-Apr-2013
@Last Modified Reason: Limiting the query to handle markup exception in the VF email template Event Report

@Last Modified By: Lebo Ntechane
@Last Modified On: 30-Aug-2018
@Last Modified Reason: Update controller to select Short_description__c instead on Description 
********************************************************************/
public class EventRep_Email_TaskDet_Controller {

    Public Id EventRepId{get;set;}
    Public String TaskStatus{get;set;}
    Private List<Task> taskDet;
    
    public List<Task> getTaskDet()
    {

        if (TaskStatus=='Open')
            taskDet = [select id, Owner.Name, ActivityDate, Who.Name, Short_Description__c,Subject,Type from Task 
                       Where Whatid = :EventRepId and Status != 'Completed' limit 1000];
        else
            taskDet = [select id, Owner.Name, ActivityDate, Who.Name, Short_Description__c,Subject,Type from Task 
                       Where Whatid = :EventRepId and Status = :TaskStatus limit 1000];
                   
        return taskDet;
    }

}