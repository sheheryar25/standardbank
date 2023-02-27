({
    getCustomSettings : function(component){
        var querySettings = component.get("v.querySettings");
        var getCustomSettings = component.get("c.getCustomSettingsAction");
        if(querySettings.filteringOnIBC != null){
        getCustomSettings.setParams({
            "querySettings" : querySettings,
        });

        getCustomSettings.setCallback(this, function(response){
             var state = response.getState();
            var result = response.getReturnValue();
            if(state === "SUCCESS"){
                component.set('v.targetURL', result.redirectComponent);
                component.set('v.title', result.title);
            }
        });
        $A.enqueueAction(getCustomSettings);
        }
    },
})