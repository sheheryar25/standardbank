/**
 * Created by akepczynski on 13.06.2018.
 */
({

    doRecall: function(component, event, helper) {
        var recallAction = component.get('c.recall');
        recallAction.setParams({"recordId" : component.get('v.recordId'),
                                "message" : component.get('v.message')}),

        recallAction.setCallback(self, function(result) {
            if (component.isValid()) {
                var res = result.getReturnValue();
                if (res.isSuccess) {
                    $A.get("e.force:refreshView").fire();
                    $A.get("e.force:closeQuickAction").fire();
                }
                else {
                    component.set('v.errorMessage', res.errorMessage);
                }
            }
        });

        $A.enqueueAction(recallAction);
    },

    doCancel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }

})