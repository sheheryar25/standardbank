({
	doInit : function(component, event, helper) {
		Promise.all([
			helper.promiseGetIndividualClientRecordTypeId(component),
			helper.promiseGetPbbDivisionOptions(component),
			helper.promiseGetResponsibleRegionOptions(component)
			])
			.then(
				$A.getCallback(function(result) {
					var account = component.get("v.account");
					account.RecordTypeId = result[0];
					account.Status__c = 'Prospect';
					component.set("v.account", account);
					component.set("v.pbbDivisionOptions", result[1]);
					component.set("v.responsibleRegionOptions", result[2]);
					component.set("v.isLoading", false);
				}),
				$A.getCallback(function(error) {
					component.set("v.hasError", true);
					component.set("v.errorMessage", error.message);
			})
		);
		helper.applyCSS(component);
	},

	/*onDivisionChange : function(component, event, helper) {
		var account = component.get("v.account");
		account.PBB_Division__c = event.target.value;
		component.set("v.account", account);
	},

	onRegionChange : function(component, event, helper) {
		var account = component.get("v.account");
		account.Responsible_Region__c = event.target.value;
		component.set("v.account", account);
		//helper.setEnableSave(component, account);
	},*/

	onCancel : function(component, event, helper) {
		helper.revertCssChange(component);
		var cancel = component.getEvent("oncancel");
		cancel.fire();
	},

	onSave : function(component, event, helper) {
		helper.revertCssChange(component);
		var save = component.getEvent("oncreated");
		save.fire();
	}
})