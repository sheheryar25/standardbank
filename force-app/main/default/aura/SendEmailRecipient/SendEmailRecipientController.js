({
	onDelete : function(component, event, helper) {
		var index = component.get("v.index");
		var deleteEvent = component.getEvent("deleteRecipient");
		deleteEvent.setParams({"index": index});
		deleteEvent.fire();
	}
})