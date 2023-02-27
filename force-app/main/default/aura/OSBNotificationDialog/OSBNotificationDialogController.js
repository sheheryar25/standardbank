({
    doInit : function(component, event, helper) {
        var recId = component.get("v.recordId");
        if (recId) {
            component.set("v.modalContext", "Edit");
            helper.getAssignedUsers(component,recId);
        }
        var action = component.get("c.getAvailableUsers");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){
                var result = response.getReturnValue();
                var users = [];
                users.push({
                    label : 'All Users', 
                    value : 'All Users'
                });
                for(var key in result){
                    users.push({
                        label : result[key], 
                        value : key
                    });
                }
                component.set("v.UserList", users);
            }
        });
        $A.enqueueAction(action);
        
        if (!recId) {
            component.find("forceRecord").getNewRecord(
                "Notification__c",
                null,
                false,
                $A.getCallback(function() {
                    var rec = component.get("v.notificationRecord");
                    var error = component.get("v.recordError");
                    if (error || (rec === null)) {
                        console.log("Error initializing record template: " + error);
                        return;
                    }
                })
            );
        }
        
    },
    saveRecord : function(component, event, helper) {
        var notificationTitle = component.find('notificationTitle').get("v.value");
        var notificationContent = component.find('notificationContent').get("v.value");
        var selectedUserList = component.get("v.selectedUserList");
        var labels = component.get("v.UserList")
        .filter(option => selectedUserList.indexOf(option.value) > -1)
        .map(option => option.label);
        component.set("v.notificationRecord.Users__c", selectedUserList.join(";"));
        component.set("v.notificationRecord.Selected_Users__c", labels.join(";"));
        component.set("v.notificationRecord.Name", component.find('notificationName').get("v.value"));    
        component.set("v.notificationRecord.Title__c", notificationTitle);
        component.set("v.notificationRecord.Content__c", notificationContent); 
        var tempRec = component.find("forceRecord");
        tempRec.saveRecord($A.getCallback(function(result) {
            console.log(result.state);
            var resultsToast = $A.get("e.force:showToast");
            if (result.state === "SUCCESS") {
                resultsToast.setParams({
                    "title": "Saved",
                    "message": "The record was saved."
                });
                resultsToast.fire();  
                var recId = result.recordId;
                helper.navigateTo(component, recId);
            } else if (result.state === "ERROR") {
                console.log('Error: ' + JSON.stringify(result.error));
                resultsToast.setParams({
                    "title": "Error",
                    "message": "There was an error saving the record: " + JSON.stringify(result.error)
                });
                resultsToast.fire();
                
            } else {
                console.log('Unknown problem, state: ' + result.state + ', error: ' + JSON.stringify(result.error));
            }
        }));
        
    },
    cancelDialog: function(component, event, helper) {
        var recId = component.get("v.recordId");
        if (!recId) {
            var homeEvt = $A.get("e.force:navigateToObjectHome");
            homeEvt.setParams({
                "scope": "Notification__c"
            });
            homeEvt.fire();
        } else {
            helper.navigateTo(component, recId);
        }
    },
    handleUserChange: function (component, event, helper) {
        //Get the Selected values 
        //alert(component.get("v.selectedUserList"))  
        var selectedValues = event.getParam("value");
        if(selectedValues.includes("All Users")){
           selectedValues=["All Users"];
        }
        //alert(labels);
        //component.set("v.selectedUserNames", labels);
        //Update the Selected Values  
        component.set("v.selectedUserList", selectedValues);
    }
    
    
})