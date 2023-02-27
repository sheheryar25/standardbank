({
	doInit : function(component, event, helper) {
		helper.promiseGetUnbankedClients(component)
			.then(
				$A.getCallback(function(ecosystem) {
					helper.ecosystemDefault(ecosystem);
					var type = component.get("v.type");
					var fieldName = component.get("v.fieldName");
					var knownBanked = 0;
					var knownUnbanked = 0;
					if (ecosystem.Ecosystem_Entities__r) {
						knownBanked = ecosystem.Ecosystem_Entities__r
							.filter(function(e) { return e.Entity_Type__c === type; })
							.filter(function(e) { return helper.isBanked(e); }).length;
						knownUnbanked = ecosystem.Ecosystem_Entities__r
							.filter(function(e) { return e.Entity_Type__c === type; })
							.filter(function(e) { return helper.isUnbanked(e); }).length;
					}
					var unknownUnbanked = parseInt(ecosystem['Unknown_Unbanked_' + fieldName + '__c']);
					var total = knownBanked + knownUnbanked + unknownUnbanked;
					component.set("v.ecosystem", ecosystem);
					component.set("v.knownBanked", knownBanked);
					component.set("v.knownUnbanked", knownUnbanked);
					component.set("v.unknownUnbanked", unknownUnbanked);
					component.set("v.total", isNaN(total) ? 0 : total);
					component.set("v.oldUnknownUnbanked", unknownUnbanked);
					component.set("v.isWaiting", false);
				}),
				$A.getCallback(function(error) {
					console.log("Failed with error: " + error);
					conponent.set("v.isWaiting", false);
				})
			);
	},

	onEditUnknown : function(component, event, helper) {
		$A.util.removeClass(component.find("popup-unknown-unbanked"), "slds-hide");
		setTimeout($A.getCallback(function() {
			component.find("input-unknown-unbanked").getElement().focus();
		}));
	},

	onBlurUnknown : function(component, event, helper) {
		var value = event.currentTarget.value;
		var ecosystem = component.get("v.ecosystem");
		var fieldName = component.get("v.fieldName");
		ecosystem["Unknown_Unbanked_" + fieldName + "__c"] = value;
		component.set("v.ecosystem", ecosystem);
		component.set("v.unknownUnbanked", value);
		$A.util.addClass(component.find("popup-unknown-unbanked"), "slds-hide");
		var cellUnknownUnbanked = component.find("cell-unknown-unbanked");
		if (value != component.get("v.oldUnknownUnbanked")) {
			$A.util.addClass(cellUnknownUnbanked, "slds-is-edited");
			component.set("v.enabledSave", true);
		}
		else {
			$A.util.removeClass(cellUnknownUnbanked, "slds-is-edited");
			component.set("v.enabledSave", false);
		}
	},

	onKeydownUnknown : function(component, event, helper) {
		if (event.keyCode === 13) {
			component.find("input-unknown-unbanked").getElement().blur();
		}
	},

	btnSave : function(component, event, helper) {
		component.set("v.isWaiting", true);
		var ecosystem = component.get("v.ecosystem");
		helper.promiseUpsertEcosystem(component, ecosystem)
			.then($A.getCallback(function() { return helper.promiseGetUnbankedClients(component); }))
			.then(
				$A.getCallback(function(ecosystem) {
					helper.ecosystemDefault(ecosystem);
					var type = component.get("v.type");
					var fieldName = component.get("v.fieldName");
					var knownBanked = ecosystem.Ecosystem_Entities__r
						.filter(function(e) { return e.Entity_Type__c === type; })
						.filter(function(e) { return helper.isBanked(e); }).length;
					var knownUnbanked = ecosystem.Ecosystem_Entities__r
						.filter(function(e) { return e.Entity_Type__c === type; })
						.filter(function(e) { return helper.isUnbanked(e); }).length;
					var unknownUnbanked = parseInt(ecosystem['Unknown_Unbanked_' + fieldName + '__c']);
					var total = knownBanked + knownUnbanked + unknownUnbanked;
					component.set("v.ecosystem", ecosystem);
					component.set("v.knownBanked", knownBanked);
					component.set("v.knownUnbanked", knownUnbanked);
					component.set("v.unknownUnbanked", unknownUnbanked);
					component.set("v.total", total);
					component.set("v.oldUnknownUnbanked", unknownUnbanked);
					component.set("v.isWaiting", false);
					component.set("v.enabledSave", false);

					var cellUnknownUnbanked = component.find("cell-unknown-unbanked");
					$A.util.removeClass(cellUnknownUnbanked, "slds-is-edited");

					var event = $A.get('e.c:ecosystemPenetrationChange');
					event.setParams({"type": component.get("v.type")});
					event.fire();

					helper.showToast("Saving is complete", "Unbanked clients are updated");

				}),
				$A.getCallback(function(state) {
					console.log("Failed with state: " + state);
					component.set("v.isWaiting", false);
				})
			);
	},

	doEntityChange : function(component, event, helper) {
		if (event.getParam("type") === component.get("v.type")) {
			component.set("v.isWaiting", true);
			helper.promiseGetUnbankedClients(component)
				.then(
					$A.getCallback(function(ecosystem) {
						helper.ecosystemDefault(ecosystem);
						var type = component.get("v.type");
						var knownBanked = ecosystem.Ecosystem_Entities__r
							.filter(function(e) { return e.Entity_Type__c === type; })
							.filter(function(e) { return helper.isBanked(e); }).length;
						var knownUnbanked = ecosystem.Ecosystem_Entities__r
							.filter(function(e) { return e.Entity_Type__c === type; })
							.filter(function(e) { return helper.isUnbanked(e); }).length;
						var oldUnknownUnbanked = parseInt(component.get("v.oldUnknownUnbanked"));
						var total = knownBanked + knownUnbanked + oldUnknownUnbanked;
						component.set("v.knownBanked", knownBanked);
						component.set("v.knownUnbanked", knownUnbanked);
						component.set("v.total", total);
						component.set("v.isWaiting", false);
					}),
					$A.getCallback(function(error) {
						console.log("Failed with error: " + error);
						conponent.set("v.isWaiting", false);
					})
				);
		}
	}
})