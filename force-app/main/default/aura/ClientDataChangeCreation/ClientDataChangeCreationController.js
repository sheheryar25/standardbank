({
     doInit: function(component, event, helper) {
        var getData = component.get('c.getData');
        getData.setParams({"recordId" : component.get('v.recordId')}),

        getData.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.record', result.getReturnValue());
            }
            component.set('v.isLoading', false);
        });

        $A.enqueueAction(getData);
    },

    doCancel : function(component, event, helper) {

        if(component.get('v.isQuickAction')){
            $A.get("e.force:closeQuickAction").fire();
        }
        else{
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({  "recordId": component.get('v.recordId')}).fire();
        }
    },

    keep : function(component, event, helper) {
        helper.doApprove(component, true);
    },

    remove : function(component, event, helper) {
        helper.doApprove(component, false);
    },

    proceed : function(component, event, helper) {
        helper.doApprove(component, null);
    },


    handleRoleChange : function(component, event, helper){
        if(!component.get('v.record') || !component.get('v.record').New_Client_Coordinator_Role__c){
            component.set('v.showKeepAndRemove', false);
            component.set('v.message', "Please populate New Coordinator and Role to proceed.");
            return;
        }
        component.set('v.isLoading', true);
        var getDispBtn = component.get('c.showKeepAndRemove');
        getDispBtn.setParams({  "cdc" : component.get('v.record')});

        getDispBtn.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.showKeepAndRemove', result.getReturnValue());
            }
            component.set('v.isLoading', false);
        });

        var getMsg = component.get('c.getMessage');
        getMsg.setParams({  "cdc" : component.get('v.record')});

        getMsg.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.message', result.getReturnValue());
            }
            component.set('v.isLoading', false);
        });

        $A.enqueueAction(getDispBtn);
        $A.enqueueAction(getMsg);
    }
})