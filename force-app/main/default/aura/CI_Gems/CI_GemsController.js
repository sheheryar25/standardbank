({
    doInit: function (component, event, helper) {
        var gemService = component.find("gemService");

        gemService.getGems(component.get("v.recordId"), $A.getCallback(function (error, response) {
            if (!error) {
                var gems = response;
                
                //If we're in the "notification" context then remove gems that have been dismissed
                if (component.get("v.context") == "notification")
                    gems = gems.filter(gem => !gem.Dismissed__c);

                if (gems.length == 0){
                    $A.util.removeClass(component.find("status_msg"), 'slds-hide');
                    component.set("v.statusMessage", "No gems right now");
                }

                component.set("v.gems", gems);

            } else
                component.set("v.error", error);
        }));
    },
    handleGemDismissed: function (component, event, helper) {
        var dismissedGemData = event.getParam("data");
        //Get gems that are not the one being dismissed
        var gems = component.get("v.gems").filter(gem => gem.Id != dismissedGemData.gemId);
        component.set("v.gems", gems);
    },
    handleGemDeleted: function (component, event, helper) {
        var deletedGemData = event.getParam("data");
        //Get gems that are not the one being dismissed
        var gems = component.get("v.gems").filter(gem => gem.Id != deletedGemData.gemId);
        component.set("v.gems", gems);
    }
})