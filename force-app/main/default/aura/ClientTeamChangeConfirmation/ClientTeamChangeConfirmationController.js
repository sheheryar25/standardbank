/**
 * Created by tsobota on 22.08.2018.
 */
({
    doInit : function (component, event, helper) {
        window.scrollTo(0,0);
        component.set('v.isWaiting', true);
        helper.getAccount(component);
        helper.setColumns(component);
        helper.findChanges(component,helper);
        component.set('v.isWaiting', false);
    }
})