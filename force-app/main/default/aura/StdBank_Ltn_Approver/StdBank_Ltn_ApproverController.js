({
    doInit: function (component, event, helper) {
        console.log('StdBank_Ltn_ApproverController::Initializing Lightning Approver Component');
        console.log('StdBank_Ltn_ApproverController::Getting data');

        var getData = component.get('c.getData');
        var getUsers = component.get('c.getUsers');
        var self = this;

        getData.setCallback(self, function (result) {
            if (component.isValid()) {
                component.set('v.data', result.getReturnValue());
                component.set('v.isLoading', false);
            }
        });
        
        getUsers.setCallback(self, function (result) {
            if (component.isValid()) {
                component.set('v.users', result.getReturnValue());
            }
        });

        $A.enqueueAction(getData);
        $A.enqueueAction(getUsers);
    },
    handleEvent: function (component, event, helper) {
        helper.processEvent(component, event);
    },
    modalSave: function (component, event, helper) {
        helper.processSave(component);
    },
    modalClose: function (component, event, helper) {
        helper.clearEvent(component);
    }
});