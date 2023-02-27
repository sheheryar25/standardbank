({
	isEconomicGroupParent : function(component) {
		var isEconomicGroupParent = component.get("c.isEconomicGroupParent");
		isEconomicGroupParent.setParams({
            "clientId": component.get("v.recordId")
        });
		isEconomicGroupParent.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.isEconomicGroupParent", response.getReturnValue());
			}
		});
		$A.enqueueAction(isEconomicGroupParent);
	},

	hasCreditLines : function(component) {
		var hasCreditLines = component.get("c.hasCreditLines");
		var self = this;
		hasCreditLines.setParams({
            "clientId": component.get("v.recordId")
        });
		hasCreditLines.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.hasCreditLines", response.getReturnValue());
				component.set("v.notAvailable", $A.get("$Label.c.Not_Available"));
				if(response.getReturnValue() == true) {
					self.getUserIsoCode(component);
					self.getTotalCreditUtilisation(component);
					self.getTotalCreditLimit(component);
				}
			}
		});
		$A.enqueueAction(hasCreditLines);
	},

	isLimited : function(component) {
		var isLimited = component.get("c.isLimited");
		isLimited.setParams({
            "clientId": component.get("v.recordId")
        });
		isLimited.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.isLimited", response.getReturnValue());
			}
		});
		$A.enqueueAction(isLimited);
	},

	getUserIsoCode : function(component) {
		var getUserIsoCode = component.get("c.getUserIsoCode");
		getUserIsoCode.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.isoCode", response.getReturnValue());
			}
		});
		$A.enqueueAction(getUserIsoCode);
	},

	getTotalCreditUtilisation : function(component) {
	    var helper = this;
		var getTotalCreditUtilisation = component.get("c.getTotalCreditUtilisation");
		getTotalCreditUtilisation.setParams({
            "clientId": component.get("v.recordId")
        });
		getTotalCreditUtilisation.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
                component.set("v.utilisation", helper.amountFormatter(response.getReturnValue(), 2));
			}
		});
		$A.enqueueAction(getTotalCreditUtilisation);
	},

	getTotalCreditLimit : function(component) {
		var getTotalCreditLimit = component.get("c.getTotalCreditLimit");
		var helper = this;
		getTotalCreditLimit.setParams({
            "clientId": component.get("v.recordId")
        });
		getTotalCreditLimit.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
                component.set("v.limit", helper.amountFormatter(response.getReturnValue(), 2));
			}
		});
		$A.enqueueAction(getTotalCreditLimit);
	},

	setReportId: function(component) { 
		var reportService = component.find("report_service");
		var reportName = "Client_Credit_Lines_by_Product";
		reportService.getReportId(reportName, $A.getCallback(function (error, reportId) {
			if(!error){
				component.set("v.reportId", reportId);
			}
		}));
	}
})