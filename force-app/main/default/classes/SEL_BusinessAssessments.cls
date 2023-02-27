/**
* Business Assessment Selector Layer class.
*
* @author Wayne Solomon
* @date Jun 2020
*/
public with sharing class SEL_BusinessAssessments extends fflib_SObjectSelector {

    private Boolean assertCrud = true;
    private Boolean enforceFls = true;
    private Boolean includeSelectorFields = true;

    /**
    * Creates a new instance of the selector via the application class.
    *
    */
    public static SEL_BusinessAssessments newInstance(){
        return (SEL_BusinessAssessments) ORG_Application.selector.newInstance(Business_Assessment__c.SObjectType);
    }

    /**
     * getSObjectFieldList
     * @return List<Schema.SObjectField>
     */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
                Business_Assessment__c.Id,
                Business_Assessment__c.Name,
                Business_Assessment__c.Milestone__c,
                Business_Assessment__c.Approval_Milestone_Date__c,
                Business_Assessment__c.Updated_to_Submitted__c,
                Business_Assessment__c.Economic_Group_Client_Sector__c,
                Business_Assessment__c.Economic_Group_Client_Country_of_Risk__c,
                Business_Assessment__c.Economic_Group_Sector_Risk_Appetite__c,
                Business_Assessment__c.Risk_Classification__c,
                Business_Assessment__c.Complexity__c,
                Business_Assessment__c.Decision_Emphasis__c,
                Business_Assessment__c.Client_LGD__c,
                Business_Assessment__c.Group_Parent_Client_Name__c,
                Business_Assessment__c.Guarantor_Name__c,
                Business_Assessment__c.Nature_of_Business__c,
                Business_Assessment__c.Transaction_Profile__c,
                Business_Assessment__c.Strategic_Rationale__c,
                Business_Assessment__c.Underwrite_Amount__c,
                Business_Assessment__c.Amount_Held__c,
                Business_Assessment__c.SBSA_Role__c,
                Business_Assessment__c.Credit_Requirement__c,
                Business_Assessment__c.Listed_Instruments__c,
                Business_Assessment__c.Risk_Commentary__c,
                Business_Assessment__c.GCCR_Status__c,
                Business_Assessment__c.KYC_Status__c,
                Business_Assessment__c.EDD_PEP__c,
                Business_Assessment__c.Sanctions__c,
                Business_Assessment__c.Transaction_Risk__c,
                Business_Assessment__c.Client_Risk__c,
                Business_Assessment__c.Reference_Number__c,
                Business_Assessment__c.Transaction_on_the_Exceptions_List__c,
                Business_Assessment__c.Environmental_Social_Risks_Tool__c,
                Business_Assessment__c.Business_Sponsor__c,
                Business_Assessment__c.Bank_Role__c,
                Business_Assessment__c.SB_Gross_Participation__c,
                Business_Assessment__c.SB_Hold__c,
                Business_Assessment__c.SB_Sell_Down__c,
                Business_Assessment__c.Transaction_Type__c,
                Business_Assessment__c.Market_Deal_Size__c,
                Business_Assessment__c.Transaction_Description__c
        };
    }

    /**
     * getSObjectType
     * @return Schema.SObjectType
     */
    public Schema.SObjectType getSObjectType() {
        return Business_Assessment__c.sObjectType;
    }

    /**
    * Set assertCrud field's value. Field can be used when creating instance of fflib_QueryFactory to assert running user's
    * CRUD on object.
    *
    * @param assertCrud
    *
    * @return
    */
    public SEL_BusinessAssessments withCrudAssert(Boolean assertCrud) {
        this.assertCrud = assertCrud;
        return this;
    }

    /**
     * Set enforceFls field's value. Field can be used when creating instance of fflib_QueryFactory to enforce running user's
     * FLS on object.
     *
     * @param enforceFls
     *
     * @return
     */
    public SEL_BusinessAssessments withFlsEnforced(Boolean enforceFls) {
        this.enforceFls = enforceFls;
        return this;
    }

    /**
     * Set includeSelectorFields field's value. Field can be used when creating instance of fflib_QueryFactory to include SObject's fields returned
     * by getSObjectFieldList method.
     *
     * @param includeSelectorFields
     *
     * @return
     */
    public SEL_BusinessAssessments includeSelectorFields(Boolean includeSelectorFields){
        this.includeSelectorFields = includeSelectorFields;
        return this;
    }

    /**
     * selectByIdsWithAssessmentOppChildren
     * @param recIds set of ids
     * @return List<Account>
     */
    public List<Business_Assessment__c> selectByIdsWithAssessmentOppChildren(Set<Id> recIds) {
        fflib_QueryFactory baQF = newQueryFactory().selectField('Account__r.CIF__c');
        fflib_QueryFactory aoQF = new SEL_AssessmentOpportunities().addQueryFactorySubselect(baQF, 'Assessment_Opportunities__r');
        new SEL_Opportunities().configureQueryFactoryFields(aoQF, 'Opportunity__r');
        return new SEL_BusinessAssessmentsWithoutSharing().selectByIdsWithAssessmentOppChildren(recIds, baQF.setCondition('Id IN :recIds').toSOQL());
    }

    /**
     * Select Business Assessments by Ids
     *
     * @param ids
     * @param withSharing
     *
     * @return
     */
    public List<Business_Assessment__c> selectByIds(Set<Id> ids, Boolean withSharing){
        String query = newQueryFactory(assertCrud, enforceFls, includeSelectorFields).setCondition('Id IN :ids').toSOQL();
        if(withSharing == true){
            return (List<Business_Assessment__c>) Database.query(query);
        }
        return new SEL_BusinessAssessmentsWithoutSharing().selectByIds(ids, query);
    }

    private without sharing class SEL_BusinessAssessmentsWithoutSharing {
        private List<Business_Assessment__c> selectByIdsWithAssessmentOppChildren(Set<Id> recIds, String query) {
            return (List<Business_Assessment__c>) Database.query(query);
        }

        /**
         * Select records by Ids without enforcing CRUD and FLS
         *
         * @param ids
         * @param query
         *
         * @return
         */
        private List<Business_Assessment__c> selectByIds(Set<Id> ids, String query){
            return (List<Business_Assessment__c>) Database.query(query);
        }
    }

    /**
     * Select records by Ids without enforcing CRUD and FLS
     *
     * @param ids
     *
     * @return
     */
    public List<Business_Assessment__c> selectByIdsWithoutCrudAndFlsEnforcement(Set<Id> ids){
        return Database.query(newQueryFactory(false, false, true).setCondition('Id IN :ids').toSOQL());
    }
}