({
	onScriptLoaded : function(component, event, helper) {
		svg4everybody();
	},

	onDrop : function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
	},

	onDragOver : function(component, event, helper) {
		event.dataTransfer.dropEffect = "none";
		event.stopPropagation();
		event.preventDefault();
	},

	onSend : function(component, event, helper) {
		if (helper.validateForm(component, helper)) {
			helper.sendEmail(component, helper);
		}
	},

	onCancel : function(component, event, helper) {
		helper.navigateToRecord(component);
	},

	onSubject : function(component, event, helper) {
		var subject = event.getParam("subject");
		component.set("v.subject", subject);
	},

	onDestroy : function(component, event, helper) {
		var subscription = component.get("v.filesSubscription");
		if (subscription) {
			subscription.dispose();
		}
	}
})