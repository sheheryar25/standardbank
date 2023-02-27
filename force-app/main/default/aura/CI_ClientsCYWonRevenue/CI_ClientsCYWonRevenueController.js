({
	doInit : function(component, event, helper) {
		var getTotalWonRevenue = component.get("c.getTotalWonRevenue");
		getTotalWonRevenue.setParams({
            "clientId": component.get("v.recordId")
        });

		getTotalWonRevenue.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.totalWonRevenue", helper.amountFormatter(response.getReturnValue(), 2));
				if(!(response.getReturnValue() > 0)){
					component.set("v.color", 'red-negative');
				}
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
		$A.enqueueAction(getTotalWonRevenue);
	}
})