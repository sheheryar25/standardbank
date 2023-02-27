/**
 * Created by mpesko on 29.09.2021.
 */

trigger RevenueTrigger on FinServ__Revenue__c (before insert, before update, before delete, after insert, after update, after delete) {
    TriggerManager.instance.execute(); 
}