({
	doInit : function(component, event, helper) {
		var getTotalWonRevenue = component.get("c.getTotalWonRevenue");
		getTotalWonRevenue.setParams({
            "clientId": component.get("v.recordId")
        });

		getTotalWonRevenue.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.totalWonRevenue", response.getReturnValue() / 1000000);
				if(!(response.getReturnValue() > 0)){
					component.set("v.color", 'red-negative');
				}
			}
		});

		var getUserIsoCode = component.get("c.getUserIsoCode");

		getUserIsoCode.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.isoCode", response.getReturnValue());
			}
		});

		var getHelpText = component.get("c.getHelpText");
		getHelpText.setParams({
			"clientId" : component.get("v.recordId")
		});

		getHelpText.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.help", response.getReturnValue());
			}
		});

		$A.enqueueAction(getHelpText);	
		$A.enqueueAction(getUserIsoCode);
		$A.enqueueAction(getTotalWonRevenue);
	}
})