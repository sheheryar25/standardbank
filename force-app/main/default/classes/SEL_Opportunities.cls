/**
* @description Selector layer class for Opportunity SObject
*
* @author Kyle Cockroft (kyle@bsky.co.za)
* @date 06-08-2019
*****************************************************************************************
 *   @ Last Modified By  :   Maham Hassan
 *   @ Last Modified On  :   05/04/2022
 *   @ Last Modified Reason  : Get list of Opportunities based on Ids and Account Id.
 *
 *****************************************************************************************
*/
public with sharing class SEL_Opportunities extends fflib_SObjectSelector {

    private Boolean assertCrud = true;
    private Boolean enforceFls = true;
    private Boolean includeSelectorFields = true;

    /**
     * @description Creates a new instance of the selector via the application class.
     *
     * @return
     */
    public static SEL_Opportunities newInstance(){
        return (SEL_Opportunities) ORG_Application.selector.newInstance(Opportunity.SObjectType);
    }

    /**
     * @description Returns the list of Opportunity fields
     *
     * @return List of fields
     */
    public List<Schema.SObjectField> getSObjectFieldList(){
        return new List<Schema.SObjectField> {
            	Opportunity.Id,
                Opportunity.Name,
                Opportunity.StageName,
                Opportunity.Amount,
                Opportunity.Probability,
                Opportunity.CloseDate,
                Opportunity.IgnoreDrawDownValidation__c,
                Opportunity.Short_Summary__c,
                Opportunity.Opportunity_ID__c,
                Opportunity.CurrencyIsoCode
			};
    }

    /**
     * @description Returns the SObject type
     *
     * @return Sobject type
     */
    public Schema.SObjectType getSObjectType(){
        return Opportunity.sObjectType;
    }

    /**
     * @description Set assertCrud field's value. Field can be used when creating instance of fflib_QueryFactory to assert running user's
     *              CRUD on object.
     *
     * @param assertCrud
      *
     * @return
     */
    public SEL_Opportunities withCrudAssert(Boolean assertCrud) {
        this.assertCrud = assertCrud;
        return this;
    }

    /**
     * @description Set enforceFls field's value. Field can be used when creating instance of fflib_QueryFactory to enforce running user's
     *              FLS on object.
     *
     * @param enforceFls
     *
     * @return
     */
    public SEL_Opportunities withFlsEnforced(Boolean enforceFls) {
        this.enforceFls = enforceFls;
        return this;
    }

    /**
     * @description Set includeSelectorFields field's value. Field can be used when creating instance of fflib_QueryFactory to include SObject's fields returned
     *              by getSObjectFieldList method.
     *
     * @param includeSelectorFields
     *
     * @return
     */
    public SEL_Opportunities includeSelectorFields(Boolean includeSelectorFields){
        this.includeSelectorFields = includeSelectorFields;
        return this;
    }

    /**
     * @description Selects opportunities by Ids
     *
     * @param idSet
     *
     * @return List of opportunities
     */
    public List<Opportunity> selectById(Set<ID> idSet) {
		return (List<Opportunity>) selectSObjectsById(idSet);
    }

    /**
     * @description Selects opportunities by Ids and grandparent product type
     *
     * @param opportunityIds
     * @param grandParentProductType
     *
     * @return List of opportunities
     */
    public List<Opportunity> selectByOppIdAndGrandParentProductType(Set<ID> opportunityIds, String grandParentProductType){         
        fflib_QueryFactory oQF = newQueryFactory().setCondition('Id IN :opportunityIds');
		fflib_QueryFactory oliQF = oQF.subSelectQuery('Products__r')
            .selectField('Id')
            .selectField('Grand_Parent_Product__c')
            .selectField('Parent_Product__c')
            .selectField('Risk_Weighted_Value__c')
            .selectField('Fee_Amount__c')
            .selectField('Total_Fees__c')
            .selectField('RecordTypeId')
            .setCondition('Grand_Parent_Product__c = :grandParentProductType');
        return Database.query(oQF.toSOQL());
    }

    /**
     * @description Selects opportunities by CIF number, User Id and start date
     *
     * @param cif
     * @param userId
     * @param startDate
     *
     * @return List of opportunities
     */
    public List<Opportunity> selectByCIFNumberWithStartDate(Set<String> cif, String userId, Date startDate) {
        cif.remove(null);
        String condition = 'OwnerId=:userId AND CreatedDate>=:startDate AND StageName!=\''+DMN_Opportunity.ST_CLOSED_CANCEL+'\' AND Account.CIF__c in:cif';
        return (List<Opportunity>) Database.query(newQueryFactory()
                .setCondition(condition)
                .selectField('Account.CIF__c')
                .selectField('Account.Name')
                .selectField('Owner.Name')
                .toSOQL());
    }


    /**
     * @description Select opportunities with team members
     *
     * @param ids - set of opportunity Ids
     *
     * @return List of opportunities
     */
    public List<Opportunity> selectByIdWithActiveTeamMembers(Set<Id> ids){
        fflib_QueryFactory oppQF = newQueryFactory().setCondition('Id IN :ids');
        fflib_QueryFactory oppTeamQF = oppQF.subSelectQuery('OpportunityTeamMembers')
                .setCondition('IsActive__c = \'True\'')
                .selectField('UserId');
        return (List<Opportunity>) Database.query(oppQF.toSOQL());
    }

    /**
     * @description Select record by Ids without enforcing CRUD and FLS
     *
     * @param ids
     *
     * @return
     */
    public List<Opportunity> selectByIdsWithoutCrudAndFlsEnforcement(Set<Id> ids){
        return Database.query(newQueryFactory(false, false, true).setCondition('Id IN :ids').toSOQL());
    }

    /**
     * @description Select record by Ids without enforcing CRUD and FLS
     *
     * @param ids 
     *
     * @return
     */
    public List<Opportunity> selectByIdsWithoutSharing(Set<Id> ids){
        String query = newQueryFactory(assertCrud, enforceFls, includeSelectorFields).setCondition('Id IN :ids').toSOQL();
        return new WithoutSharing().selectByIdsWithoutSharing(ids, query);
    }

    /**
     * @description Select record by Ids without enforcing CRUD and FLS
     *
     * @param accountIds Set of Account Ids
     *
     * @return List of Opportunities
     */
    public List<Opportunity> selectByAccountIds(Set<Id> accountIds){
        return (List<Opportunity>) Database.query(newQueryFactory(false, false, true).setCondition('AccountId In :accountIds').toSOQL());
        
    }


    /**
     * @description Select record by Ids 
     *
     * @param ids Set of Ids of Opportunities
     *
     * @return List of Opportunities
     */
    public List<Opportunity> selectByIds(Set<Id> ids){
        return (List<Opportunity>) Database.query(newQueryFactory(false, false, true).setCondition('Id IN :ids').toSOQL());
        
    }


    /**
    * @description Sub class to query data without sharing
    * 
    */
    private without sharing class WithoutSharing{
        /**
        * @description select opportunities by WhatId and RecordTypeId
        * @param ids
        * @param query
        * @return List<Opportunity> - with query results
        */
        private List<Opportunity> selectByIdsWithoutSharing(Set<Id> ids, String query){
            return (List<Opportunity>) Database.query(query);
        }
    }
}