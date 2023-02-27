({
	doInit : function(component, event, helper) {
		var action = component.get("c.getActionItems");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.actionItems", response.getReturnValue());
				component.set("v.isLoading", false);
			}
		});
		$A.enqueueAction(action);
	}
})