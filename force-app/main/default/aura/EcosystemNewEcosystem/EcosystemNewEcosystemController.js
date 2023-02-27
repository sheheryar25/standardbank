({
	doInit : function(component, event, helper) {
		UTL.promise(component.get("c.getCurrentUserId"))
			.then(
				$A.getCallback(function(result) {
					helper.clickedFromClientPage(component);
					component.set("v.currentUserId", result);
					component.set("v.isWaiting", false);
					component.find("ecosystem-group-number").focus();
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
					component.set("v.hasError", true);
					component.set("v.errorMessage", UTL.getErrorMessage(error));
				})
			);
	},

	onEcosystemChange : function(component, event, helper) {
		var ecosystem = component.get("v.ecosystem");
		var requiredFields = [ecosystem.Relationship_Group_Number__c, ecosystem.Client_Name__c];

		var disableSave = requiredFields
			.map(function(field) {
				if (field) {
					return field.trim().length > 0;
				}
			})
			.reduce(function(prev, curr) {
				return prev || !curr
			}, false);
		component.set("v.disableSave", disableSave);
	},

	onCancel : function(component, event, helper) {

		if(component.get('v.clickedFromClientPage')) {
			helper.clickedFromClientPageEvent(component,'cancel');
		}
		else {
			helper.cancel(component);
		}
	},

	onSave : function(component, event, helper) {
		component.set("v.isWaiting", true);
		var ecosystem = component.get("v.ecosystem");
		UTL.promise(component.get("c.createEcosystem"), {"ecosystem" : ecosystem})
			.then(
				$A.getCallback(function(result) {
					component.set("v.isWaiting", false);
					component.set("v.ecosystem", result);
					var created = component.getEvent("oncreated");
					created.setParam("record", result);
					created.fire();
					if (helper.isActionOverride(component)) {
						var navigate = $A.get("e.force:navigateToSObject");
						navigate.setParams({
							"recordId": result.Id
						});
						navigate.fire();
					}
					else {
						if(component.get('v.clickedFromClientPage')) {
							helper.clickedFromClientPageEvent(component,'reload');
						}
						else {
							helper.cancel(component);
						}
					}
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
					component.set("v.hasError", true);
					component.set("v.errorMessage", UTL.getErrorMessage(error));
				})
			);
	}
})