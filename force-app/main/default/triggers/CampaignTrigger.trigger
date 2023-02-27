/**
 * Campaign SObject Trigger
 *
 * @author		Michal Pesko (mpesko@deloittece.com)
 * @date		December 2020
 */
trigger CampaignTrigger on Campaign (before insert, before update, before delete, after insert, after update, after delete) {
    TriggerManager.instance.execute();
}