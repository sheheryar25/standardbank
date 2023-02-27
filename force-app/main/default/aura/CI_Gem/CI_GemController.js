({
    doInit: function (component, event, helper) {
        var gem = component.get("v.gem");

        switch(gem.RecordType.Name){
            case "News Lead":
                helper.newsLeadInit(component);
            default:
                break;
        }
    },
    remove: function (component, event, helper) {
        var gemService = component.find("gemService");
        var gem = component.get("v.gem");

        if (component.get("v.context") == "notification") {
            gemService.dismissGem(gem.Id, $A.getCallback(function (error, response) {
                var saveEvent = component.getEvent("gemDismissedEvent");
                saveEvent.setParams(
                    {
                        data: { gemId: gem.Id }
                    }
                );
                saveEvent.fire();
            }));
        }
        else {
            gemService.deleteGem(gem.Id, $A.getCallback(function (error, response) {
                var saveEvent = component.getEvent("gemDeletedEvent");
                saveEvent.setParams(
                    {
                        data: { gemId: gem.Id }
                    }
                );
                saveEvent.fire();
            }));
        }
    },
    handleClick: function (component, event, helper) {
        var gem = component.get("v.gem");
        
        switch(gem.RecordType.Name){
            case "News Lead":
                helper.handleNewsLeadClick(gem);
            default:
                break;
        }
    }
})