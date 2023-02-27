({
	showToast : function(component,message, type) {
		component.find('notifLib').showToast({
			"variant":type,
			"message": message
		});
	}
})