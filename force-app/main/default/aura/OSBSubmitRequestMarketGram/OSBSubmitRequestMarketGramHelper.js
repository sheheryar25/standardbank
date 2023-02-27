({
    
    createCase: function(component, newCase) {
        var action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var isLoggedIn = response.getReturnValue();
                component.set("v.isUserLoggedIn",response.getReturnValue());
                if(isLoggedIn) {
                    var action = component.get("c.saveSuggestion");
                    action.setParams({
                        "newCase": newCase
                    });
                    action.setCallback(this, function(response){
                        var state = response.getState();
                        console.log('state'+state);
                        if (component.isValid() && state === "SUCCESS") {
                            component.set("v.subMittingCase", false);
                            document.querySelector(".newCase__form").reset();
                            component.set("v.description","");
                            window.scrollTo(0,0);
                            component.set("v.caseCreated", true);
                            setTimeout(function(){ 
                                component.set("v.caseCreated",false);  
                            }, 5000);
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
                    })
                    $A.enqueueAction(action);
                }
                else{
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/s"
                    });
                    urlEvent.fire();
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
    }
})