({

	doInit : function(component, event, helper) {
		var getCountByClientGroup = component.get("c.getCountByClientGroup");
		var querySettings = component.get("v.querySettings");

		getCountByClientGroup.setParams({querySettings: querySettings});

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

		$A.enqueueAction(getCountByClientGroup);
		helper.getCustomSettings(component);

	},

})