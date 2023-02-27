({
	navigateToRecord : function(component) {
		var objectId = component.get("v.objectId");
		var navigateToSObject = $A.get("e.force:navigateToSObject");
		if (navigateToSObject) {
			navigateToSObject.setParams({
				recordId: objectId
			});
			navigateToSObject.fire();
		}
	},

	showToast : function(title, message) {
		var showToast = $A.get("e.force:showToast");
		if (showToast) {
			showToast.setParams({
				title: title,
				message: message,
				type: "error"
			});
			showToast.fire();
		}
	},

	sendEmail : function(component, helper) {
		var orgWideEmailAddressId = component.get("v.orgWideEmailAddressId");
		var toAddresses = component.get("v.toAddresses");
		var ccAddresses = component.get("v.ccAddresses");
		var bccAddresses = component.get("v.bccAddresses");
		var subject = component.get("v.subject");
		var objectId = component.get("v.objectId");
		var templateId = component.get("v.templateId");
		var attachments = component.get("v.attachments");
		component.set("v.isSending", true);

		//
		// Read files
		//
		var readFile$ = function(attachment) {
			return Rx.Observable.create(function(observer) {
				var reader = new FileReader();
				reader.onload = $A.getCallback(function(e) {
					observer.onNext({
						attachment: attachment, 
						result: e.target.result 
					});
					observer.onCompleted();
				});
				reader.onerror = $A.getCallback(function() {
					observer.onError();
				});
				reader.readAsDataURL(attachment);
			});
		}
		var readFile$s = attachments.map(readFile$);
		var readFiles$ = Rx.Observable.merge(readFile$s);
		var subscription = readFiles$.subscribe(
			//
			// When file is read
			//
			function(event) {
				var base64Mark = "base64,";
				var base64Start = event.result.indexOf(base64Mark) + base64Mark.length;
				event.attachment.body = event.result.substring(base64Start);
			},
			//
			// On error
			//
			function() {
				if (component.isValid()) {
					component.set("v.isSending", false);
					helper.showToast("Sending has failed", "There was a problem with reading attachments");
				}
			},
			//
			// On completed
			//
			function() {
				//
				// Send email
				//
				var addressEmail = function(address) {
					return address.email;
				};

				var action = component.get("c.sendEmail");
				action.setParams({
					orgWideEmailAddressId: orgWideEmailAddressId,
					toAddresses: toAddresses.map(addressEmail),
					ccAddresses: ccAddresses.map(addressEmail),
					bccAddresses: bccAddresses.map(addressEmail),
					subject: subject,
					objectId: objectId,
					templateId: templateId,
					fileNames: attachments.map(function(attachment) { return attachment.name; }),
					contentTypes: attachments.map(function(attachment) { return attachment.type; }),
					bodies: attachments.map(function(attachment) { return attachment.body; }),
				});
				action.setCallback(this, function(resp) {
					if (component.isValid()) {
						component.set("v.isSending", false);
						if (resp.getState() === 'SUCCESS') {
							helper.navigateToRecord(component);
						}
						else {
							component.set("v.isSending", false);

							helper.showToast(
								"Sending has failed",
								"There was a problem with sending an email"
							);
						}
					}
				});
				$A.enqueueAction(action);
			}
		);
		component.set("v.filesSubscription", subscription);
	},

	validateForm : function(component, helper) {
		var result = true;
		//
		// At least To, Cc or Bcc address shoud be present
		//
		var toAddresses = component.get("v.toAddresses");
		var ccAddresses = component.get("v.ccAddresses");
		var bccAddresses = component.get("v.bccAddresses");
		if (toAddresses.length === 0 && ccAddresses.length === 0 && bccAddresses.length === 0) {
			result = false;
		}
		//
		// Subject
		//
		var subject = component.get("v.subject");
		if (subject.trim().length === 0) {
			component.set("v.errorSubject", true);
			result = false;
		}
		else {
			component.set("v.errorSubject", false);
		}
		//
		// Attachments
		//
		var attachments = component.get("v.attachments");
		var size = attachments
			.map(function(a) { return a.size; })
			.reduce(function(a, b) { return a + b; }, 0);
		if (size > 1048576) {
			result = false;
		}

		if (result === false) {
			helper.showToast("Validation error", "Check that you don't have any errors and at least one recipient")
		}
		return result;
	}
})