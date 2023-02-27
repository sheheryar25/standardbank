({
    relatedCases : function(component, parentCase){
        var action = component.get("c.getRelatedCase");
        action.setParams({ 
          "parentCaseId":parentCase
        });
         action.setCallback(this, function(a){
            component.set("v.relatedCaseList", a.getReturnValue());
         });
         
        $A.enqueueAction(action);
    },
    mergeCaseAction : function(component, newParent, newChild){
        
        this.showSpinner(component);
        
        var action = component.get("c.mergeCase");
        action.setParams({ 
          "newParent":newParent,
          "newChild":newChild  
        });
        action.setCallback(this,function(a){
            //get the response state
            var state = a.getState();
            
            //check if result is successfull
            if(state == "SUCCESS"){
                
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Case successfully merged",
                    "type":"success"
                });

               toastEvent.fire();
               //close current tab with case that we just merged
                var workspaceAPI = component.find("workspace");
                
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.closeTab({tabId: focusedTabId});
                }).catch(function(error) {
                    console.log(error);
                });
                
                this.hideSpinner(component);
                
            }else if(state == "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error",
                    "message": "There was an error merging this case",
                    "type":"error"
                });
               
                toastEvent.fire();
                this.hideSpinner(component);
            }
        });
         
        $A.enqueueAction(action);
    },
    openTab : function(component, event, caseID) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            recordId: caseID,
            focus: true
        }).then(function(response) {
            workspaceAPI.focusTab({
                tabId: response
            });
        }).catch(function(error) {
                console.log(error);
       });
        
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