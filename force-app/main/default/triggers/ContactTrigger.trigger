/*****************************************************************************************************\
    @ Func Area     : Contacts, Users
    @ Author        : Rudolf Niehaus
    @ Date          : 12/2010
    @ Test File     : TestContactTrigger
    @ Description   : This is an After Insert and Update Trigger on the Contact Object
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 06/12/2010
    @ Modification Description : Pass the Trigger body to the class BankContact_User_Sync_Future to sync 
                                 updates of the Contact to the related User object
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 15/12/2010
    @ Modification Description : cheduled Apex Batch jobs are considered future classes / processes and you can currently not 
                                call a future class from a future class. In order to prevent a scheduled batch job from running the future class
                                within this Trigger("BankContact_User_Sync_Future.futureUpdateUsers()") we had to add catch the Asyncronise Exception to check if this Trigger was invoked by a 
                                Batch Apex job. If it was then we skip the User update and just print a debug stament.
-------------------------------------------------------------------------------------------------------------------------   
   @ Func Area     : Campaigns, Campaign Members Hosts, Campaign Hosts and Contacts
   @ Last Modified By  : Rudolf Niehaus
   @ Last Modified On  : 15/05/2012
   @ Modification Description : Case#6246:
                                1 - Rename this tigger from "ContactBeforeInsertUpdate" to "ContactTrigger". The reason is to
                                    conform to standard naming conventions   
                                2 - A new class "ContactTriggerFunctions" gets invoked from the after delete event. The method
                                    "merge campaign members"
                                    Functionality was added that will merge campaign members in the custom Campiagn_Members_Host__c object when
                                    Contacts are merge using standard sf functionality.
---------------------------------------------------------------------------------------------------------------------------
   @ Func Area     : Event Report, Event Report Attendees, Contacts
   @ Last Modified By  : Tracy Roberts
   @ Last Modified On  : 15/08/2012
   @ Modification Description : Case#7064.
                                Call the method mergeEventReportAttendees() that will merge the Event Reports Attendees when
                                Contacts are merged.
---------------------------------------------------------------------------------------------------------------------------
   @ Func Area                 : Contacts, Contact Team Member
   @ Last Modified By          : Jorel Naidoo
   @ Last Modified On          : 22/01/2013
   @ Modification Description  : Case#6167.
                                 Functionality to add the Contact Owner to the Contact team as the Primary Contact Person and Update Existing Team Memebers with the Primary Contact Team Flag.
---------------------------------------------------------------------------------------------------------------------------
   @ Func Area     : Contacts, Contact Team Members
   @ Last Modified By  : Jorel Naidoo
   @ Last Modified On  : 26/02/2013
   @ Modification Description : EN#0099.
                                Added Method to update Contact Team Members when a Contact is Merged.Added rule to not add Salesforce Administration to the Contact Team
---------------------------------------------------------------------------------------------------------------------------

   @ Func Area     :Contacts, Accounts
   @ Last Modified By  : Vishnu Vundavalli
   @ Last Modified On  :  25/03/2015
   @ Modification Description : EN-661 : To update the ERABatchUpdatedRequired field on account on contact category change on Contact
   
   @ Func Area     :Contacts, Accounts
   @ Last Modified By  : Vishnu Vundavalli
   @ Last Modified On  : 10/4/2015
   @ Modification Description : EN-661 : Updated to suit changes for Defect 1157
   
 ---------------------------------------------------------------------------------------------------------------------------
 
 @ Last Modified By  :   Manoj Gupta        
@ Last Modified On  :   Oct 2015
@ Last Modified Reason  : Added Salesforce to Salesforce sharing method (Updating Jorel Naidu code from ServCloud Org)

 @ Last Modified By  :   Deeksha Singhal       
@ Last Modified On  :   Feb 2016
@ Last Modified Reason  : EN-1044   

 @ Last Modified By  :   Jana Cechova    
@ Last Modified On  :   Oct 2016
@ Last Modified Reason  : US-1643: Duplicate Client Contact Clean-up - (4) Duplicate Contact Rule

 @ Last Modified By  :   Jana Cechova    
@ Last Modified On  :   Dec 2016
@ Last Modified Reason  : US - 1729: Duplicate Client Contact Clean-up - (4.1) Duplicate Contact Rule - Across Hierarchy

 @ Last Modified By  :   Jarred Schultz    
@ Last Modified On  :   July 2019
@ Last Modified Reason  : C-00002602: Removed reference to mergePccSignatories() method as part of PCC Decom

******************************************************************************************************/
trigger ContactTrigger on Contact (after insert, before insert, before update, after update, after delete, before delete) {

  TriggerManager.instance.execute();
}