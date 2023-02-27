({
    doInit: function (component, event, helper) {
        var revenueService = component.find("revenue_service");

        var clientId = component.get("v.recordId");

        if (clientId) {
            revenueService.getClientClientReturnOverCapital(clientId, $A.getCallback(function (error, crocData) {
                if (!error) {
                    helper.setCrocAndRoe('croc', crocData.cardDataMap.CROC, component);
                }
            }));

            revenueService.getClientReturnOnEquity(clientId, $A.getCallback(function (error, roeData) {
                if (!error) {
                    helper.setCrocAndRoe('roe', roeData.cardDataMap.ROE, component);
                }
            }));
        } else {
            revenueService.getPortfolioClientReturnOverCapital($A.getCallback(function (error, crocData) {
                if (!error) {
                    helper.setCrocAndRoe('croc', crocData.cardDataMap.CROC, component);
                }
            }));

            revenueService.getPortfolioReturnOnEquity($A.getCallback(function (error, roeData) {
                if (!error) {
                    helper.setCrocAndRoe('roe', roeData.cardDataMap.ROE, component);
                }
            }));
        }

        revenueService.getRevBudgetDate($A.getCallback(function (error, revSnapshotDate) {
            if (!error) {
                //Use revenue snapshot date because the CROC file is imported at the same time
                component.set("v.revenueSnapshotDate", helper.dateFormatter(helper.dateParser(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c)));
            }
        }));
    }
})