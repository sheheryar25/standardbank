/**
 * @description       : This function will 
 * @author            : Chibuye Kunda
 * @group             : 
 * @last modified on  : 10-14-2021
 * @last modified by  : Chibuye Kunda
**/
public with sharing class AOB_CTRL_ACPicklist {
    /**
    * @description This function will search for potential matches
    * @param    String label can be one of these values
    * @return List<AOB_ReferencedData__c> 
    **/
    @AuraEnabled
    public static List<AOB_ReferencedData__c> loadData(String targetValue){
        List<AOB_ReferencedData__c> referenceDataList;

        try{
            referenceDataList = [SELECT Id, Name
                                 FROM AOB_ReferencedData__c
                                 WHERE (AOB_SapField__c=:targetValue)
                                 WITH SECURITY_ENFORCED
                                 ORDER BY Name];
        }
        catch(QueryException exp){
            throw new AuraHandledException(exp.getMessage());
        }
        
        return referenceDataList;
    }
}