/**
 *
 * @author Caro Reinecke (caro@khonology.com)
 * @date 2018-01-08
 * @description Account Selector Layer class.
 * 
 *****************************************************************************************
 *   @ Last Modified By  :   Maham Hassan
 *   @ Last Modified On  :   04/04/2022
 *   @ Last Modified Reason  : Get list of Record Types on Account Object.
 *
 *****************************************************************************************
 */
@SuppressWarnings('PMD.CognitiveComplexity')
public with sharing class SEL_Accounts extends fflib_SObjectSelector {

    /**
     * getSObjectFieldList
     * @return List<Schema.SObjectField>
     */
    public List<Schema.SObjectField> getSObjectFieldList() {

        return new List<Schema.SObjectField> {
                Account.Name,
                Account.Id,
                Account.ParentId,
                Account.Registration_Number__c,
                Account.CIF__c,
                Account.BillingStreet,
                Account.Phone,
                Account.BillingCity,
                Account.BillingState,
                Account.BillingPostalCode,
                Account.Group_Parent_CIF_Number__c,
                Account.Top_Parent_Id__c,
                Account.Immediate_Parent__c,
                Account.BillingCountry,
                Account.Client_Record_Type__c,
                Account.High_Risk_Business__c,
                Account.Country_of_Revenue__c,
                Account.Entity_Actively_Trade__c,
                Account.Relationship_Roles__c,
                Account.Country_of_Operation__c,
                Account.AnnualRevenue,
                Account.Business_Classification__c,
                Account.KYC_Location__c,
                Account.VAT_Number__c,
                Account.Industry_Code__c,
                Account.Primary_Relationship_Holder__c,
                Account.Professional_or_Non_Professional_Client__c,
                Account.Client_Sector__c,
                Account.Client_Sub_Sector__c,
                Account.RecordTypeId,
                Account.OwnerId,
                Account.Correspondence_Addr_Line1__c,
                Account.Correspondence_City__c,
                Account.Correspondence_Province_Region__c,
                Account.Correspondence_Postal_Code__c,
                Account.Correspondence_Country__c,
                Account.Registered_Suburb__c,
                Account.BPID__c,
                Account.Relationship_Group_Number__c,
                Account.Client_Type__c,
                Account.CIF_Client_Status__c,
                Account.Email_Address__c,
                Account.Market_Segments__c
        };
    }

    /**
     * selectById
     * @return Schema.SObjectType
     */
    public Schema.SObjectType getSObjectType() {
        return Account.sObjectType;
    }

	/**
	 * @description Creates a new instance of the selector via the application class. This is here to allow unit tests to override
	 * and inject a mock instead of this class or to switch out this class for a new version.
	 * @return SEL_Accounts
	 */
	public static SEL_Accounts newInstance() {
		return(SEL_Accounts) ORG_Application.selector.newInstance(Account.SObjectType);
	}
    /**
     * Select without conditions
     *
     * @return List<Account>
     */
    public List<Account> selectWithoutCondition() {
        return (List<Account>) Database.query(
                newQueryFactory()
                        .toSOQL()
        );
    }

    /**
     * selectById
     * @param idSet set of ids
     * @return List<Account>
     */
    public List<Account> selectById(Set<ID> idSet) {
        return (List<Account>) selectSObjectsById(idSet);
    }

    /**
     * selectByCIFNumber
     * @param cifSet set of string
     * @return List<Account>
     */
    public List<Account> selectByCIFNumber(Set<String> cifSet) {

        return (List<Account>) Database.query(
                newQueryFactory().
                        setCondition('CIF__c in :cifSet').
                        toSOQL());
    }

    /**
     * selectByCIFNumberWithClientTeam
     * @param cifSet set of string
     * @return List<Account>
     */
    public List<Account> selectByCIFNumberWithClientTeam(Set<String> cifSet) {

        fflib_QueryFactory accountQueryFactory = newQueryFactory();
        fflib_QueryFactory clientTeamQueryFactory = new SEL_ClientTeams().addQueryFactorySubselect(accountQueryFactory);

        return (List<Account>) Database.query(
                accountQueryFactory.setCondition('CIF__c in :cifSet').toSOQL());
    }

    /**
     * selectByCIFNumberWithClientTeamAndRole
     * @param cifSet set of string
     * @param teamRole string
     * @return List<Account>
     */
    public List<Account> selectByCIFNumberWithClientTeamAndRole(Set<String> cifSet, String teamRole) {

        fflib_QueryFactory accountQueryFactory = newQueryFactory();
        accountQueryFactory.setCondition('CIF__c in :cifSet');
        fflib_QueryFactory clientTeamQueryFactory = accountQueryFactory
                .subselectQuery('Custom_Client_Teams__r')
                .setCondition('Client_Role__c = :teamRole')
                .selectField('Business_Unit__c')
                .selectField('Team_Member_First_Name__c')
                .selectField('Team_Member_Last_Name__c')
                .selectField('Client_Role__c')
                .selectField('GTB__c')
                .selectField('Client_Coordinator_BM__c')
                .selectField('Client_Coordinator__c')
                .selectField('Team_Member__c');

        return (List<Account>) Database.query(
                accountQueryFactory.toSOQL());
    }

    /**
     * selectHierarchyByTopParentIdWithKYCStatus
     * @param idSet set of ids
     * @return List<Account>
     */
    public List<Account> selectHierarchyByTopParentIdWithKYCStatus(Set<Id> idSet) {

        fflib_QueryFactory accountQueryFactory = newQueryFactory();
        fflib_QueryFactory kycStatusQueryFactory = new SEL_KYCStatuses().addQueryFactorySubselect(accountQueryFactory);

        return (List<Account>) Database.query(
                accountQueryFactory.setCondition('Id in :idSet or ParentId in :idSet OR Parent.ParentId in :idSet or Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.Parent.Parent.ParentId in :idSet').toSOQL());

    }

    /**
     * selectTopParentIdByChildId
     * @param idSet set of ids
     * @return Set<Id>
     */
    public Set<Id> selectTopParentIdByChildId(Set<Id> idSet){

        Id topParent;
        Set<Id> topParentIds = new Set<Id>();
        for (Account childAccount :Database.query(
                newQueryFactory().
                        selectField('Id').
                        selectField('ParentId').
                        selectField('Parent.ParentId').
                        selectField('Parent.Parent.ParentId').
                        selectField('Parent.Parent.Parent.ParentId').
                        selectField('Parent.Parent.Parent.Parent.ParentId').
                        selectField('Parent.Parent.Parent.Parent.Parent.ParentId').
                        setCondition('Id in :idSet').
                        toSOQL()))
        {
            topParent = childAccount.Parent.Parent.Parent.Parent.Parent.ParentId;
            if ( topParent == null){ topParent = childAccount.Parent.Parent.Parent.Parent.ParentId;}
            if ( topParent == null){ topParent = childAccount.Parent.Parent.Parent.ParentId;}
            if ( topParent == null){ topParent = childAccount.Parent.Parent.ParentId;}
            if ( topParent == null){ topParent = childAccount.Parent.ParentId;}
            if ( topParent == null){ topParent = childAccount.ParentId;}
            if ( topParent == null){ topParent = childAccount.Id;}
            if ( topParent != null){ topParentIds.add(topParent);}
            topParent = null;
        }
        return topParentIds;
    }

    /**
     * selectByRegistrationNumber
     * @param registrationNumbers set of registered numbers
     * @return List<Account>
     */
    public List<Account> selectByRegistrationNumber(Set<String> registrationNumbers) {

        return (List<Account>) Database.query(
                newQueryFactory().
                        setCondition('Registration_Number__c in :registrationNumbers').
                        toSOQL());
    }

    /**
     * selectByRegisteredName
     * @param registeredNames set of registered names
     * @return List<Account>
     */
    public List<Account> selectByRegisteredName(Set<String> registeredNames) {

        return (List<Account>) Database.query(
                newQueryFactory().
                        setCondition('Name in :registeredNames').
                        toSOQL());
    }

    /**
     * selectGuidById
     * @param ids set of ids
     * @return List<Account>
     */
	public List<Account> selectGuidById(Set<Id> ids) {
        fflib_QueryFactory accountQueryFactory = newQueryFactory(false, false, false);
		accountQueryFactory.setCondition('Id in :ids');
		accountQueryFactory.selectField('GUID__c');    
        return Database.query(accountQueryFactory.toSOQL());
    }

    /**
     * selectBpidById
     * @param ids set of ids
     * @return List<Account>
     */
    public List<Account> selectBpidById(Set<Id> ids) {
        return (List<Account>) Database.query(
                newQueryFactory().
                        setCondition('Id in :ids').
                        toSOQL());
    }

    /**
     * selectByOwners
     * @param ownerIds set of ids
     * @return List<Account>
     */
    public List<Account> selectByOwners(Set<Id> ownerIds) {
        return (List<Account>) Database.query(
                newQueryFactory().
                        setCondition('OwnerId in :ownerIds').
                        toSOQL());
    }

    /**
     * Select the accounts with owner relationship by account ID
     * @param ids set of ids
     * @return List<Account>
     */
    public List<Account> selectAccountsWithOwnerRelByAccountId(Set<Id> ids) {
        fflib_QueryFactory accountQueryFactory = newQueryFactory(false, false, false);
		accountQueryFactory.setCondition('Id in :ids');
		accountQueryFactory.selectField('Owner.Alias');
        accountQueryFactory.selectField('CIF_Client_Status__c');
        accountQueryFactory.selectField('RecordTypeId');
        return Database.query(accountQueryFactory.toSOQL());
    }

    /**
     * Get accounts submitted business assessments
     * <br/>SGPRT-1201
     *
     * @param cifs account cif numbers
     * @param limitCount integer to restrict rows
     * @return list of account
     */
    public List<Account> selectByCifWithSubmittedBusinessAssessments(Set<String> cifs, Integer limitCount) {
        String condition = 'Id in (select Account__c from Business_Assessment__c where Updated_to_Submitted__c != null and Account__r.CIF__c in :cifs)';
        String subCondition = 'Updated_to_Submitted__c != null';
        fflib_QueryFactory aQF = newQueryFactory();
        fflib_QueryFactory baQF = aQF.subselectQuery('Business_Assessments__r').
                addOrdering('Updated_to_Submitted__c', fflib_QueryFactory.SortOrder.DESCENDING).
                setCondition(subCondition).
                setLimit(limitCount);
        return Database.query(aQF.setCondition(condition).toSOQL());
    }

    /**
     * Get list of Record Types on Account Object
     *
     * @return map of record types
     */
    public static Map<Id,Schema.RecordTypeInfo> getRecordTypes() {
        Schema.DescribeSObjectResult d = Schema.SObjectType.Account; 
        return d.getRecordTypeInfosById();
    }
}