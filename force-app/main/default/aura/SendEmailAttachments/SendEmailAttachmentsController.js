({
	onDrop : function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
		var files = event.dataTransfer.files;
		var attachments = component.get("v.attachments");
		for (var i = 0; i < files.length; i++) {
			attachments.push(files[i]);
		}
		component.set("v.attachments", attachments);
		helper.validateAttachments(component, attachments);
	},

	onDragOver : function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	},

	onDeleteAttachment : function(component, event, helper) {
		var index = event.getParam("index");
		var attachments = component.get("v.attachments");
		attachments.splice(index, 1);
		component.set("v.attachments", attachments);
		helper.validateAttachments(component, attachments);
	},

	onChangeFileInput : function(component, event, helper) {
		var files = event.target.files;
		var attachments = component.get("v.attachments");
		for (var i = 0; i < files.length; i++) {
			attachments.push(files[i]);
		}
		component.set("v.attachments", attachments);
		helper.validateAttachments(component, attachments);
	},

	onClick : function(component, event, helper) {
		var element = component.find("file-upload-input").getElement();
		element.click();
	}
})