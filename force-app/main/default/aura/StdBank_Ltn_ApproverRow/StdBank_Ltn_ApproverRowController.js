({
    doInit : function(component) {
        $A.createComponent(
            "c:StdBank_Ltn_ICON",
            {
                'type': 'standard',
                'name': component.get('v.data').ProcessInstance.TargetObject.Type.toLowerCase()
            },
            function(newButton){
                if (component.isValid()) {
                    var body = component.get("v.body");

                    body.push(newButton);
                    component.set("v.body", body);
                }
            }
        );
    },
    doApprove : function (component) {
        var event = component.getEvent('showModal');

        event.setParam('type', 'approve');
        event.setParam('data', component.get('v.data'));
        event.fire();
    },
    doReject : function (component) {
        var event = component.getEvent('showModal');

        event.setParam('type', 'reject');
        event.setParam('data', component.get('v.data'));
        event.fire();
    },
    doReassign : function (component) {
        var event = component.getEvent('showModal');

        event.setParam('type', 'reassign');
        event.setParam('data', component.get('v.data'));
        event.fire();
    },
    navigateToRecord : function(component, event){
        var cdcRecord = component.get('v.data.ProcessInstance.TargetObjectId');
        var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
              "recordId": cdcRecord
            });
            navEvt.fire();

    }
});