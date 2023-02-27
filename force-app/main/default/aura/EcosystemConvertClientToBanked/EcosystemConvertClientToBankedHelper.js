({
	promiseUpdateAccount : function(component) {
		var accountId = component.get("v.accountId");
		var cif =  component.get("v.cif");
		return this.createPromise(component, "c.updateAccount", {
			"accountId": accountId,
			"fieldValue": cif,
			"field": "CIF__c"
		});
	},

	save : function(component, helper, onsave) {
		component.set("v.isWaiting", true);
		helper.promiseUpdateAccount(component)
			.then(
				$A.getCallback(function(result) {
					component.set("v.isWaiting", false);
					onsave.fire();
				}),
				$A.getCallback(function(error) {
				console.log(error);
				alert(error);
					component.set("v.isWaiting", false);
					component.set("v.hasError", true);
					component.set("v.errorMessage", error.message);
				})
			);
	},

	createPromise : function(component, name, params) {
		return new Promise(function(resolve, reject) {
			var action = component.get(name);
			if (params) {
				action.setParams(params);
			}
			action.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					var result = response.getReturnValue();
					resolve(result);
				}
				else {
					reject(response.getError());
				}
			});
			$A.enqueueAction(action);
		});
	},

	showToast : function(title, message) {
		var showToast = $A.get("e.force:showToast");
		if (showToast) {
			showToast.setParams({
				title: title,
				message: message,
			});
			showToast.fire();
		}
	}
})