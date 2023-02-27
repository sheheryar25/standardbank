({
	doInit : function(component, event, helper) {
		var getReportId = component.get("c.getReportId");
		
		getReportId.setParams({
	        developerName : component.get("v.reportName")
	    });


		getReportId.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS" && response.getReturnValue()) {
				var recId = component.get("v.recordId");
				var params = recId?'fv0='.concat(recId):'';	
				component.set("v.reportUrl", '/one/one.app#/sObject/'+response.getReturnValue()+'/view?'+params);
			}
		});
		$A.enqueueAction(getReportId);
	}
})