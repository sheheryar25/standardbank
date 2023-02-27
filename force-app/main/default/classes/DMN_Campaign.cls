/**
 * Campaign SObject Domain Class
 *
 * @author		Michal Pesko (mpesko@deloittece.com)
 * @date		December 2020
 */
public inherited sharing class DMN_Campaign {

    public static final String CATEGORY_GROUP_EVENT = '4 - Group Event';
    public static final String CATEGORY_OPERATIONAL_MAILER = 'Operational Mailer';
    public static final String CATEGORY_PA_EVENT = '7 - PA Event';
    public static final String CATEGORY_SURVEY = 'Survey';
    public static final String OBJ_NAME = 'Campaign';

    /**
    * Method to add Campaign Member statuses depending on Campaign Category
    *
    * @param campaigns - List of campaigns
    */
    public static void addCampaignMemberStatuses(List<Campaign> campaigns) {
        List<CampaignMemberStatus> statusesToInsert = new List<CampaignMemberStatus>();

        Set<Id> campIds = new Set<Id>();

        for (Integer i = 0, j = campaigns.size(); i < j; i++) {
            Campaign campRec = campaigns[i];
            if (campRec.Campaign_Category__c == CATEGORY_SURVEY) {
                campIds.add(campRec.Id);
                CampaignMemberStatus defaultStatus = createStatus(campRec.Id, DMN_CampaignMember.STATUS_NOT_SENT, false);
                defaultStatus.IsDefault = true;
                statusesToInsert.add(defaultStatus);
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_SENT, false));
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_RESPONDED, true));

            } else if (campRec.Campaign_Category__c == CATEGORY_PA_EVENT) {
                campIds.add(campRec.Id);
                CampaignMemberStatus defaultStatus = createStatus(campRec.Id, DMN_CampaignMember.STATUS_NOT_SENT, false);
                defaultStatus.IsDefault = true;
                statusesToInsert.add(defaultStatus);
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_SENT, false));
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_SENT_REMINDER, false));
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_ACCEPTED, true));
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_DECLINED, true));
            } else if (campRec.Campaign_Category__c == CATEGORY_OPERATIONAL_MAILER) {
                campIds.add(campRec.Id);
                CampaignMemberStatus defaultStatus = createStatus(campRec.Id, DMN_CampaignMember.STATUS_NOT_SENT, false);
                defaultStatus.IsDefault = true;
                statusesToInsert.add(defaultStatus);
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_SENT, true));
            } else {
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_ACCEPTED, true));
                statusesToInsert.add(createStatus(campRec.Id, DMN_CampaignMember.STATUS_DECLINED, true));
            }
        }

        if(!campIds.isEmpty()) {
            setTempDefaultStatuses(campIds);
            clearCampaignMemberStatuses(campIds);
        }

        if (!statusesToInsert.isEmpty()) {
            insert statusesToInsert;
            clearTempCampaignMemberStatuses(campIds);
        }
    }

    private static CampaignMemberStatus createStatus(Id campaignId, String status, Boolean hasResponded) {
        return new CampaignMemberStatus(
                CampaignId = campaignId,
                HasResponded = hasResponded,
                Label = status,
                IsDefault = false
        );
    }

    private static void clearCampaignMemberStatuses(Set<Id> campaignIds) {
        List<CampaignMemberStatus> campaignMemberStatuses = [SELECT Id FROM CampaignMemberStatus
        WHERE Label!=:DMN_CampaignMember.STATUS_TEMP AND CampaignId IN :campaignIds];
        delete campaignMemberStatuses;
    }

    private static void clearTempCampaignMemberStatuses(Set<Id> campaignIds){
        List<CampaignMemberStatus> campaignMemberStatuses = [SELECT Id FROM CampaignMemberStatus
        WHERE Label=:DMN_CampaignMember.STATUS_TEMP AND CampaignId IN :campaignIds];
        delete campaignMemberStatuses;
    }

    private static void setTempDefaultStatuses(Set<Id> campaignIds) {
        List<CampaignMemberStatus> statusesToUpsert = [SELECT Id, IsDefault, CampaignId FROM CampaignMemberStatus
        WHERE IsDefault = TRUE AND CampaignId IN :campaignIds];
        Set<CampaignMemberStatus> tempStatuses = new Set<CampaignMemberStatus>();
        for (CampaignMemberStatus oldDefaultStatus: statusesToUpsert){
            oldDefaultStatus.IsDefault = false;
            CampaignMemberStatus defaultStatus = createStatus(oldDefaultStatus.CampaignId, DMN_CampaignMember.STATUS_TEMP, true);
            defaultStatus.IsDefault = true;
            tempStatuses.add(defaultStatus);
        }
        statusesToUpsert.addAll(tempStatuses);
        upsert statusesToUpsert;
    }

    /**
    * Method to Update Deploy to MC Shadow for all Campaign Members
    * SFP-7843: 'Deploy to Marketing Cloud Shadow' field
    *
    * @param campaignsMap - Map of Ids and campaigns
    */
    public static void updateCampaignMemberDeployToMC(Map<Id,Campaign> campaignsMap){
        Set<Id> ids = new Set<Id>();
        for(Campaign campaign: campaignsMap.values()){
            if(campaign.Lock_Campaign__c == false){
                ids.add(campaign.Id);
            }
        }
        if(!ids.isEmpty()){

            List<CampaignMember> campaignMembers =  SEL_CampaignMember.newInstance().selectByCampaign(ids);

            for (CampaignMember cm : campaignMembers) {
                cm.Deploy_to_Marketing_Cloud_Shadow__c = campaignsMap.get(cm.CampaignId).Deploy_to_MC__c;
            }
            update campaignMembers;
        }
    }

}