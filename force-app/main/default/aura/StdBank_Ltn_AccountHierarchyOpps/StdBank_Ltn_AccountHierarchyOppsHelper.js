({
	fetchOpps : function(component) {

		var getOpps = component.get("c.getOpportunities");
        getOpps.setParam("accountId", component.get("v.accountId"));
        getOpps.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set("v.opportunities", result);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(getOpps);
	}, 
    
    fetchOptions : function(component){
        var getOptions = component.get("c.getStageNames");
        getOptions.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.oppStages", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(getOptions);
    }
})