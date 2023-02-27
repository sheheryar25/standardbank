({
	 onInit : function(cmp, event, helper) {
        var action = cmp.get("c.fetchConversationsAndUpdateRecords");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var status = response.getReturnValue();
                if(status === 'DATA_UP_TO_DATE') {
                    helper.showToast(cmp, "Success!", "Data up to date.");
                    return;
                } else if (status === 'DATA_FOUND') {
                    helper.showToast(cmp, "Success!", "Conversations has been updated successfully");
                    $A.get('e.force:refreshView').fire();
                    var compEvent = cmp.getEvent("appEvent");
                    compEvent.fire();
                } else if (status = 'NO_DATA') {
                    helper.showToast(cmp, "Information","No information available")
                }

            }
            else if (state === "ERROR") {
				helper.showToast(cmp, "Error!","A data update for this Client was not completed. Please note the administrator has been notified", "error");
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