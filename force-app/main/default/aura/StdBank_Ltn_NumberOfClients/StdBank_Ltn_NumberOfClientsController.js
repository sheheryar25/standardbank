({

	doInit : function(component, event, helper) {
		var getCountByClientGroup = component.get("c.getCountByClientGroup");
		

		getCountByClientGroup.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				var mapCountByClientGroup = response.getReturnValue();
				if(mapCountByClientGroup!=null){
					var counts = [];
					for ( key in mapCountByClientGroup ) {
	                    counts.push({value:mapCountByClientGroup[key], key:key});
	                }
	                component.set("v.counts", counts);
				}
			}
		});

		var getTargetURL = component.get("c.getTargetURL");
		

		getTargetURL.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.targetURL",  response.getReturnValue());
			}
		});

		$A.enqueueAction(getCountByClientGroup);
		$A.enqueueAction(getTargetURL);
	},

	gotoURL : function (component, event, helper) {
	    var urlEvent = $A.get("e.force:navigateToURL");
	    urlEvent.setParams({
	      "url": component.get('v.targetURL')
	    });
	    urlEvent.fire();
	}
})