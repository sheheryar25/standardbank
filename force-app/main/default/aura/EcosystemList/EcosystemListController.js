({
	doInit : function(component, event, helper) {
		var accountId = component.get("v.recordId");
		Promise.all([
				UTL.promise(component.get("c.getAccount"), {"accountId" : accountId}),
				UTL.promise(component.get("c.getCurrentUserId")),
				UTL.promise(component.get("c.isOwnerManager"), {"accountId" : accountId})
			])
			.then(
				$A.getCallback(function(result) {
					var account = result[0];
					var userId = result[1];
					var isManager = result[2];

					var isInClientServiceTeam = false;
					if (account.hasOwnProperty('Custom_Client_Teams__r')) {
						isInClientServiceTeam = account.Custom_Client_Teams__r.reduce(function(acc, element) {
							return acc || element.Team_Member__c === userId;
						}, false);
					}

					if (account.OwnerId === userId || isInClientServiceTeam || isManager) {
						helper.init(component);
					}
					else {
						component.set("v.isPermitted", false);
						component.set("v.isWaiting", false);
					}
				}),
				$A.getCallback(function(error) {
					console.log("Failed with error: " + UTL.getErrorMessage(error));
					component.set("v.isPermitted", false);
					component.set("v.isWaiting", false);
				})
			)
		helper.init(component);
	},

	onAllChange : function(component, event, helper) {
		var ecosystemEntities = component.get("v.ecosystemEntities");
		ecosystemEntities.forEach(function(element) {
			element.selected = event.target.checked;
		});
		component.set("v.ecosystemEntities", ecosystemEntities);
		component.set("v.enableDelete", event.target.checked);
		component.set("v.allSelected", event.target.checked);
	},

	onItemChange : function(component, event, helper) {
		var elementIndex = helper.getIndex(event);
		var ecosystemEntities = component.get("v.ecosystemEntities");
		ecosystemEntities[elementIndex].selected = event.target.checked;
		var enableDelete = ecosystemEntities.reduce(function(acc, value) {
			return acc || value.selected;
		}, false);
		var allSelected = ecosystemEntities.reduce(function(acc, value) {
			return acc && value.selected;
		}, true);
		component.set("v.ecosystemEntities", ecosystemEntities);
		component.set("v.enableDelete", enableDelete);
		component.set("v.allSelected", allSelected);
	},

	onDelete : function(component, event, helper) {
		component.set("v.confirmDelete", true);
	},

	onDeleteConfirm : function(component, event, helper) {
		component.set("v.confirmDelete", false);
		component.set("v.isWaiting", true);
		var ecosystemEntities = component.get("v.ecosystemEntities");
		var entities = ecosystemEntities
			.filter(function(element) {
				return element.selected === true;
			})
			.map(function(element) {
				return element.entity;
			});

		UTL.promise(component.get("c.deleteEntities"), {"entities": entities})
			.then(
				$A.getCallback(function(result) {
					var newEcosystemEntities = ecosystemEntities.filter(function(element) {
						return element.selected !== true;
					});
					component.set("v.ecosystemEntities", newEcosystemEntities);
					component.set("v.isWaiting", false);
					component.set("v.enableDelete", false);
					component.set("v.allSelected", false);

					var event = $A.get("e.c:ecosystemEntityChange");
					event.fire();
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
				})
			);

	},

	onDeleteClose : function(component, event, helper) {
		component.set("v.confirmDelete", false);
	},

	onNew : function(component, event, helper) {
		component.set("v.newEntity", true);
	},

	onNewCancel : function(component, event, helper) {
		component.set("v.newEntity", false);
	},

	onCreated : function(component, event, helper) {
		var record = event.getParam("record");

		var event = $A.get("e.c:ecosystemEntityChange");
		event.setParams({"type": record.Entity_Type__c});
		event.fire();
	},

	onEntityChange : function(component, event, helper) {
		helper.init(component);
	},

	onEcosystemClick : function(component, event, helper) {
		var elementIndex = helper.getIndex(event);
		var ecosystemEntities = component.get("v.ecosystemEntities");
		var navigate = $A.get("e.force:navigateToComponent");
		if (navigate) {
			navigate.setParams({
				"componentDef": "c:EcosystemTab",
				"componentAttributes": {
					"groupNumber": ecosystemEntities[elementIndex].groupNo
				}
			});
			navigate.fire();
		}
	},

	onEditType : function(component, event, helper) {
		var index = helper.getIndex(event);
		$A.util.removeClass(helper.find(component, "popup-element-type", index), "slds-hide");
		setTimeout($A.getCallback(function() {
			helper.find(component, "input-element-type", index).getElement().focus();
		}));
	},

	onBlurType : function(component, event, helper) {
		var index = helper.getIndex(event);
		var value = event.currentTarget.value;

		var ecosystemEntities = component.get("v.ecosystemEntities");
		ecosystemEntities[index].elementType = value;
		component.set("v.ecosystemEntities", ecosystemEntities);
		$A.util.addClass(helper.find(component, "popup-element-type", index), "slds-hide");
		var cellElementType = helper.find(component, "cell-element-type", index);
		if (value != component.get("v.oldEcosystemEntities")[index].elementType) {
			$A.util.addClass(cellElementType, "slds-is-edited");
			helper.setEnableSave(component);
		}
		else {
			$A.util.removeClass(cellElementType, "slds-is-edited");
			helper.setEnableSave(component);
		}
	},

	onKeydownType : function(component, event, helper) {
		var index = helper.getIndex(event);
		if (event.keyCode === 13) {
			helper.find(component, "input-element-type", index).getElement().blur();
		}
	},

	onSave : function(component, event, helper) {
		var oldEcosystemEntities = component.get("v.oldEcosystemEntities"); 
		var ecosystemEntities = component.get("v.ecosystemEntities");
		var forUpdate = helper.diff(oldEcosystemEntities, ecosystemEntities);
		var entities = forUpdate.map(function(element) { 
			var entity = helper.clone(element.entity);
			entity.Entity_Type__c = element.elementType;
			return entity;
		});
		component.set("v.isWaiting", true);
		UTL.promise(component.get("c.upsertEntities"), {"entities": entities})
			.then(
				$A.getCallback(function(result) {
					var ecosystemEntities = result;
					component.set("v.isWaiting", false);
					component.set("v.enableSave", false);
					var cellElementType = component.find("cell-element-type");
					$A.util.removeClass(cellElementType, "slds-is-edited");

					var event = $A.get("e.c:ecosystemEntityChange");
					event.fire();
				}),
				$A.getCallback(function(error) {
					console.log("Failed with error: " + error);
					component.set("v.isWaiting", false);
				})
			);
	}
})