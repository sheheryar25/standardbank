/**
 * Application Document Selector Layer class.
 * @author Caro Reinecke (caro@khonology.com)
 * @date 2018-01-08
 */
public with sharing class SEL_ApplicationDocuments extends fflib_SObjectSelector {

    /**
    * @description Creates a new instance of the selector via the application class. This is here to allow unit tests to override
    * and inject a mock instead of this class or to switch out this class for a new version.
    * @return SEL_ApplicationDocuments
    */
    public static SEL_ApplicationDocuments newInstance() {
        return (SEL_ApplicationDocuments) ORG_Application.selector.newInstance(Application_Document__c.SObjectType);
    }

    /**
    * @description get SObject Field List
    * @return  List<Schema.SObjectField>
    */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
                Application_Document__c.Name,
                Application_Document__c.Id,
                Application_Document__c.Account_Application__c,
                Application_Document__c.Document_Status__c,
                Application_Document__c.Document_Type__c,
                Application_Document__c.FileNet_Id__c,
                Application_Document__c.Onboarding_Application__c
                };
                    }
    /**
    * @description Gets SObject Type
    * @return Schema.SObjectType
    */
    public Schema.SObjectType getSObjectType() {
        return Application_Document__c.sObjectType;
    }
    /**
    * @description Get records by Id
    * @param  idSet Set of IDs
    * @return List<Application_Document__c>
    */
    public List<Application_Document__c> selectById(Set<ID> idSet) {

        return (List<Application_Document__c>) selectSObjectsById(idSet);
    }
    /**
    * @description Get records by AccountApplicationId
    * @param  idSet Set of IDs
    * @return List<Application_Document__c>
    */
    public List<Application_Document__c> selectByAccountApplicationId(Set<Id> idSet) {
        return (List<Application_Document__c>) Database.query(
            newQueryFactory().
            setCondition('Account_Application__c in :IdSet').
            toSOQL());
    }
    /**
    * @description Get records by OnboardApplicationId
    * @param  idSet Set of IDs
    * @return List<Application_Document__c>
    */
    public List<Application_Document__c> selectByOnboardApplicationId(Set<Id> idSet) {
        return (List<Application_Document__c>) Database.query(
            newQueryFactory().
            selectField('Authorised_Person__r.Id').
            selectField('Authorised_Person__r.Name').
            selectField('Authorised_Person__r.Email').
            selectField('Authorised_Person__r.FirstName').
            selectField('Authorised_Person__r.LastName').
            selectField('Authorised_Person__r.Phone').
            selectField('Authorised_Person__r.Contact_Role_s_at_Client__c').
            setCondition('Onboarding_Application__c in :IdSet').
            toSOQL());
    }
    /**
    * @description Get records by OnboardApplicationId and Where Document_Status__c is pending
    * @param  onBoardid Set of IDs
    * @return List<Application_Document__c>
    */
    public List<Application_Document__c> selectByOnboardAppWherePending(Set<Id> onBoardid) {
        return (List<Application_Document__c>) Database.query(
            newQueryFactory().
            selectField('Authorised_Person__r.Id').
            selectField('Authorised_Person__r.Name').
            selectField('Authorised_Person__r.Email').
            selectField('Authorised_Person__r.Contact_Role_s_at_Client__c').
            setCondition('Onboarding_Application__c IN:onBoardid').
            toSOQL());
    }
}