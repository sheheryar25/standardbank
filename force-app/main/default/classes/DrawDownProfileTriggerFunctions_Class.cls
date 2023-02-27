/*****************************************************************************************************\
    @ Func Area     : Draw_Down_Profile__c
    @ Author        : Rudolf Niehaus
    @ Date          : 03/07/2012
    @ Test File     : Test Method DrawDownProfile_Vf_Ext_Test
    @ Description   : Case#141: Each draw down profile record per related product has a sequence number. 
                                The number must be in sequence with the draw date of the list of records. 
                                When a user delete, update or insert a record then the sequence numbering 
                                must be adjusted accordingly.

                                NOTE: 
                                The helper class DrawDownProfileTrigger_HelperClass is used to make sure we do not
                                end up in a endless loop when updating the records in the trigger functions class
    -------------------------------------------------------------------------------------
    @ Func Area         : Draw_Down_Profile__c
    @ Last Modified By  : Rudolf Niehaus 
    @ Last Modified On  : 16/07/2012
    @ Modification Description : New method: validateDrawDate(list<Draw_Down_Profile__c> lst, set<Date> drawDate) 
                                 Related Draw Down Profile Draw dates cannot be on the same day.
******************************************************************************************************/

public with sharing class DrawDownProfileTriggerFunctions_Class {
   
    public static void reorderSequenceNumbers(Id pid){
        Id productId = pid;
        
        list<Draw_Down_Profile__c> reorder = [Select Draw_Down_Number__c from Draw_Down_Profile__c where Product__c =: productId
                                              order by Draw_Date__c asc];
        
        Integer x = 1;
        list<Draw_Down_Profile__c> reorderUpdate = new list<Draw_Down_Profile__c>();
        
        for(Draw_Down_Profile__c dd : reorder){
            dd.Draw_Down_Number__c = x;
            
            reorderUpdate.add(dd);
            x++;
        }
        
        try {
          DrawDownProfileTrigger_HelperClass.setEventFired();   
          update reorderUpdate;
        } catch (DMLException ex) {
            System.debug('## Sorting Update NOT successful: ' + ex.getMessage());
        }
    
    }
    
}