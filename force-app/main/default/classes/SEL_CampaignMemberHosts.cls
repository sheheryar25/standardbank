/**
 * Selector layer class for Campaign_Member_Host__c SObject
 *
 * @author Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date June 2020
 */
public inherited sharing class SEL_CampaignMemberHosts extends fflib_SObjectSelector {

    /**
     * Creates a new instance of the selector via the application class. This is here to allow unit tests to override
	 * and inject a mock instead of this class or to switch out this class for a new version.
     *
     */
    public static SEL_CampaignMemberHosts newInstance() {
        return (SEL_CampaignMemberHosts) ORG_Application.selector.newInstance(Campaign_Member_Host__c.SObjectType);
    }

    /**
     * Returns the SObject type for the selector. This is used to retrieve the sObject name when building the SOQL
     * queries.
     */
    public SObjectType getSObjectType() {
        return Campaign_Member_Host__c.SObjectType;
    }

    public List<SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
            Campaign_Member_Host__c.Member__c
        };
    }

    public List<Campaign_Member_Host__c> selectByMember(Set<Id> memberIds) {
        fflib_QueryFactory factory = newQueryFactory(false, false, true)
            .setCondition('Member__c IN :memberIds');
        return Database.query(factory.toSOQL());
    }

}