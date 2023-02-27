({
	init : function(component) {
        var action = component.get("c.getOSBDocumentURL");
        action.setParams({
            "docName": "Code_Of_Conduct"
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