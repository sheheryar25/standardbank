({
    doInit: function (component, event) {
        let recId = component.get("v.recordId");
        let userId = $A.get("$SObjectType.CurrentUser.Id");

        let action = component.get("c.checkUser");
        
        action.setParams({ "recId": recId, "userId": userId });
    
        action.setCallback(this, function (response) {
            let state = response.getState();

            if (state === "SUCCESS") {
                component.find("btnUnlock").set("v.disabled", response.getReturnValue());
            }
            else if (state === "ERROR") {
                alert('Error ' + response.getReturnValue());
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        //Queue the action to run
        $A.enqueueAction(action);
    },

    NBAC_UnlockBA: function (component, event, helper) {

        let recId = component.get("v.recordId");
        let action = component.get("c.updateBA");

        action.setParams({ "id": recId, "milestone": "Finalisation" });
        action.setCallback(this, function (response) {
            let state = response.getState();

            if (state === "SUCCESS") {
                $A.get("e.force:closeQuickAction").fire();
                $A.get('e.force:refreshView').fire();
            }
            else if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        //Queue the action to run
        $A.enqueueAction(action);
    },

    NBAC_CancelUnlock: function (component, event, helper) {

        $A.get("e.force:closeQuickAction").fire();
    }
})