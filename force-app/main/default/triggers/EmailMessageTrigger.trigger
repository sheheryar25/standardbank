/**
 * Created by akepczynski on 06.02.2019.
 */

trigger EmailMessageTrigger on EmailMessage (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.instance.execute();
}