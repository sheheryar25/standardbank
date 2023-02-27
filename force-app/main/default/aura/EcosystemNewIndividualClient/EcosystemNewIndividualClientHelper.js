({
	promiseGetIndividualClientRecordTypeId: function (component) {
		return this.createPromise(component, "c.getIndividualClientRecordTypeId");
	},

	promiseGetPbbDivisionOptions: function (component) {
		return this.createPromise(component, "c.getPbbDivisionOptions");
	},

	promiseGetResponsibleRegionOptions: function (component) {
		return this.createPromise(component, "c.getResponsibleRegionOptions");
	},

	setEnableSave : function(component, account) {
		var enableSave = [account.Name, account.CIF__c, account.Primary_Relationship_Holder__c]
			.map(this.hasValue)
			.reduce(function(acc, value) {
				return acc && value;
			}, true);
		component.set("v.enableSave", enableSave);
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

	applyCSS: function(component) {
		component.set("v.cssStyle", ".forceStyle .viewport .oneHeader.slds-global-header_container {z-index:0} .forceStyle.desktop .viewport{overflow:hidden}");
	},

	revertCssChange: function(component) {
		component.set("v.cssStyle", ".forceStyle .viewport .oneHeader.slds-global-header_container {z-index:5} .forceStyle.desktop .viewport{overflow:visible}");
	}
})