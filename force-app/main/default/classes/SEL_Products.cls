/**
 * Selector layer class for SB_Product__c SObject
 *
 * @author Kyle Cockcroft (kyle@bsky.co.za)
 * @date 2019-06-06
 */
public inherited sharing class SEL_Products extends fflib_SObjectSelector {

    /**
     * This is used to retrieve the sObject name when building the SOQL
     * queries.
     *
     * @return the SObject type for the selector.
    */
    public Schema.SObjectType getSObjectType(){
        return SB_Product__c.SObjectType;
    }

    /**
     * Creates a new instance of the selector via the application class. This is here to allow unit tests to override
     * and inject a mock instead of this class or to switch out this class for a new version.
     *
     * @return instance of the class
    */
    public static SEL_Products newInstance() {
        return (SEL_Products) ORG_Application.selector.newInstance(SB_Product__c.SObjectType);
    }

    /**
     * This is used to retrieve a specific set of SObject fields
     *
     * @return List of SObjectField
    */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            SB_Product__c.Id,
                SB_Product__c.Grand_Parent_Product__c,
                SB_Product__c.CreatedDate,
                SB_Product__c.Parent_Product__c,
                SB_Product__c.Risk_Weighted_Value__c,
                SB_Product__c.Fee_Amount__c,
                SB_Product__c.Total_Fees__c,
                SB_Product__c.RecordTypeId,
                SB_Product__c.Current_Year_Margin__c,
                SB_Product__c.Current_Year_Fees__c,
                SB_Product__c.Bank_Role__c,
                SB_Product__c.Opportunity__c,
                SB_Product__c.Facility_Size__c,
                SB_Product__c.SB_Gross_Participation__c,
                SB_Product__c.Transaction_Type__c,
                SB_Product__c.SB_Hold__c,
                SB_Product__c.SB_Sell_Down__c,
                SB_Product__c.Product_Lead_Source__c
                };
    }
    /**
     * Select without conditions
     *
     * @return List<SB_Product__c>
     */
    public List<SB_Product__c> selectWithoutCondition() {
        return (List<SB_Product__c>) Database.query(
                newQueryFactory()
                        .toSOQL()
        );
    }

    /**
     * This is used to retrieve SB_Product records filtered by Id
     *
     * @param idSet set of record Ids
     * @return List of SB_Product records
    */
    public List<SB_Product__c> selectById(Set<Id> idSet) {
		return (List<SB_Product__c>) selectSObjectsById(idSet);
    }

    /**
     * This is used to retrieve SB_Product records with
     * parent opportunity in specific stages
     *
     * @param stages set of stages for filtering
     * @return List of SB_Product records
    */
    public List<SB_Product__c> selectByOpportunityStages(Set<String> stages) {
        return (List<SB_Product__c>) Database.query(
                newQueryFactory().
                setCondition('Opportunity__r.StageName in :stages').
                toSOQL());
    }

    /**
     * This is used to retrieve SB_Product records filtered by Opportunity
     * Id and GPP
     *
     * @param opportunityIds set of Opportunity Ids
     * @param grandParentProductType value for GPP
     * @return List of SB_Product records
    */
    public List<SB_Product__c> selectByOpportunityIdAndGrandParentProductType(Set<Id> opportunityIds, String grandParentProductType) {
        
        return (List<SB_Product__c>) Database.query(
            newQueryFactory().
            setCondition('Opportunity__c in :opportunityIds AND Grand_Parent_Product__c = :grandParentProductType').
            toSOQL());
    }

    /**
     * This is used to retrieve SB_Product records filtered by Opportunity Id
     *
     * @param opportunityIds
     *
     * @return List of SB_Product records
     */
    public List<SB_Product__c> selectByOpportunityId(Set<Id> opportunityIds) {
        return (List<SB_Product__c>) Database.query(
                newQueryFactory()
                        .setCondition('Opportunity__c IN :opportunityIds')
                        .toSOQL()
        );
    }

    /**
     * @description This is used to retrieve SB_Product records filtered by Id, RecordType Dev Name with additional condition
     * @param idSet set of Opportunity Ids
     * @param recordTypeDevName SB_Product RecordType developer name
     * @param additionalCond Additional Condition
     * @param orderField Order field
     * @param sortOrder ASC or Desc order
     * @param nullsLast Null last or not
     * @return List of SB_Product records
    */
    public List<SB_Product__c> selectByOppIdRecordTypeProductLeadSource(Set<Id> idSet, String recordTypeDevName, String additionalCond, String orderField, fflib_QueryFactory.SortOrder sortOrder, Boolean nullsLast) {
        return (List<SB_Product__c>) Database.query(
                newQueryFactory()
                        .setCondition('Opportunity__c IN: idSet AND RecordType.DeveloperName =: recordTypeDevName ' + additionalCond)
                        .setOrdering(orderField ,sortOrder, nullsLast)
                        .toSOQL()
        );
    }
}