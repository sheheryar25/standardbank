({
	onClick : function(component, event, helper) {
		var event = $A.get("e.force:navigateToSObject");
		var data = component.get("v.data");
		event.setParams({ recordId: data.item.recordId });
		event.fire();
	}
})