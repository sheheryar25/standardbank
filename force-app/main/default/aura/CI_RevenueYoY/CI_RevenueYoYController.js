({
	doInit: function (component, event, helper) {
		var revenueService = component.find("revenue_service");
		var YTDYear;
		var YTDMonth;
	
		var snapShotDate = new Promise(function (resolve) {
			revenueService.getRevBudgetDate($A.getCallback(function (error, revSnapshotDate) {
				if (!error) {
					if(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c != ''){
                        component.set("v.revenueSnapshotDate", helper.dateFormatter(helper.dateParser(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c)));
                        YTDYear = helper.dateParser(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c).getFullYear();
                        YTDMonth = helper.dateParser(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c).getMonth() + 1;

                        component.set("v.currentYear", YTDYear);
                        component.set("v.previousYear", YTDYear - 1);
					}
					resolve();
				}
			}));
		});

		Promise.all([snapShotDate])
			.then($A.getCallback(function () {
				revenueService.getPortfolioRevenue(YTDYear, 1, YTDMonth, $A.getCallback(function (error, data) {
					if (error) {
					
					} else {
						var currentYearRevenue = data.cardObjectList[0].Amount;
						var previousYearRevenue = data.cardObjectList[1].Amount;
	
						component.set("v.totalRevenueThisYear", helper.amountFormatter(currentYearRevenue, 2));
						component.set("v.totalRevenueLastYear", helper.amountFormatter(previousYearRevenue, 2));
					
						if (currentYearRevenue > 0 && previousYearRevenue > 0) {
							var percentDiffObj = helper.percentageChange(previousYearRevenue, currentYearRevenue);
							if (percentDiffObj) {
								var differencePercent = helper.percentageFormatter(percentDiffObj.differencePercent);
	
								switch (percentDiffObj.changeDirection) {
									case "decrease": differencePercent = "-" + differencePercent;
										break;
									case "increase": differencePercent = "+" + differencePercent;
										break;
								}
								$A.util.addClass(component.find("difference_percent"), percentDiffObj.colourClass);
								component.set("v.differencePercent", differencePercent);
							}
						}
					}
				}))
			}));
	},
	handleOnClick: function(component, event, helper){
         helper.forceNavigateToComponent(component, component.get("v.redirectComponent"));
    },
})