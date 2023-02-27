//2017-10-26 - Rudolf Niehaus - CloudSmiths
({
    clickSpam : function(component, event, helper) {
        
        helper.showSpinner(component);
        
        var action = component.get("c.flagCase");
        
        action.setParams({
            "caseId":component.get("v.recordId")
        });
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
         
        var state = response.getState();
         
            if (component.isValid() && state === "SUCCESS") {
                
                // refresh record detail
                $A.get("e.force:refreshView").fire();
                
                // show success notification
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Case flagged as Spam",
                    "type":"success"
                });
                
                toastEvent.fire();
                helper.hideSpinner(component);
                helper.closeFocusedTab(component);
            }
       });

        // Send action off to be executed
        $A.enqueueAction(action);
    },
        clickDuplicate : function(component, event, helper) {
        
        helper.showSpinner(component);
        
        var action = component.get("c.duplicate");
        
        action.setParams({
            "caseId":component.get("v.recordId")
        });
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
         
        var state = response.getState();
         
            if (component.isValid() && state === "SUCCESS") {
                
                // refresh record detail
                $A.get("e.force:refreshView").fire();
                
                // show success notification
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Case flagged as a Duplicate case",
                    "type":"success"
                });
                
                toastEvent.fire();
                helper.hideSpinner(component);
                helper.closeFocusedTab(component);
            }
       });

        // Send action off to be executed
        $A.enqueueAction(action);
    },

     clickNotOrdinary : function(component, event, helper) {
         
        helper.showSpinner(component);
        
        var action = component.get("c.notOrdinary");
        
        action.setParams({
            caseId : component.get("v.recordId")
        });
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
         
        var state = response.getState();
         
            if (component.isValid() && state === "SUCCESS") {
                
                // refresh record detail
                $A.get("e.force:refreshView").fire();
                // show success notification
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Case promoted to a Not Ordinary type Case",
                    "type":"success"
                });
                
                toastEvent.fire();
                helper.hideSpinner(component);
            }
       });

        // Send action off to be executed
        $A.enqueueAction(action);
		
	},
    showSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.addClass(spinner, "slds-hide");
         
    }
    
})