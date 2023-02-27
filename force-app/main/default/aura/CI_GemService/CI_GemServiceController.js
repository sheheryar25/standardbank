({
    getGems : function (component, event, helper) {
        var action = component.get("c.getGemsAction");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    deleteGem : function (component, event, helper) {
        var action = component.get("c.deleteGemAction");
        var params = event.getParam("arguments");

        action.setParams({ gemId: params.gemId });
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    dismissGem : function (component, event, helper) {
        var action = component.get("c.dismissGemAction");
        var params = event.getParam("arguments");

        action.setParams({ gemId: params.gemId });
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    }
})