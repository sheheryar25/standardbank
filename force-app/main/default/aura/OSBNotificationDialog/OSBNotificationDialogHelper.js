({
    navigateTo: function(component, recId) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recId
        });
        navEvt.fire();
    },
    
    getAssignedUsers: function(component, recId){
        var action = component.get("c.getAssignedUsers");
        action.setParams({ 
            notificationId : recId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){
                var result = response.getReturnValue().split(";");
                component.set("v.selectedUserList", result);
            }
        });
        $A.enqueueAction(action);
    }
})