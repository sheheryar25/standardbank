({
	init : function(component) {
        var action = component.get("c.getOSBDocumentURL");
        action.setParams({
            "docName": component.get("v.documentDeveloperName")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resourceURL = String(window.location.origin) + response.getReturnValue();
                component.set("v.resourceURL", resourceURL);
            }
        });
        $A.enqueueAction(action);
	}
})