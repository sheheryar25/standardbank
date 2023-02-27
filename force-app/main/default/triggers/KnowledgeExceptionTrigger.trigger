/**
 * Trigger for Knowledge_Entitlement_Exception__c record creation.
 *
 * @Author Wayde Fagan(wayde.fagan@tetrad.co.za)
 * @Date October 2020
 */
trigger KnowledgeExceptionTrigger on Knowledge_Entitlement_Exception__c (before insert) {
	TriggerManager.Instance.execute();
}