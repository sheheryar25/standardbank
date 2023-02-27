/*********************************************************************************************************************
-------------------------------------------------------------------------------------------------------------------------------------   
    @ Func Area         : PCC__c, Share_Wallet__c, Client (Account)
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 20/11/2012
    @ Modification Description : Case#1263: Client Overview Phase 2:
                                    Rename trigger from PCCShareWalletTrigger to ShareWalletTrigger. rename all PCC_Share_Wallet__c
                                    object names to Share_Wallet__c.
                                    The reason for the above changes is to rename all classes, triggers and objects to reflect the new client overview 
                                    enhancements. i.e. to move the share of wallet functionality from the PCC object and link it to the Client (Account) object
                                    The word PCC is not relevant in any of the share of wallet naming convention, hence we removed it :-)   
--------------------------------------------------------------------------------------------------------------------------------------

    @ Last Modified By  : Ankit Khandelwal
    @ Last Modified On  : 11 Oct 2013
    @ Description       : Added the logic for updating the currency of Share of Wallet Product when 
                          Share of Wallet currency is changed.
                          Updated the API version to 29 
******************************************************************************************************/
trigger ShareWalletTrigger on Share_Wallet__c (before insert, before update,after update) {
    System.Debug('## >>> Share_Wallet__c Trigger <<< run by ' + UserInfo.getName());
    System.debug('##:Trigger.size:' + Trigger.size);
    System.debug('##:getDMLRows/getLimitDMLRows: ' + Limits.getDMLRows() +'/'+ Limits.getLimitDMLRows());
    
    System.debug('##### START: Share_Wallet__c Trigger :START #####');

       if (Trigger.isBefore) {
    
        if (Trigger.isInsert) {
            
            ShareWalletTriggerFunctions.handleShareWalletBeforeInsert(Trigger.new);
        }

        if (Trigger.isUpdate) {
            
            ShareWalletTriggerFunctions.handleShareWalletBeforeUpdate(Trigger.oldMap, Trigger.newMap);
            
            if (Trigger.isAfter)
             ShareWalletTriggerFunctions.UpdateCurrencyOnProducts(Trigger.oldMap, Trigger.newMap);
            
        } 
        
    }
    
    if (Trigger.isAfter){
    
        if (Trigger.isupdate)
             ShareWalletTriggerFunctions.UpdateCurrencyOnProducts(Trigger.oldMap, Trigger.newMap);
         } 
    
    
      System.debug('##### END: Share_Wallet__c Trigger :END #####'); 
    
    }