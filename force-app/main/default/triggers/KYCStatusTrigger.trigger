/* @Class Name   : KYCStatusTrigger
 * @Description  : Trigger on KYC Status Trigger
 * @Created By   : Vishnu Teja V
 * @Created On   : 21 April 2015
 * @Modification Log:  
 * --------------------------------------------------------------------------------------------------
 * @Developer                Date                   Description
 * --------------------------------------------------------------------------------------------------
 * @Vishnu Teja V         21 April 2015     Created- EN 694 : To assign a task to the Escalated to Business User
 * ---------------------------------------------------------------------------------------------------
 *
 * @Last Modified By  :   Petr Roubal        
 * @Last Modified On  :   Aug 2015
 * @Last Modified Reason  : EN-738, Onboarding: Integration back from CIF into SF 
 
 * @Last Modified By  :   Abhishek V        
 * @Last Modified On  :   Feb 2016
 * @Last Modified Reason  : EN-1037, Removed the code which creates task when Escalated to business field is filled or changed during insert/update 
   
 * @Last Modified By  :   Manoj Gupta        
 * @Last Modified On  :   Feb 2016
 * @Last Modified Reason  : EN-1043, KYC: Enhanced MI Reporting 
 
 * ---------------------------------------------------------------------------------------------------
 */
trigger KYCStatusTrigger on KYC_Status__c (before insert, after insert, after update) {
    Map<Id, Id> mapClientIdToKYCStatus = new Map<Id, Id>();
    Set<Id> clientIdsWithReviewStatusClosed = new Set<Id>();


    if (Trigger.isBefore && Trigger.isInsert) {
        KYCStatusTriggerHelper.validateKYCEntityCode(Trigger.new);
    }
    else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            for (KYC_Status__c newKYC : Trigger.new) {
                if (newKYC.To_delete__c) {
                    mapClientIdToKYCStatus.put(newKYC.Client__c, newKYC.Id);
                }

                else if ((newKYC.Entity_Code__c == DMN_KYC_Status.ENTITY_CODE_SBSA)) {
                    clientIdsWithReviewStatusClosed.add(newKYC.Client__c);
                }

            }
        }
        else if (Trigger.isUpdate) {
            for (KYC_Status__c updatedKYC : Trigger.new) {
                if (updatedKYC.KYC_Review_Status__c != Trigger.oldMap.get(updatedKYC.Id).KYC_Review_Status__c) {
                    clientIdsWithReviewStatusClosed.add(updatedKYC.Client__c);

                }
            }
        }
    }

    if (!mapClientIdToKYCStatus.isEmpty()) {
        KYCStatusTriggerHelper.caseEmailsAndDelete(mapClientIdToKYCStatus);
    }

    if (!clientIdsWithReviewStatusClosed.isEmpty()) {
        KYCStatusTriggerUtility.updateGroupKYCInProgressFalse(clientIdsWithReviewStatusClosed);
    }

}