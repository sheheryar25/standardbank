({
    getCase1 : function(component, event, helper) {
        
         var action = component.get("c.getCase1");
        
         action.setCallback(this, function(a){
            component.set("v.case1", a.getReturnValue());
         });
         
        $A.enqueueAction(action);
    },
    getRenderIFStatus : function(component, event, parentCase) {
        
          var action = component.get("c.getRenderIF");
         action.setParams({ 
            "parentCase":parentCase
         });
         action.setCallback(this, function(a){
            component.set("v.renderIF", a.getReturnValue());
         });
         
        $A.enqueueAction(action);
    },
    saveCase1: function(component, varcase1, parentCase) {
        
        this.upsertCase(component, varcase1, parentCase, function(a) {
            var cases1 = component.get("v.case1");
            cases1.push(a.getReturnValue());
            component.set("v.case1", cases1);
        });
    },
    upsertCase : function(component, thecase, parentCase, callback) {
        
      this.showSpinner(component);  
        
      var action = component.get("c.saveCase");
      action.setParams({ 
          "c": thecase,
          "parentCase":parentCase
      });
       action.setCallback(this,function(a){
            //get the response state
            var state = a.getState();
            
            //check if result is successfull
            if(state == "SUCCESS"){
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Case successfully split",
                    "type":"success"
                });
                
                if(thecase.Subject != null){
                    toastEvent.fire();
                    $A.get("e.force:refreshView").fire();
                }
                
                this.hideSpinner(component);
                
            }else if(state == "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error",
                    "message": "There was an error splitting this case",
                    "type":"error"
                });
                if(thecase.Subject != null){
                     toastEvent.fire();
                }
                
                this.hideSpinner(component);
            }
        });
        
      $A.enqueueAction(action);
    },
    cancelAction: function(component) {
       var dismissActionPanel = $A.get("e.force:closeQuickAction");
       dismissActionPanel.fire(); 
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