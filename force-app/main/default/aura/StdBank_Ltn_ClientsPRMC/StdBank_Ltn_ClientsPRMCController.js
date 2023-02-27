({
    doInit: function(component, event, helper) {

    	var getRiskAppetite = component.get("c.getRiskAppetite");
		getRiskAppetite.setParams({
            "clientId": component.get("v.recordId")
        });

		
		getRiskAppetite.setCallback(this, function(response) {
			var state = response.getState();
			var riskAppVal = response.getReturnValue();

			console.log('riskAppVal: ' + riskAppVal);
			
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.riskAppetite", riskAppVal);

				if(riskAppVal == 'Add' || riskAppVal == 'Add Subject To'){
					component.set("v.riskAppetiteColor", 'Green-Positive');
				} else if (riskAppVal == 'Hold'){
					component.set("v.riskAppetiteColor", 'Yellow-Attention');
				} else if (riskAppVal == 'Reduce'){
					component.set("v.riskAppetiteColor", 'Red-Negative');
				}
			}

		});
 
      	$A.enqueueAction(getRiskAppetite);

  	}
})