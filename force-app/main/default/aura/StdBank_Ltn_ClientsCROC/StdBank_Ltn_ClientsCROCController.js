({
    doInit : function(component, event, helper) {
        var getCROC = component.get("c.getCROC");
        var clientId = component.get("v.clientId");
        getCROC.setParams({
            "recordId": component.get("v.recordId")
        });

		
		getCROC.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.croc", response.getReturnValue());
			}
		});
		$A.enqueueAction(getCROC);
    }
})