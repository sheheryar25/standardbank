({
	customSave : function(component, event, helper) {
        var caseId = component.get("v.recordId");
		var caseComment = component.get("v.caseCommentText");
    	var action = component.get("c.saveCaseComment");
        action.setParams({
            "caseId": caseId,
            "caseCommentString":caseComment
        });
        
        action.setCallback(component,
                           function(response) {
                               // Display the total in a "toast" status message
                               var resultsToast = $A.get("e.force:showToast");
                               resultsToast.setParams({
                                   "title": "Success!",
                                   "type": "success",
                                   "message": "Case Comment has been submitted!"
                               });
                               resultsToast.fire();
                               var navEvt = $A.get("e.force:navigateToSObject");
                               navEvt.setParams({
                                   "recordId": component.get("v.recordId")
                               });
                               navEvt.fire();
                           }
                          );
        if(caseComment != ''){
            $A.enqueueAction(action);
        }
	}
,
	customCancel : function(component, event, helper) { 
        component.set("v.caseCommentText","");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.recordId")
        });
        navEvt.fire();
   }    
})