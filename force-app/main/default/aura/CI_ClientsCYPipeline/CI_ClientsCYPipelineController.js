({
	doInit: function (component, event, helper) {
		var clientId = component.get("v.recordId");
		var querySettings = component.get("v.querySettings");

		//getTotalPipeline gets for either single client, or all users clients
		var getTotalPipeline = component.get("c.getTotalPipeline");
		getTotalPipeline.setParams({
			"clientId": clientId,
			querySettings : querySettings
		});

		var totalPipeline;
		var totalPipelinePromise = new Promise(function (resolve) {
			getTotalPipeline.setCallback(this, function (response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					totalPipeline = +response.getReturnValue();
					resolve();
				}
			});
		});
		$A.enqueueAction(getTotalPipeline);

		var revenueService = component.find("revenue_service");
		var totalRevenue;
		var totalBudget;
		if (clientId) {
			var revenueVsBudgetGapPromise = new Promise(function (resolve) {
				revenueService.getClientRevAndBudget(clientId, $A.getCallback(function (error, revBudgetGapData) {
					if (!error) {
						totalRevenue = revBudgetGapData.cardDataMap.Revenue;
						totalBudget = revBudgetGapData.cardDataMap.Budget;
						resolve();
					}
				}));
			});

			Promise.all([totalPipelinePromise, revenueVsBudgetGapPromise])
				.then($A.getCallback(function () {
					helper.calcAndShowUnderOverBudget(component, totalPipeline, totalRevenue, totalBudget);
				}));

		} else {//We dont have a client ID, use below to get revenue/budget for all clients belonging to user
			var portfolioRevenueBudgetGapPromise = new Promise(function (resolve) {
				revenueService.getPortfolioRevenueAndBudget(querySettings, $A.getCallback(function (error, revBudgetGapData) {
					if (!error) {
						totalRevenue = revBudgetGapData.cardDataMap.Revenue;
						totalBudget = revBudgetGapData.cardDataMap.Budget;
						resolve();
					}
				}));
			});

			Promise.all([totalPipelinePromise, portfolioRevenueBudgetGapPromise])
				.then($A.getCallback(function () {
					helper.calcAndShowUnderOverBudget(component, totalPipeline, totalRevenue, totalBudget);
				}));
		}
		helper.getCustomSettings(component);

	},

    handleOnClick : function (component, event, helper){
        var redirectComponent = component.get("v.redirectComponent");
        var clientId = component.get("v.recordId");
        if(redirectComponent != null){
            if(clientId != null){
                 helper.forceNavigateToComponent(redirectComponent, {'recordId': component.get("v.recordId")});
            }
            else{
                helper.forceNavigateToComponent(redirectComponent, {'recordId': component.get("v.recordId"), 'querySettings': component.get("v.querySettings")});
            }
        }
    },

})