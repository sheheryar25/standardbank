({
	doInit: function (component, event, helper) {

		helper.isEconomicGroupParent(component);
		helper.hasCreditLines(component);
		helper.isLimited(component);
		helper.setReportId(component);
	},
	navigateToCreditLines: function (component, event, helper) {
		var clientId = component.get("v.recordId");
		//If mobile nav to the credit lines related list (because SF1 doesnt support navigating to a FILTERED report)	
		if ($A.get("$Browser.isAndroid") || $A.get("$Browser.isIOS")) {
			var relatedListEvent = $A.get("e.force:navigateToRelatedList");
			relatedListEvent.setParams({
				"relatedListId": "Credit_Lines__r",
				"parentRecordId": component.get("v.recordId")
			});
			relatedListEvent.fire();
		} else {//Desktop - navigate to the "Client_Credit_Lines_by_Product" report filtered by client ID
			var reportUrl = "/lightning/r/Report/[reportId]/view?reportFilters=";
			var reportURLFilters = '[{"column":"FK_ACC_ID","value":"[clientId]","operator":"equals","isContextFilter":true}]';
			
			reportUrl = reportUrl.replace("[reportId]", component.get("v.reportId"));
			reportURLFilters = reportURLFilters.replace("[clientId]", clientId);
			reportURLFilters = encodeURI(reportURLFilters);

			var urlEvent = $A.get("e.force:navigateToURL");
			urlEvent.setParams({
				"url": reportUrl + reportURLFilters
			});
			urlEvent.fire();
		}
	}
})