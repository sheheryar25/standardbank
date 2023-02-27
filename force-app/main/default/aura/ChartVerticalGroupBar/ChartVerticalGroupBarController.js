({
	onInit : function(component, event, helper) {
		component.set("v.isInitialized", true);
	},

	onScriptLoaded : function(component, event, helper) {
		component.set("v.isScriptLoaded", true);
	}
})