/*************************************************************************\
    @ Author        :     Stephen Moore
    @ Date          :     8 Nov 2011
    @ Test File     :     GiftExpenseLog_Test
    
    @ Description   :     1)Update last Comment from Approval Step on the GiftExpenselog record
                          2)Update the Approver's related Delegated User on the GiftExpenselog record.
                                           
****************************************************************************/
trigger GiftExpenseLogTrigger on Gift_Expense_Log__c (after insert, after update, before insert, before update) {

    if (Trigger.isBefore){

        GiftExpenseLogUtility.UpdateApproverDelegatedUsers(Trigger.new);

        if ( Trigger.isUpdate ){
        
            List<Gift_Expense_Log__c> GiftExpenselogApproverCommentsList  = new  list <Gift_Expense_Log__c>() ;
            List<Gift_Expense_Log__c> GiftExpenselogDEList = new  list <Gift_Expense_Log__c>() ;
                 
            for (Gift_Expense_Log__c gl : Trigger.new ){
                Gift_Expense_Log__c oldgl = Trigger.oldmap.get(gl.id);
                if (gl.Approver__c != oldgl.Approver__c){
                    GiftExpenselogDEList.add(gl);            
                }
              
                if (gl.Status__c != oldgl.Status__c){
                    GiftExpenselogApproverCommentsList.add (gl);
                    /* Move to Batch Scheduled Class to accomodate escalation
                    //if (gl.Status__c == 'Submitted'){
                    //    gl.Approval_Escalation_Time__c = Date.today().addDays(3);
                    //}
                    //if ((gl.Status__c == 'Approved') || (gl.Status__c == 'Rejected') || ( gl.Status__c == 'Not Submitted')){
                    //    gl.Approval_Escalation_Time__c = null;
                    //}              
                    //*/
                }         
            }
           
            if (GiftExpenselogApproverCommentsList.size() > 0 ) {
                GiftExpenseLogUtility.UpdateApproverReportingFields(GiftExpenselogApproverCommentsList);         
            }
            if (GiftExpenselogDEList.size() > 0 ) {    
               GiftExpenseLogUtility.UpdateApproverDelegatedUsers(GiftExpenselogDEList);            
            }
        }
    }
}