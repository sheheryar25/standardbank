({
	doInit : function(component, event, helper) {
		var getTotalRevenue = component.get("c.getTotalRevenue");
		getTotalRevenue.setParams({
            "clientId": component.get("v.recordId")
        });

		
		getTotalRevenue.setCallback(this, function(response) {
			var state = response.getState();
			var respValue = response.getReturnValue();
			if (component.isValid() && state === "SUCCESS") {

				component.set("v.totalRevenue", respValue);
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
		$A.enqueueAction(getTotalRevenue);
	}
})