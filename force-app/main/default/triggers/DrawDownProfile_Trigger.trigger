/*****************************************************************************************************\
    @ Func Area     : Draw Down Profiles, Opportunities & Products
    @ Author        : Rudolf Niehaus
    @ Date          : 03/07/2012
    @ Test File     : Test Method DrawDownProfile_Vf_Ext_Test
    @ Description   : General Trigger for Draw Down Profile records  
    -------------------------------------------------------------------------------------
   
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 03/07/2012
    @ Modification Description : Case#141: Each draw down profile record per related product has a sequence number. 
                                The number must be in sequence with the draw date of the list of records. 
                                When a user delete, update or insert a record then the sequence numbering 
                                must be adjusted accordingly. 
                                
                                NOTE 1: 
                                The helper class DrawDownProfileTrigger_HelperClass is used to make sure we do not
                                end up in an endless loop when updating the records in the trigger functions class
                                
                                NOTE 2: 
                                Only the first product id is passed to the trigger function. The assumption is that 
                                a user will only mass edit and delete draw down profiles from the UI. This will mean
                                that all records will be linked to on product at a time.
                                Data loading is not feasible due to the complex validation implemented for draw downs
    @ Last Modified By  :  Charles Mutsu	  
    @ Last Modified On  :  28/1/2013
    @ Modification Description :Removed before events from the trigger.   
    							Updated version from 24 to 27                                  
******************************************************************************************************/

trigger DrawDownProfile_Trigger on Draw_Down_Profile__c (after delete, after insert, after update) {
    
    //Static variable used to handle recursion
    if(!DrawDownProfileTrigger_HelperClass.hasEventFired()){
        if(trigger.isAfter){ 
            if(trigger.isDelete){
                DrawDownProfileTriggerFunctions_Class.reorderSequenceNumbers(trigger.old[0].Product__c);    
            }else{
                DrawDownProfileTriggerFunctions_Class.reorderSequenceNumbers(trigger.new[0].Product__c);
            }
        }
    }
}