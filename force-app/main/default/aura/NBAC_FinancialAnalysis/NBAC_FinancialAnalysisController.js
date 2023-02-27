({
   doInit : function(component, event, helper) {
		var getInitialData = component.get("c.getInitialData");

		getInitialData.setParams({
			"contextId"	: component.get("v.recordId"),		
			"indicatorDevName"	: component.get("v.indicatiorRTName"),	
			"metricDevName"	: component.get("v.metricRTName")	
		});

		getInitialData.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS"){
					var responseData = response.getReturnValue();
					component.set("v.metricRT", responseData.metricRT);
					component.set("v.indicatiorRT", responseData.indicatorRT);
					component.set("v.isLoading", false);				
				}
			}
		}); 
		$A.enqueueAction(getInitialData);			
	}
})