/**
 * Trigger for Log_Event__e platform event.
 *
 * @Author Wojciech Kowalczyk(wkowalczyk@deloittece.com)
 * @Date June 2020
 */
trigger LogEventTrigger on Log_Event__e (after insert) {
    TriggerManager.instance.execute();
}