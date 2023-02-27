/* @description
@ Last Modified By  : Sharath
@ Last Modified On  : 21 Sept , 2021
@ Last Modified Reason  : SFP-5036 : Creation of Case from Live Agent/Chat
**/
Trigger IBot_LiveChatTranscriptTrigger on LiveChatTranscript (after insert, after update) {  //added after update for SFP: 5036
    if(Trigger.isAfter){
        if(Trigger.isInsert){
            IBot_LiveChatTranscriptTriggerHelper.handleAfterInsert(Trigger.new);
        }else if(Trigger.isUpdate){//added after update for SFP: 5036
            IBot_LiveChatTranscriptTriggerHelper.handleAfterUpdate(Trigger.new);
        }
    }
    
}