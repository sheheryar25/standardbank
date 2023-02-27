({
	doInit : function(component, event, helper) {
		//
		// Remove class from input select
		//
		var action = component.get("c.getFromAddresses");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.addresses", response.getReturnValue());
				component.set("v.orgWideEmailAddressId", "");
			}
			else {
				console.log("Failed with state: " + state);
			}
		});
		$A.enqueueAction(action);
	},

	onChange: function(component, event, helper) {
		component.set("v.orgWideEmailAddressId", event.currentTarget.value);
	}
})