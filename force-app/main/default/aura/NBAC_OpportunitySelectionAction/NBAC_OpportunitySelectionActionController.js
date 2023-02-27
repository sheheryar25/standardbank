({
	componentActionHandler : function(component, event, helper) {
		var resultsToast = $A.get("e.force:showToast");
		if(component 
			&& event.getParam('data')
			&& event.getParam('data').name){

			var actionName = event.getParam('data').name;
			var assessmentId = event.getParam('data').recordId;
			
			if(actionName=='continue'){

		        resultsToast.setParams({
		            "message": "Business Assessment was successfully saved."
		        });
		        resultsToast.fire();

		        var urlEvent = $A.get("e.force:navigateToURL");
			    urlEvent.setParams({
			      "url": '/'+assessmentId
			    });
			    urlEvent.fire();

			}else if(actionName=='cancel'){
				
				var dismissActionPanel = $A.get("e.force:closeQuickAction");
	        	dismissActionPanel.fire();

			}
		} else{
			resultsToast.setParams({
	            "message": "Something went wrong.",
	            "type": "error"
	        });
	        resultsToast.fire();
		}

	}
})