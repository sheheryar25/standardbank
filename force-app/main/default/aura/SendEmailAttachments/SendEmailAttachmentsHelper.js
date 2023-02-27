({
	validateAttachments : function(component, attachments) {
		var size = attachments
			.map(function(a) { return a.size; })
			.reduce(function(a, b) { return a + b; }, 0);
		if (size > 1048576) {
			component.set("v.errorAttachments", true);
		}
		else {
			component.set("v.errorAttachments", false);
		}
	}
})