/**
 * Created by tsobota on 17.07.2018.
 */
({
    proceed : function(component, helper) {
        var options = component.find("options");
        var value = '';
        options.forEach( function (element, index, array) {
                                 if(element.get('v.checked')){
                                     value = element.get('v.value');
                                 }
                             });
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : value,
            componentAttributes: {
                recordId : component.get("v.recordId"),
            }
        });
        evt.fire();
    },
    checkArchivedOrPBBClients : function (component, helper) {
        var action = component.get('c.checkArchivedOrPBBClients');
        var recordId = component.get('v.recordId');
        action.setParams({'accountId' : recordId});
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                var result = response.getReturnValue();
                component.set("v.hasArchivedOrPBBClients", result);
            }
            else if (state === 'ERROR') {
                console.error(response.getError());
             }
             component.set('v.isLoading', false);
        });
        $A.enqueueAction(action);
    }
})