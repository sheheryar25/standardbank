({
	doInit : function(component, event, helper) {
		var action = component.get("c.renderEmailTemplate");
		action.setParams({ 
			"templateId": component.get("v.templateId"),
			"whatId": component.get("v.objectId")
		});

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				var result = response.getReturnValue();
				//
				// Write iframe document
				//
				var iframe = component.find("preview").getElement();
				var doc = iframe.contentDocument;
				doc.open();
				doc.write(result.body);
				doc.close();
				var event = component.getEvent("emailSubject");
				event.setParams({subject: result.subject});
				event.fire();
			}
			else {
				console.log("Failed with state: " + state);
			}
		});
		$A.enqueueAction(action);
	},

	onLoad : function(component, event, helper) {
		var element = component.find("preview").getElement();
		var height = element.contentDocument.body.scrollHeight + "px";
		var width = element.contentDocument.body.scrollWidth + "px";
		element.height = height;
		element.width = width;
	}
})