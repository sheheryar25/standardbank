({
    navigateToRevenueDrillDown : function(component, event, helper){
        helper.forceNavigateToComponent('CI_RevenueDrillDown', {'recordId': component.get("v.recordId")});
    }
})