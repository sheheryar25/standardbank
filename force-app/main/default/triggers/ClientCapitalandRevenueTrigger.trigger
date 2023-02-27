trigger ClientCapitalandRevenueTrigger on Client_Capital_and_Revenue__c (before insert) {
    Set<String> CIFNumbers = new Set<String>();
    Map<String,Id> AccountMap = new Map<String,Id>();
    
    //JN add CIF Number to Set
    for(Client_Capital_and_Revenue__c CCR : Trigger.new){
        CIFNumbers.add(CCR.Client_CIF_Number__c);
    }
    //JN Add Client and CIF Numbers to Map
    for(Account accountsToMap : [Select Id, CIF__c from Account where CIF__c in:CIFNumbers]){
        AccountMap.put(accountsToMap.CIF__c,accountsToMap.Id);
    }
    
    //Update ClientId on CCR record before save
    if(Trigger.isInsert){
        for(Client_Capital_and_Revenue__c CCR : Trigger.new){
           CCR.Client__c = AccountMap.get(CCR.Client_CIF_Number__c);
        }
    }
}