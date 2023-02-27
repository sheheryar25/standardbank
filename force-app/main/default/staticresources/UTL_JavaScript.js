window.UTL = (function() {
	return {
		getErrorMessage : function(errors) {
			var message;
			if (errors && errors[0]) {
				if (errors[0].message) {
					message = errors[0].message;
				}
				else if (Object.values(errors[0].fieldErrors).length > 0) {
					message = Object.values(errors[0].fieldErrors)[0][0].message;
				}
				else if (errors[0].pageErrors.length > 0) {
					message = errors[0].pageErrors[0].message;
				}
			}
			if (! message) {
				message = 'Unknown error occured.';
			}
			return message;
		},

		promise : function(apexAction, params) {
			var prom = new Promise(function(resolve, reject) {
				if (params) {
					apexAction.setParams(params);
				}
				apexAction.setCallback(this, function(response) {
					var state = response.getState();
					if (state === "SUCCESS") {
						var result = response.getReturnValue();
						resolve(result);
					}
					else {
						reject(response.getError());
					}
				});
				$A.enqueueAction(apexAction);
			});
			return prom;
		},

		showToast : function(title, message, type, additionalAttributes) {
			var showToast = $A.get("e.force:showToast");
			if (showToast) {
				showToast.setParams({
					title: title,
					message: message
				});
				showToast.setParams(additionalAttributes);
				showToast.fire();
			}
		}
	}
}());