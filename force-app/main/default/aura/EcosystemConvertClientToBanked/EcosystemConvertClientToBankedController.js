({
	onCancel : function (component, event, helper) {
		var cancel = component.getEvent("oncancel");
		cancel.fire();
	},

	onSave : function (component, event, helper) {
		var onsave = component.getEvent("onsave");
		helper.save(component, helper, onsave);
	}
})