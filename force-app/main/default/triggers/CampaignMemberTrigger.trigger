/*****************************************************************************************************\
    @ Func Area     : Campaign Members
    @ Author        : Rudolf Niehaus
    @ Date          : 11/2011
    @ Test File     : TestCampaignMemberTrigger
    @ Description   : Default CampaignMember Trigger
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 11/2011
    @ Modification Description : Case#1168
                                - Add section that calls the method "validateRecordLock()" from the 
                                    class CampaignMemberTriggerFunctions() for blocking the insertion / deletion of
                                    new campaign members when a Campiagn is locked   
                                - Add section that calls the method "setContactRecordType()" from the 
                                    class CampaignMemberTriggerFunctions() for updating the 
                                    Contact Record type field on the CampaignMember object
     @ Last Modified By  : Rudolf Niehaus
     @ Last Modified On  : 27/02/2012
     @ Modification Description : Case#5082
                                   Add validateRecordLock() function to the before update event of the trigger 
                                   so that updates will also be blocked and not just deletes and inserts
                                   
    --------------------------------------------------------------------------------------------------------------------------------------
     -------------------------------------------------------------------------------------------------------------------------------------   
        @ Func Area         : Campaign, Campaign Members
        @ Last Modified By  : Nitish Kumar
        @ Last Modified On  : 18/01/2013 
        @ Modification Description : EN- 0011:
                                     - Error Message in CampaignMemberTrigger class put in a custom setting.
                                      - Changed the API from 24 to 27
    --------------------------------------------------------------------------------------------------------------------------------------                                         
******************************************************************************************************/

trigger CampaignMemberTrigger on CampaignMember (before insert, before update, before delete, after delete, after update, after insert){

    //Make instance of the CampaignMemberTriggerFunctions class. The class constructor takes
    //the trigger body as argument
    CampaignMemberTriggerFunctions cf;
    
    
    if(trigger.isDelete){
        cf = new CampaignMemberTriggerFunctions(trigger.old);
    }else{
        cf = new CampaignMemberTriggerFunctions(trigger.new);
    }
    //If member is a contact process else skip and let user know he cannot add leads currently to campaigns
    if(cf.validateMemberType()){
        if(trigger.isBefore){
            if(trigger.isInsert){
                //call class methods
                //block insertions if campaign is locked
                cf.validateRecordLock();
                //update the contact recordtype on the campaign member record
                cf.setContactRecordType();  
            }else if(trigger.isDelete){
                //block deletion if campaign is locked
                cf.validateRecordLock();
            }else if (trigger.isUpdate){
                //block update if campaign is locked
                cf.validateRecordLock();
            }
        }else{
            if(trigger.isInsert){
                cf.addToMemberHostObject();
            }else if(trigger.isUpdate){ 
                cf.updateMemberHostObject();
            }else if(trigger.isDelete){
                cf.deleteFromMemberHostObject();
            }
        }
    }else{
        for(CampaignMember cm : trigger.new){
            cm.addError(ErrorMessages__c.getValues('Campaign_AddLeadValidation').Error_String__c);
        }
    }
    
}