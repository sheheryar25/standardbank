/**
 * Selector layer class for KYC_Status__c SObject
 *
 * @author Caro Reinecke (caro@khonology.com)
 * @date 2018-01-08
 */
public with sharing class SEL_KYCStatuses extends fflib_SObjectSelector  {

    public List<Schema.SObjectField> getSObjectFieldList() {

        return new List<Schema.SObjectField> {
                KYC_Status__c.Name,
                KYC_Status__c.Id,
                KYC_Status__c.Client__c,
                KYC_Status__c.Entity_Code__c,
                KYC_Status__c.KYC_Consultant__c,
                KYC_Status__c.KYC_Review_Status__c,
                KYC_Status__c.KYC_Status__c
        };
    }

    public Schema.SObjectType getSObjectType() {
        return KYC_Status__c.sObjectType;
    }

    public List<KYC_Status__c> selectById(Set<ID> idSet) {
        return (List<KYC_Status__c>) selectSObjectsById(idSet);
    }

}