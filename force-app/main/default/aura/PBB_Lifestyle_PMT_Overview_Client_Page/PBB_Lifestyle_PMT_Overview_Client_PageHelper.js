/**
 * Created by Mykhailo Reznyk on 04.11.2019.
 */
({
       getData: function (component, event) {
            var action = component.get("c.fetchData");
            action.setParams({ clientId : component.get("v.recordId") });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.revenueProfit", response.getReturnValue());
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                else {
                    console.log("State: " + state); 
                }
            });
            $A.enqueueAction(action);
        }
})