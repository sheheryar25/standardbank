({
	doInit: function (component, event, helper) {
		var clientId = component.get("v.recordId");
		var revenueService = component.find("revenue_service");
		var querySettings = component.get("v.querySettings");


		if(clientId){
			revenueService.getClientRevAndBudget(clientId, $A.getCallback(function (error, revBudgetData) {
				if (!error) {
					helper.processResponse(component, revBudgetData.cardDataMap);
				}
			}));
		} else {
		    helper.getCustomSettings(component);
			component.set("v.budgetType", "IBC");
			revenueService.getPortfolioRevenueAndBudget(querySettings, $A.getCallback(function (error, revBudgetData) {
				if (!error) {
					helper.processResponse(component, revBudgetData.cardDataMap);
				}
			}));
		}

		revenueService.getRevBudgetDate($A.getCallback(function (error, revBudgetSnapshotData) {
			if (!error) {
				if(revBudgetSnapshotData.cardDataMap.Month_End_Snapshot_Date__c)
					component.set("v.revenueBudgetSnapshotDate", helper.dateFormatter(helper.dateParser(revBudgetSnapshotData.cardDataMap.Month_End_Snapshot_Date__c)));
				else
					component.set("v.revenueBudgetSnapshotDate",'Snapshot date not provided');
			}
		}));


	},

    handleOnClick: function(component, event, helper){
         helper.forceNavigateToComponent(component.get("v.redirectComponent"), {'recordId': component.get("v.recordId")});
    },

})