/**
 * Trigger for Knowledge__kav record creation.
 *
 * @Author Wayde Fagan(wayde.fagan@tetrad.co.za)
 * @Date March 2020
 */
trigger KnowledgeTrigger on Knowledge__kav (before insert, after insert, before update, after update, after delete,before delete) {
    TriggerManager.Instance.execute();
}