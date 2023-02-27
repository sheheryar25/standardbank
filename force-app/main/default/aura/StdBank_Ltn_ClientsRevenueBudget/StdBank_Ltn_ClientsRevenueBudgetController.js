({
	doInit : function(component, event, helper) {
		var getTotalRevenue = component.get("c.getTotalRevenue");

		getTotalRevenue.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
                component.set("v.totalRevenue", response.getReturnValue()/1000000);
			}
		});
		
		var getTotalBudget = component.get("c.getTotalBudget");

		getTotalBudget.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
                component.set("v.totalBudget", response.getReturnValue()/1000000);
			}
		});

		var getUserIsoCode = component.get("c.getUserIsoCode");

		getUserIsoCode.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.isoCode", response.getReturnValue());
			}
		});

		$A.enqueueAction(getTotalRevenue);
		$A.enqueueAction(getTotalBudget);
		$A.enqueueAction(getUserIsoCode);
	}
})