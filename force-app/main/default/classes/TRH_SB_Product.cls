/**
* @description Trigger handler class for SB_Product__c SObject
*
 * Created by jmilosz on 12.12.2019.
 */
public without sharing class TRH_SB_Product extends ABS_TriggerHandlerBase {
    private SB_Product__c[] records {
        get {
            return Trigger.new == null ? new List<SB_Product__c>() : (SB_Product__c[]) Trigger.new;
        }
    }

    private Map<Id, SB_Product__c> id2OldRecords{
        get{
            if(Trigger.old == null){
                return null;
            }
            return new Map<Id, SB_Product__c>((SB_Product__c[])Trigger.old);
        }
    }
    private Map<Id, SB_Product__c> id2NewRecords {
        get {
            if (Trigger.newMap == null) {
                return null;
            }
            return (Map<Id, SB_Product__c>) Trigger.newMap;
        }
    }

    private DMN_SB_Product productDomain = (DMN_SB_Product)ORG_Application.domain.newInstance(records);
    private fflib_ISObjectUnitOfWork unitOfWork = ORG_Application.unitOfWork.newInstance();

    /**
     * Handle the before insert trigger
     */
    public override void handleBeforeInsert() {
        DMN_SB_Product.calculateExchangeRate (records);
        DMN_SB_Product.validateOpportunity (records, null);
        DMN_SB_Product.defaultFinanceApprovedFeeRecognition(records);
        DMN_SB_Product.calculateCYFeesAndMargin(records, null);
    }

    /**
     * Handle the after insert trigger
     */
    public override void handleAfterInsert() {
        DMN_SB_Product.createEstimatedRevenueSchedule(id2NewRecords.keySet());
        productDomain.populateDistributionAndRiskOnBusinessAssessment(id2NewRecords, new Map<Id, SB_Product__c>(), unitOfWork);
        unitOfWork.commitWork();
    }

    /**
     * Handle the before update trigger
     */
    public override void handleBeforeUpdate() {
        DMN_SB_Product.validateOpportunity (records, id2OldRecords);
        DMN_SB_Product.lockFinanceApprovedFeeRecognition(records, id2OldRecords);
        DMN_SB_Product.updateFinanceApprovedFeeRecognition(records, id2OldRecords);
        DMN_SB_Product.calculateCYFeesAndMargin(records, id2OldRecords);
    }

    /**
     * Handle the after update trigger
     */
    public override void handleAfterUpdate() {
        DMN_SB_Product.recalculateExchangeRate(records, id2OldRecords);
        DMN_SB_Product.updateEstimatedRevenueSchedule(id2OldRecords, records);
        DMN_SB_Product.populateBankRoleOnProdDistr(id2NewRecords, id2OldRecords);
        productDomain.populateDistributionAndRiskOnBusinessAssessment(id2NewRecords, id2OldRecords, unitOfWork);
        unitOfWork.commitWork();
    }

    /**
     * Handle the after delete trigger
     */
    public override void handleAfterDelete() {
        productDomain.populateDistributionAndRiskOnBusinessAssessment(new Map<Id, SB_Product__c>(), id2OldRecords, unitOfWork);
        unitOfWork.commitWork();
    }

    /**
     * Handle the after undelete trigger
     */
    public override void handleAfterUndelete() {
        productDomain.populateDistributionAndRiskOnBusinessAssessment(id2NewRecords, new Map<Id, SB_Product__c>(), unitOfWork);
        unitOfWork.commitWork();
    }
}