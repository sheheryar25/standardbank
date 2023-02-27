/**
 * Builder class for CampaignMember SObject
 *
 * @author Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date April 2020
 */
@IsTest
public without sharing class BLD_CampaignMember extends ABS_ObjectBuilderBase {

    public BLD_CampaignMember(fflib_SObjectUnitOfWork uow) {
        super(CampaignMember.SObjectType, uow);
    }

    public BLD_CampaignMember campaign(BLD_Campaign campaignBuilder) {
        return (BLD_CampaignMember) setRelation(CampaignMember.CampaignId, campaignBuilder);
    }

    public BLD_CampaignMember contact(BLD_Contact contactBuilder) {
        return (BLD_CampaignMember) setRelation(CampaignMember.ContactId, contactBuilder);
    }

    public BLD_CampaignMember status(String status) {
        return (BLD_CampaignMember) setField(CampaignMember.Status, status);
    }

    public BLD_CampaignMember wave(String wave) {
        return (BLD_CampaignMember) setField(CampaignMember.Campaign_Wave__c, wave);
    }

}