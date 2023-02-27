({
    setFirstPage: function(component) {
        let pages = component.get("v.pages");
        component.set("v.currentPage", pages[0]);
    	component.set("v.currentPageNumber", 0);
    },
    setPreviousPage: function(component) {
        let prevPageNumber = component.get("v.currentPageNumber") - 1;
        let pages = component.get("v.pages");
        component.set("v.currentPage", pages[prevPageNumber]);
    	component.set("v.currentPageNumber", prevPageNumber);
    },
    setLastPage: function(component) {
        let l = component.get("v.pages").length;
        let pages = component.get("v.pages");
        component.set("v.currentPage", pages[l-1]);
    	component.set("v.currentPageNumber", l-1);
    },
    setNextPage: function(component) {
        let nextPageNumber = component.get("v.currentPageNumber") + 1;
        let pages = component.get("v.pages");
        component.set("v.currentPage", pages[nextPageNumber]);
    	component.set("v.currentPageNumber", nextPageNumber);
    },
	doInit : function(component, event, helper) {
        var action = component.get("c.getFeedItemsForUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                var notifications = response.getReturnValue();
                component.set("v.notifications", notifications);
                if(notifications && notifications.length === 0) {
                    component.set("v.empty", true);
                }
                var pages = notifications.map(() => notifications.splice(0,7)).filter(a => a);
                component.set("v.pages", pages);
                component.set("v.currentPage", pages[0]);
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
    setPage: function(component, event) {
        var el = event.target;
        var currentEl = event.currentTarget;
        component.set("v.currentPageNumber", +currentEl.innerHTML);
        component.set("v.currentPage", component.get("v.pages")[currentEl.innerHTML]);
    },

    handleReadNotification : function(component, event, helper) {
        let notificationId = event.getParam("notificationId");
        let action = component.get("c.markReadNotification");
        action.setParams({
            "recordId" : notificationId
        });
        action.setCallback(this, function(response) {
            helper.updateNotificationCallback(response);
        });
        $A.enqueueAction(action);
    }
})