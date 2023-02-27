({
	doInit : function(component) {
        var action = component.get("c.getFeedItemsForUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('Notification 1'+state);
            if (state === "SUCCESS") {
                var notifications = response.getReturnValue();
                component.set("v.notifications", notifications);
                if(notifications && notifications.length === 0) {
                    component.set("v.empty", true);
                }
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

    navigateToNotifications : function(component, event) {
        var urlEvent = $A.get("e.force:navigateToURL");
        var index = event.target.dataset.index;
        urlEvent.setParams({
            "url" : "/s/notifications?index=" + index
        });
        urlEvent.fire();
    }
})