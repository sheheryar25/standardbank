({
	doInit : function(component, event, helper) {
		console.log('START');
		var getAccount = component.get("c.getAccount");
		console.log('START');
        getAccount.setParam("accountId", component.get("v.recordId"));
        getAccount.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
            	console.log('SUCCESS');
                var result = response.getReturnValue();
                component.set("v.account", result);
                component.set("v.isLoading", false);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(getAccount);
	}
})