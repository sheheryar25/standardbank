/*****************************************************************************************************\
    @ Func Area     : Event Reports; Event Report Attendees
    @ Author        : Rudolf Niehaus
    @ Date          : 11/10/2010
    @ Test File     : SA_TEST_EventReportAttendeeUpdate.cls 
    @ Description   : This trigger adds and deletes manual sharing(Read/Write) on Event Reports for attendees base on
                      the attendee meeting status and contact type. Attendess are only allowed to Read/Write permissions if they 
                      are Internal contacts and have a Status of 'Attended' 
    @ Last Modified By  : Caro Reinecke
    @ Last Modified On  : 07/02/2012
    @ Modification Description : Case# 3805 Fixed the way in which the logic decides when to add or remove the manual share to the event report
    @ Last Modified By  : Caro Reinecke
    @ Last Modified On  : 12/04/2012
    @ Modified Reason   : Case 4296 Event Report Enhancements - allow for attendee status to be set during record creation.
    
    @ Last Modified By  : Wayne Gray
    @ Last Modified On  : 27/06/2012
    @ Modified Reason   : Case #6251- Change contact to use TestFactory    
                          API Version moved from 20 to 25 
                          
    @ Last Modified By  : Charles Mutsu
    @ Last Modified On  : 05/04/2013
    @ Modified Reason   : EN-0102 - Implemented Topics Functionality    
                          API Version moved from 25 to 27   
    
    @ Last Modified By  : Vishnu Vundavalli 
    @ Last Modified On  : 19/03/2015
    @ Modified Reason   : EN-0661 - Implemented functionality to fetch the CST role from the related Client  
    
    @ Last Modified By  : Vaishali Singh
    @ Last Modified On  : 24/03/2015
    @ Modified Reason   : EN-0658 - Removed the attended status check during insert and commented the code which was handling the share when the status was chaged to attended
    
    @ Last Modified By  : Petr Roubal
    @ Last Modified On  : 30/04/2015
    @ Modified Reason   : DEF-001217 - Attendee with Status = Invited does not have access to edit the existing Event Report (quick fix on insert)    
    
    @ Last Modified By  : Abhishek V
    @ Last Modified On  : 16/08/2016
    @ Modified Reason   : DEF-002007 - Filtered the Delete Share list to remove records with Rowcause as "Owner/Rule" from not getting deleted   
******************************************************************************************************/

trigger SA_EventReportAttendeeUpdate on Call_Report_Attendees__c (after delete, after insert, after update, before update, before insert){

    TriggerManager.instance.execute();

    Set<Id> userIds = new Set<Id>();
    Set<Id> contactIds = new Set<Id>();
    Set<Id> repIds = new Set<Id>();
    List<Call_Report_Attendees__c> eraList = new List<Call_Report_Attendees__c>();
    Set<Id> erIds = new Set<Id>();

    if(trigger.isDelete){
        //populate Id SET with contact ID's
        for(Call_Report_Attendees__c at : trigger.old){
            if(at.Call_Report__c != null){
                repIds.add(at.Call_Report__c);
            }
        }
    }else{//insert or update
        //Build a unique set of the attendee contact Id's for later reference for all contacts in the old and new trigger map     
        for (Call_Report_Attendees__c at : Trigger.new){
            //Build a set of the call report Id's for later reference 
            if(at.Call_Report__c != null){
                repIds.add(at.Call_Report__c);
            }
            if(Trigger.isInsert){
                eraList.add(at);
                erIds.add(at.Call_Report__c);
            }
        }

    }
    if(eraList.size()>0){
        SA_EventTriggerHelperClass.createTopic(erIds, eraList);
    }

    //@vishnu(19/03/2015) : EN-0661 - Implemented functionality to fetch the CST role from the related Client
    if(trigger.isBefore){
        List<Call_Report_Attendees__c> lstNewERA ;
        List<Id> contactIds = new List<Id>();

        if(trigger.isInsert) {
            lstNewERA = new list<Call_Report_Attendees__c>();
            for(Call_Report_Attendees__c newERA : trigger.new ){
                if(newERA.Contact_id__c != null && newERA.Call_Report__c != null){
                    lstNewERA.add(newERA);
                    contactIds.add(newERA.Contact_id__c);
                }
            }
            Map<Id, Contact> contactId2Contact = new Map<Id, Contact>([SELECT RecordTypeId FROM Contact WHERE Id IN: contactIds]);
            for(Call_Report_Attendees__c attendees : trigger.new ) {
                if(contactId2Contact.get(attendees.Contact_id__c)!= null){
                    Id attendeeContactRecordTypeId = contactId2Contact.get(attendees.Contact_id__c).RecordTypeId;
                    if(UTL_RecordType.getRecordTypeName(DMN_Contact.OBJ_NAME, attendeeContactRecordTypeId) == 'SA_Client_Contact_Record_Type' && attendees.Type_of_Attendee__c == null) {
                        attendees.Type_of_Attendee__c = 'External';
                    } else if(UTL_RecordType.getRecordTypeName(DMN_Contact.OBJ_NAME, attendeeContactRecordTypeId) == 'SA_Bank_Contact_Record_Type' && attendees.Type_of_Attendee__c == null) {
                        attendees.Type_of_Attendee__c = 'Internal';
                    }
                }
            }

            if(!lstNewERA.isEmpty()){
                SA_EventTriggerHelperClass.updateCorrespondingCSTRole(lstNewERA);
            }
        }else if(trigger.isUpdate){
            lstNewERA = new list<Call_Report_Attendees__c>();

            for(Call_Report_Attendees__c newERA : trigger.new ){
                Call_Report_Attendees__c oldERA = Trigger.oldMap.get(newERA.Id);

                if(oldERA.Contact_id__c != newERA.Contact_id__c && newERA.Contact_id__c != null){
                    lstNewERA.add(newERA);
                }
            }

            if(!lstNewERA.isEmpty()){
                SA_EventTriggerHelperClass.updateCorrespondingCSTRole(lstNewERA);
            }
        }

    } else {
        Map<Id, Call_Report_Attendees__c> id2OldRecords;
        if (Trigger.old != null) {
            id2OldRecords = new Map<Id, Call_Report_Attendees__c>((Call_Report_Attendees__c[]) Trigger.old);
        }
        SHR_CallReport.manageSharing((Call_Report_Attendees__c[]) Trigger.new, id2OldRecords);
    }
}