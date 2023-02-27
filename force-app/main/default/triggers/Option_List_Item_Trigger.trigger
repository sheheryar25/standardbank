/**
 * Trigger on Option_List_Item__c object.
 * <br/>SGPRT-3817
 *
 * @author Joanna Milosz (jmilosz@deloittece.com)
 * @date January 2021
 */
trigger Option_List_Item_Trigger on Option_List_Item__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.instance.execute();
}