/**
 * Created by Mykhailo Reznyk on 22.11.2019.
 */
({
      getData: function (component, event) {
            var action = component.get("c.fetchData");
            action.setParams({ clientId : component.get("v.recordId") });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.accountRecord", response.getReturnValue());
                    if(response.getReturnValue() != null && response.getReturnValue().Client_Accounts__r != null){
                        component.set("v.numberOfClientAccounts", response.getReturnValue().Client_Accounts__r.length);
                    }
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