/**
 * Selector layer class for Service Type SObject
 *
 * @author		Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date		March 2020
 */
public with sharing class SEL_ServiceTypes extends fflib_SObjectSelector {

    public static SEL_ServiceTypes newInstance() {
        return (SEL_ServiceTypes) ORG_Application.selector.newInstance(Service_Type__c.SObjectType);
    }

    public Schema.SObjectType getSObjectType() {
        return Service_Type__c.SObjectType;
    }

    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<SObjectField> {
            Service_Type__c.Entitlement__c
        };
    }

}