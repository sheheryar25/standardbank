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
        action.setCallback(this,function(response){
            //get the response state
            var state = response.getState();
            //check if result is successfull
            if(state === "SUCCESS"){
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
            }else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error",
                    "message":"There was an error merging this case",
                    "type":"error"
                });
                toastEvent.fire();
                this.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
    },
    mergeMultipleCaseAction : function(component, newParent,listSelectedID){
        this.showSpinner(component);
        var action = component.get("c.mergeMultipleCase");
        action.setParams({ 
            "newParent":newParent,
            "newChildList": listSelectedID,
        });
        action.setCallback(this,function(response){
            //get the response state
            var state = response.getState();
            //check if result is successfull
            if(state === "SUCCESS"){
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
            }else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error",
                    "message": response.getError()[0].pageErrors[0].message,
                    "type":"error"
                });
                toastEvent.fire();
                this.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
    },
    searchHelper : function(component,event,getInputkeyWord) {
        var parentCase = component.get("v.recordId");
        // call the apex class method 
        var action = component.get("c.fetchLookUpValues");
        // set param to method  
        action.setParams({
            'searchKeyWord': getInputkeyWord,
            'objectName' : component.get("v.objectAPIName"),
            'excludeItemsList' : component.get("v.lstSelectedRecords"),
            'parentCaseId':parentCase
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // if storeResponse size is equal 0 ,display No Records Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Case Found For Merge');
                } else {
                    component.set("v.Message", '');
                    // set searchResult list with return value from server.
                }
                component.set("v.listOfSearchRecords", storeResponse); 
            }
        });
        // enqueue the Action  
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