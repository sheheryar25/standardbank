/**
* @author Michal Pesko (mpesko@deloittece.com)
* @date   October 2021
* @description Batch class for deactivating revenues
* @US SFP-6885
*/
public with sharing class BCH_CrtActiveRevenues extends ABS_Batch implements Database.Batchable<SObject> {

    /**
    * start batch method
    *
    * @param bc default reference to Database.BatchableContext
    * @return Iterable<SObject> returns the Revenue list
    */
    public Iterable<SObject> start(Database.BatchableContext bc) {
        Datetime lastModifiedActiveTime = Datetime.now().addDays(-35);
        return SEL_Revenue.newInstance().selectByRecTypeAndLastModDate('CRT Revenue', lastModifiedActiveTime);
    }

    /**
    * execute batch method
    *
    * @param bc default reference to Database.BatchableContext
    * @param scope List<SObject> list of revenues to deactivate
    */
    public void execute(Database.BatchableContext bc, List<sObject> scope) {
        for(FinServ__Revenue__c revenue: (List<FinServ__Revenue__c>) scope){
            revenue.CRT_ActiveRevenue__c = false;
        }
    }

    /**
    * finish batch method
    *
    * @param bc default reference to Database.BatchableContext
    */
    @SuppressWarnings('PMD.EmptyStatementBlock')
    public void finish(Database.BatchableContext bc) {
    }
}