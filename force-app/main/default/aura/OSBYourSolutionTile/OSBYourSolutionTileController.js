({
    init : function (component, event, helper) {
        
        let action = component.get("c.mfaLogin");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
            
                let res = response.getReturnValue();
                component.set("v.strongAuth",res);
            } 
        });
        $A.enqueueAction(action);
    },
    removeSolutionAsFavourite: function (component, event, helper) {
        var action = component.get("c.removeUserSubscribedSolution");
        var solutionId = component.get("v.solutionId");

        action.setParams({
            "solutionId": solutionId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();

            if (state === "SUCCESS") {
                let navService = component.find("navService");
                let pageReference = {
                    type: "comm__namedPage",
                    attributes: {
                        name: "Home"
                    },
                    state : {
                        "refreshView" : "true"
                    }
                };
                
                navService.navigate(pageReference);
                $A.get('e.force:refreshView').fire();
            } else if (state === "ERROR") {
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
    showMfaRequiredModal : function(component, event, helper){
        component.set("v.showMfaRequiredPopup",false);
        component.set("v.showMfaRequiredPopup",true);
    }
})