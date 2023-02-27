({
    doInit : function(component, event, helper) {
        helper.doInit(component, helper);
    },

    handleRecordUpdated : function(component, event, helper) {
        let changeType = event.getParams().changeType;

        if (changeType === 'LOADED') {
            component.set('v.isWaiting', false);
        }
    },

    onSave : function(component, event, helper) {
        if (helper.isValidForm(component, helper)) {
            component.set('v.isWaiting', true);
            let account = component.get('v.account');
            account.Update_Path__c = true;
            component.set('v.account', account);
            component.set('v.isWaiting', true);
            component.find('accountFRD').saveRecord($A.getCallback(function(saveResult) {
                component.set('v.isWaiting', false);
                if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                    $A.get('e.force:refreshView').fire();
                    $A.get('e.force:closeQuickAction').fire();
                }
                else {
                    helper.showNotification(component, UTL.getErrorMessage(saveResult.error));
                }
            }));
        }
    },

    onCancel : function(component) {
        $A.get('e.force:closeQuickAction').fire();
    }
})