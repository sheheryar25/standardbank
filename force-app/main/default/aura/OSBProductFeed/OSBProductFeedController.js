({
    handleOnClickBackButton : function(component, event, helper) {
        var event = component.getEvent("onBackButtonEvent");
        let product = component.get("v.product.RecordType.DeveloperName")
        event.setParams({
            "currentSection" : product
        });
        event.fire()
    },
});