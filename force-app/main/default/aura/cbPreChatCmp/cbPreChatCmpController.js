({
    doInit: function(component, event, helper) {
        var action = component.get("c.getCurrentUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set('v.userId', result.userId);
                if (result.userId) {
                    component.set('v.contactId', result.contactId);
                    component.set('v.firstName', result.firstName);
                    component.set('v.lastName', result.lastName);
                    component.set('v.email', result.email);
                    component.set('v.token', result.token);
                }
            }
            helper.startChat(component, event, helper);
        });
        $A.enqueueAction(action);
    }
})