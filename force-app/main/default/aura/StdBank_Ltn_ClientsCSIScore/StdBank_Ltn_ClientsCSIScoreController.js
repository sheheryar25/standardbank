({
    doInit: function(component, event, helper) {

    	var getCSIScore = component.get("c.getCSIScore");
		getCSIScore.setParams({
            "clientId": component.get("v.recordId")
        });

		
		getCSIScore.setCallback(this, function(response) {
			var state = response.getState();
			var CSIScoreValue = response.getReturnValue();
			
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.CSIScore", CSIScoreValue);

				if(CSIScoreValue == 'Not Rated'){
					component.set("v.CSIScoreText", 'Not Rated');					
				} else if (isNaN(CSIScoreValue)){
					component.set("v.CSIScoreText", 'Not Rated');
				} else if (parseInt(CSIScoreValue) >= 1 && parseInt(CSIScoreValue) <= 6){
					component.set("v.color", 'red-negative');
					component.set("v.CSIScoreText", 'Client at Risk');
				} else if (parseInt(CSIScoreValue) == 7){
					component.set("v.color", 'yellow-attention');
					component.set("v.CSIScoreText", 'Room for Improvement');
                } else if (parseInt(CSIScoreValue) == 8){
                    component.set("v.CSIScoreText", 'Satisfied');
                    component.set("v.color", 'green-positive');
                } else if (parseInt(CSIScoreValue) >= 9 && parseInt(CSIScoreValue) <= 10){
                    component.set("v.CSIScoreText", 'Extremely Satisfied');
					component.set("v.color", 'green-positive');
				} else {
					component.set("v.CSIScoreText", 'Not Rated');
				}
			}

		});
 
      	$A.enqueueAction(getCSIScore);

  	}
})