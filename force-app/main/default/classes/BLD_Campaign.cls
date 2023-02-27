/**
 * Builder class for Campaign SObject
 *
 * @author Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date March 2020
 */
@IsTest
public without sharing class BLD_Campaign extends ABS_ObjectBuilderBase {

    private static final String DEF_NAME = 'campaign name';

    public BLD_Campaign() {
        this(getNewUnitOfWork());
    }

    public BLD_Campaign(fflib_SObjectUnitOfWork uow) {
        super(Campaign.SObjectType, uow);
    }

    protected override void setDefaultData() {
        setField(Campaign.Name, DEF_NAME);
    }

    public BLD_Campaign active(Boolean isActive) {
        return (BLD_Campaign) setField(Campaign.IsActive, isActive);
    }

    public BLD_Campaign category(String category) {
        return (BLD_Campaign) setField(Campaign.Campaign_Category__c, category);
    }

    public BLD_Campaign name(String name) {
        return (BLD_Campaign) setField(Campaign.Name, name);
    }

    public BLD_Campaign type(String type) {
        return (BLD_Campaign) setField(Campaign.Type, type);
    }

    public BLD_Campaign lock(Boolean lock) {
        return (BLD_Campaign) setField(Campaign.Lock_Campaign__c, lock);
    }

    public BLD_Campaign addMemberHost(BLD_CampaignMemberHost camMemberHostBld) {
        return (BLD_Campaign) addChild(Campaign_Member_Host__c.Campaign__c, camMemberHostBld);
    }

     public BLD_Campaign emailBody(String emailBody) {
        return (BLD_Campaign) setField(Campaign.Email_Body__c, emailBody);
    }

     public BLD_Campaign emailSignature(String emailSignature) {
        return (BLD_Campaign) setField(Campaign.Email_Signature_rt__c, emailSignature);
    }

     public BLD_Campaign emailSubject(String emailSubject) {
        return (BLD_Campaign) setField(Campaign.Email_Subject__c, emailSubject);
    }

    public BLD_Campaign addMember(BLD_CampaignMember camMemberBld) {
        return (BLD_Campaign) addChild(CampaignMember.CampaignId, camMemberBld);
    }

}