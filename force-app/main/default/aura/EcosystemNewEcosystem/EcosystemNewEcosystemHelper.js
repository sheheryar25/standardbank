({
	cancel: function (component) {
		if (this.isActionOverride(component)) {
			let navigateToObjectHome = $A.get("e.force:navigateToObjectHome");
			navigateToObjectHome.setParams({
			    scope: "Ecosystem__c"
            });
            navigateToObjectHome.fire();
		}
		else {
			var cancel = component.getEvent("oncancel")
			cancel.fire();
		}
	},

	isActionOverride : function(component) {
		return component.get("v.isActionOverride");
	}
	,
	clickedFromClientPage : function (component) {
		if(!component.get('v.clickedFromClientPage')) {
			component.set("v.ecosystem", {"sobjectType": "Ecosystem__c"});
		}
	},
	clickedFromClientPageEvent : function (component,eventType){
			let clientEcosystem_Event = component.getEvent("ClientEcosystem_Event");
			clientEcosystem_Event.setParams({
				"data": JSON.stringify({event_type: eventType, data: eventType})
			});
			clientEcosystem_Event.fire();

	}
})