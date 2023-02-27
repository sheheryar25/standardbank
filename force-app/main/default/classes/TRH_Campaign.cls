/**
 * Campaign SObject Trigger Handler
 *
 * @author		Michal Pesko (mpesko@deloittece.com)
 * @date		December 2020
 */
public without sharing class TRH_Campaign extends ABS_TriggerHandlerBase {
    private List<Campaign> records {
        get { return (List<Campaign>) Trigger.new; }
    }

    private Map<Id, Campaign> recordsMap {
        get { return (Map<Id, Campaign>) Trigger.newMap; }
    }

    public override void handleAfterInsert() {
        DMN_Campaign.addCampaignMemberStatuses(records);
    }

    public override void handleAfterUpdate(){
        DMN_Campaign.updateCampaignMemberDeployToMC(recordsMap);
    }
}