/*************************************************************************
    @ Author        : Tadeas Brzak
    @ Date          : 2015-11-26
    @ Test File     : CSTSharingUtility_Test 
    @ Description   : when Account Information record is created or reparented, manage sharing with CST members
*/
trigger AccountInformationTrigger on Account_Information__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TriggerManager.instance.execute();
}