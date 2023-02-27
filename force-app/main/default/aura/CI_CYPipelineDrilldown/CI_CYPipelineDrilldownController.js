({
    doInit: function (component, event, helper) {
        var revenueService = component.find("revenue_service");
        var clientId = component.get("v.recordId");
        var querySettings = component.get("v.querySettings");

        revenueService.getPortfolioCYPipeline(clientId, querySettings, $A.getCallback(function (error, response) {
            if (!error) {
                helper.buildGridData(component, response);
            } else
                component.set("v.errorMsg", error);
        }));

        helper.setColumns(component);
    },
    showMore: function(component, event, helper){
        var fullGridData = component.get("v.fullGridData");
        var currentGridData = component.get("v.gridData");
        
        component.set("v.gridData", fullGridData.slice(0, currentGridData.length + component.get("v.numOfRecordsPerPage")));

        if(component.get("v.gridData").length == fullGridData.length)
            $A.util.addClass(component.find("show_more"), "slds-hide");
    },
    toogleSection : function (component, event, helper){
        event.currentTarget.parentNode.classList.toggle('slds-is-open');
    },
    redirectToClient : function (component, event, helper){
        event.stopPropagation();
        var navEvt = $A.get("e.force:navigateToSObject");
        if(!navEvt){return;}
        navEvt.setParams({
          "recordId": event.getSource().get("v.name").replace('/',''),
          "slideDevName": "detail"
        });
        navEvt.fire();

    }
})