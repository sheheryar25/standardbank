({
    doInit: function (component, event, helper) {
        var recordId = component.get('v.recordId');
        var checkval = component.get('c.checkvalid');
        checkval.setParam('recordId', recordId);
        checkval.setCallback(self, function(result) {
            if (component.isValid()) {
                var data = JSON.parse(result.getReturnValue());
                if (data.success == false) {
                    $A.get("e.force:closeQuickAction").fire();
                    helper.showToast('error','',data.message);
                    setTimeout(function() {
                        $A.get('e.force:refreshView').fire();
                    }, 5000);
                }
            }
        });
        $A.enqueueAction(checkval);
        
    },

    refreshAccount : function (component, event, helper) {
        component.set('v.isLoading', false);
    },

    doSave: function (component, event, helper) {
        if (helper.validateRecord(component)) {
            helper.updateRecord(component, helper);
        }
    }
})