({
    getReportId: function(component, event, helper) {
        var action = component.get("c.getReportIdAction");
        var params = event.getParam("arguments");

        action.setParams({ reportName: params.reportName });
        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    }
})