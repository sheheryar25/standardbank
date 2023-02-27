({
	 onInit : function(cmp) {
        var action = cmp.get("c.upsertRelatedParties");
        action.setParams({ clientId : cmp.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
              
                cmp.find('notifLib').showToast({
					"title": "Success!",
					"message": "Related has been updated successfully"
				});
				$A.get('e.force:refreshView').fire();
			       
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
				cmp.find('notifLib').showToast({
					"title": "Error!",
					"message": "Unable to refresh related parties",
					"variant" : "error"
				});
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
		    
        $A.enqueueAction(action);
    }
})