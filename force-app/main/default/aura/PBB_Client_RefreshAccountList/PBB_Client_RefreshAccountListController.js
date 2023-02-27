({
    onInit: function (cmp, event, helper) {
        var action = cmp.get("c.upsertAccountInfo");
        action.setParams({
            clientId: cmp.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var status = response.getReturnValue();
                if (status === 'DATA_UP_TO_DATE') {
                    return;
                } else if (status === 'DATA_FOUND') {
					helper.showToast(cmp, "Success!","The account list has been updated successfully");
                    $A.get('e.force:refreshView').fire();
                    var appEvent = $A.get("e.c:PBB_DataLoaded");
                    appEvent.fire();
                } else if (status = 'NO_DATA') {
					helper.showToast(cmp, "Account Information","No information available");
                }
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
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