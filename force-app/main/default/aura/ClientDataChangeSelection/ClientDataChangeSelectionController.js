/**
 * Created by tsobota on 17.07.2018.
 */
({
    proceed : function(component, event, helper) {
        helper.proceed(component, helper);
    },
    doInit : function(component, event, helper) {
        helper.checkArchivedOrPBBClients(component, helper);
        component.set('v.checkedOption', 'c:CR_Container');
    },
    cancel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    valueChanged : function(component) {
        var options = component.find("options");
                var value = '';
                options.forEach( function (element, index, array) {
                    if(element.get('v.checked')){
                     component.set('v.checkedOption',element.get('v.value'));
                }
        });
        console.log(component.get('v.checkedOption'));
    }
})