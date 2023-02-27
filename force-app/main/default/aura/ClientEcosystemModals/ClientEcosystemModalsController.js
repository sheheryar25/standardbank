/**
 * Created by Chibuye Kunda on 2020/03/09.
 */

({
    onCancel : function(component, event, helper) {

            let clientEcosystem_Event = component.getEvent('ClientEcosystemModal_Event');
            clientEcosystem_Event.setParams({
                "data": JSON.stringify({event_type: 'cancelModal', data: 'cancel'})
            });
            clientEcosystem_Event.fire();
        }
});