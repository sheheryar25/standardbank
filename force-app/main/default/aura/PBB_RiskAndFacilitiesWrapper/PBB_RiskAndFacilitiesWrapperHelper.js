/**
 * Created by mpszonka on 17.07.2020.
 */

({
    getData: function (component, event) {
        const action = component.get("c.fetchData");
        action.setParams({ clientId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            const state = response.getState();
            console.log('risk and facilites wrapper ', response.getReturnValue());
            if (state === "SUCCESS") {
                component.set("v.data", response.getReturnValue());

            }
            else {
                component.set("v.data", { unknownError: true });
            }
        });
        $A.enqueueAction(action);
    }
})