/**
    @ Author                   : Charles Mutsu
    @ Date                     : 03/05/2014
    @ Description     Trigger  : PublicFinancialAnalysis_Trigger
                      Class    : PublicFinancialAnalysis_TriggerFunctions 
 */
 trigger PublicFinancialAnalysis_Trigger on Client_Financial_Analysis__c (before insert,before update) {
    
    
        if(Trigger.isInsert || Trigger.isUpdate){
            PublicFinancialAnalysis_TriggerFunctions.insertPfaRecords(Trigger.new);        
        }
        

}