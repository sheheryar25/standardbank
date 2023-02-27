({
	doInit : function(component, event, helper) {
	    helper.doInit(component, event, helper);
	},

	onSave : function(component, event, helper) {
        if (helper.isValidForm(component)) {
            component.set('v.isLoading', true);
            var save = component.get("c.save");
            save.setParams({
                oppRecord : component.get("v.oppRecord"),
                recordId : component.get("v.recordId")
            })

            save.setCallback(this, function(response) {
                if (component.isValid()) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var navigateToSObject = $A.get("e.force:navigateToSObject");
                        navigateToSObject.setParams({
                            "recordId": response.getReturnValue()
                        });
                        navigateToSObject.fire();
                    }
                    else if (state === "ERROR") {
                        component.set('v.isLoading', false);
                        component.set("v.errorMessage", UTL.getErrorMessage(response.getError()));
                    }
                }
            })
		    $A.enqueueAction(save);
        }
	},

	onCancel : function(component, event, helper) {
	    var recordId = component.get("v.recordId");
	    if (recordId) {
            var navigateToSObject = $A.get("e.force:navigateToSObject");
            navigateToSObject.setParams({
                "recordId": recordId
            });
            navigateToSObject.fire();
        }
        else {
		    window.history.back();
		}
    },

    handleErrorChange : function(component, event, helper) {
        if (component.get("v.errorMessage")) {
            window.scroll(0,0);
        }
    }

})