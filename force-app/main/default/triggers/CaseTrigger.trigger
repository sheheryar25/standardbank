/*************************************************************************\
@ Author        :     Anurag Jain
@ Date          :     21 June 2011
@ Test File     :     CaseClassAndTriggerTests
@ Description   :     General Trigger for Cases.
Following coding principals set out by 
CRM IT Developer team 
All trigger code will be updated here going forward
More information will be on the Classes specified

@ Last Modified By  : Nitish Kumar
@ Last Modified On  : 5 Dec , 2014
@ Last Modified Reason  : EN-0578 (Case: Production Support Process for ICBC)

@ Last Modified By  : Manoj Gupta
@ Last Modified On  : Oct , 2015
@ Last Modified Reason  : EN-0772 (Updated Jorel Naidoo changes for CCC cases)

@ Last Modified By  : Manoj Gupta
@ Last Modified On  : Oct , 2015
@ Last Modified Reason  : updated After Insert Trigger criteria to fix Contact name blank issue for user cases 

@ Last Modified By  : Manoj Gupta
@ Last Modified On  : 10 FEB , 2016
@ Last Modified Reason  : DEF-001634 Modified the trigger to link the contacts coming through CCC org.Populating hContactId during Case insert

@ Last Modified By  : Manoj Gupta
@ Last Modified On  : 12 FEB , 2016
@ Last Modified Reason  : DEF-001518 Included String.isNotBlank instead of null and '' check in After Insert block.
The block should execute for CCC cases only.Previously its was getting executed for User Case record types as well.   

@ Last Modified By  : Manoj Gupta
@ Last Modified On  : 23 Feb , 2016
@ Last Modified Reason  : EN-1123 CommB - updating support cases for Helpdesk                                    
-----------------------------------------------------------------------------------
@ Last Update: 2017-11-15: Rudolf Niehaus - Cloudsmiths - Child / Parent Case status sync
@ Last Update: 2017-11-16: Rudolf Niehaus - Cloudsmiths - Entitelment automation
@ Last Update: 2017-11-20: Rudolf Niehaus - Cloudsmiths - Prevent parent closure if a child is still open
------------------------------------------------------------------------------------
****************************************************************************/

trigger CaseTrigger on Case (Before Insert, Before Update, After Insert, After Update) {
    
    System.Debug('## >>> CaseTrigger <<< run by ' + UserInfo.getName());
    System.debug('##:Trigger.size:' + Trigger.size);
    System.debug('##:getDMLRows/getLimitDMLRows: ' + Limits.getDMLRows() +'/'+ Limits.getLimitDMLRows());
    
    System.debug('##### START: CaseTrigger :START #####');
    
    if (Trigger.isBefore) {
        
        //  EN-0578 (Case: Production Support Process for ICBC).
        CaseTriggerUtility.handleICBCCasebeforeInsUpdate(Trigger.new) ;
        //  EN-1123 CommB - updating support cases for Helpdesk  .
        CaseTriggerUtility.handleCommBCasebeforeInsUpdate(Trigger.new) ;
        
        if (Trigger.isInsert) {
            
            //1. CASE1269 - Update Owner Lookup custom field with the Case Owner
            CaseTriggerUtility.handleCaseBeforeInsertTrigger(Trigger.new);
        }
        
        if (Trigger.isUpdate) {
            
            //1. CASE1269 - Update Owner Lookup custom field with the Case Owner
            CaseTriggerUtility.handleCaseBeforeUpdateTrigger(Trigger.oldMap, Trigger.newMap);
        } //end of isUpdate
        
    } //end of isBefore
    
    If (Trigger.isAfter) {
        
        if(Trigger.isInsert ){
            CaseTriggerUtility.handleCaseAfterInsertTrigger(Trigger.new);
        }
        
        if(Trigger.isUpdate){
            CaseTriggerUtility.handleCaseAfterUpdateTrigger(Trigger.oldMap, Trigger.newMap);
        }
        
    }
    TriggerManager.instance.execute();
    System.debug('##### END: CaseTrigger :END #####');
}