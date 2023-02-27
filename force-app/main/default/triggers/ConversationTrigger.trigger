/**
 * Created by mrzepinski on 25.08.2020.
 */

trigger ConversationTrigger on Conversation__c (before insert, before update, before delete, after insert,after update, after delete) {
    TriggerManager.instance.execute();
}