({
    init: function (component, event, helper) {

        var service = component.find('revenueService');
        var clientId = component.get("v.recordId");
        helper.buildColumns(component);
        service.getRevenueByClientByDivision(clientId, helper.processRevenues(component));
    },
    showMore : function(component, event, helper) {
        helper.showMore(component);
    }

})