({
     goToRevSecondLvl : function (component, event, helper){
         helper.forceNavigateToComponent('CI_RevenueSecondLevel',{'recordId' : component.get("v.recordId")});
     },

     navigateToPipelineDrillDown : function(component, event, helper){
             helper.forceNavigateToComponent('CI_CYPipelineDrilldown', {'recordId': component.get("v.recordId")});
    },

    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

})