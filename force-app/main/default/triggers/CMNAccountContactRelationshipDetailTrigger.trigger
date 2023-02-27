/**
 * @description Trigger for CMN_Account_Contact_Relationship_Detail__c SObject
 * @author		Emmanuel Mulea(Nocks)
 * @date		March 2022
 */
trigger CMNAccountContactRelationshipDetailTrigger on CMN_Account_Contact_Relationship_Detail__c(before insert, before update, before delete, after insert,after update, after delete) {
    TriggerManager.instance.execute();
}