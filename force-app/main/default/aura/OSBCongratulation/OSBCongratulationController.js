({
    init : function(component) {
        var action = component.get("c.getContactName");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var values = response.getReturnValue();
                component.set("v.fullName", values);  
            }
            else if (state === "ERROR") {
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
    },
    
    signOut : function(component, event, helper) {
        helper.logout();
    }
})