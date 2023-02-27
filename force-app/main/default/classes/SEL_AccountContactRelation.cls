/**
 * @description Selector class for Account Contact Relation
 * @author		Emmanuel Mulea(Nocks)
 * @date		March 2022
 */
public with sharing class SEL_AccountContactRelation extends fflib_SObjectSelector{
    
   /**
    * Creates a new instance of the selector via the application class.
    *
    * @return SEL_AccountContactRelation
    */
    public static SEL_AccountContactRelation newInstance() {
        return (SEL_AccountContactRelation) ORG_Application.selector.newInstance(AccountContactRelation.SObjectType);
    }
    
   /**
    * return list of standard selector fields
    *
    * @return standard list of selector fields
    */
    public List<Schema.SObjectField> getSObjectFieldList() {

        return new List<Schema.SObjectField> {
            AccountContactRelation.Id,
            AccountContactRelation.ContactId,
            AccountContactRelation.AccountId,
            AccountContactRelation.Roles
        };
    }
    
   /**
    * Return sObject type of current selector
    *
    * @return Contact Schema.SObjectType
    */
    public Schema.SObjectType getSObjectType() {
        return AccountContactRelation.sObjectType;
    }
   /**
    * get account contact relation by clientIds.
    *
    * @return List<AccountContactRelation>
    */    
    public List<AccountContactRelation> selectByContactId(Set<Id> idSet) {
        return (List<AccountContactRelation>) Database.query(
            newQueryFactory()
            .setCondition('ContactId IN: idSet')
            .toSOQL()
        );
    }
}