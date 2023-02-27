({
	onInit : function(component, event, helper) {
		setTimeout($A.getCallback(function() {
			var input = component.find("input-group-number").getElement();
    		input.focus();
			input.setAttribute("autocomplete", "off");
			var lookup = component.find("lookup-container");
			$A.util.addClass(lookup, "slds-has-input-focus");
		}));
		helper.getClientData(component);
	},

	onDestroy : function(component, event, helper) {
		var subscription = component.suggestionsSubsription;
		if (subscription) {
			subscription.dispose();
		}
	},

	onInput : function(component, event, helper) {
		var subject = component.searchSubject;
		if (subject) {
			var value = event.target.value;
			subject.onNext(value.trim());
		}
	},

	onBlur : function(component, event, helper) {
		var lookup = component.find("lookup-container");
		$A.util.removeClass(lookup, "slds-has-input-focus");
		var subject = component.focusSubject;
		if (subject) {
			subject.onNext(false);
		}
		$A.util.removeClass(lookup, "slds-has-input-focus");
	},

	onFocus : function(component, event, helper) {
		var lookup = component.find("lookup-container");
		$A.util.addClass(lookup, "slds-has-input-focus");
		var subject = component.focusSubject;
		if (subject) {
			subject.onNext(true);
		}
	},

	onKeydown : function(component, event, helper) {
		// ENTER
		if (event.keyCode === 13) {
			var suggestions = component.get("v.suggestions");
			var index = component.get("v.index");
			if (index >= 0) {
				helper.setEcosystem(component, suggestions, index);
			}
		}
		// TAB
		if (event.keyCode === 9) {
			var suggestions = component.get("v.suggestions");
			var index = component.get("v.index");
			if (index >= 0) {
				helper.setEcosystem(component, suggestions, index);
			}
		}
		// UP
		else if (event.keyCode === 38) {
			event.preventDefault();
			var suggestions = component.get("v.suggestions");
			var index = component.get("v.index");
			if (suggestions !== null) {
				index = index - 1;
				if (index < 0)  {
					index = suggestions.length;
				}
				component.set("v.index", index);
			}
		}
		// DOWN
		else if (event.keyCode === 40) {
			event.preventDefault();
			var suggestions = component.get("v.suggestions");
			var index = component.get("v.index");
			if (suggestions !== null) {
				index = (index + 1) % (suggestions.length + 1);
				component.set("v.index", index);
			}
		}
		// ESCAPE
		else if (event.keyCode === 27) {
			var subject = component.searchSubject;
			subject.onNext("");
		}
	},

	onSuggestionListClick : function(component, event, helper) {
		event.preventDefault();
		var element = event.currentTarget;
		for (var index = 0; index < 4; index++) {
			if (element.dataset.index) {
				break;
			}
			element = element.parentNode;
		}
		var suggestions = component.get("v.suggestions");
		var index = element.dataset.index;
		helper.setEcosystem(component, suggestions, index);
	},

	onSuggestionListDown : function(component, event, helper) {
		event.preventDefault();
	},

	onRemove : function(component, event, helper) {
		component.set("v.ecosystem", null);
		setTimeout($A.getCallback(function() {
			var input = component.find("input-group-number").getElement();
    		input.focus();
			input.setAttribute("autocomplete", "off");
			var lookup = component.find("lookup-container");
			$A.util.addClass(lookup, "slds-has-input-focus");
		}));
		component.set("v.enableSave", false);
	},

	onChange : function(component, event, helper) {
		var type = event.target.value;
		component.set("v.type", type);
		if (component.get("v.ecosystem") !== null) {
			component.set("v.enableSave", true);
		}
	},

	onRxLoaded : function(component, event, helper) {
		helper.initSuggestions(component);
	},

	doneRendering : function(component, event, helper) {
    	var ecosystem = component.get("v.ecosystem");
    	if (ecosystem !== null) {
    		var readonly = component.find("readonly-group-number").getElement();
    		readonly.setAttribute("value", ecosystem.Relationship_Group_Number__c);
    	}
	},

	onCancel : function(component, event, helper) {
		var cancel = component.getEvent("oncancel");
		cancel.fire();
	},

	onSaveAndNew : function(component, event, helper) {
		component.set("v.isWaiting", true);
		helper.promiseCreateEcosystemEntity(component)
			.then(
				$A.getCallback(function(result) {
					component.set("v.ecosystem", null);
					component.set("v.type", undefined);
					component.find("select-type").getElement().selectedIndex = 0;
					component.set("v.isWaiting", false);
					component.set("v.enableSave", false);
					setTimeout($A.getCallback(function() {
						var input = component.find("input-group-number").getElement();
			    		input.focus();
    					input.setAttribute("autocomplete", "off");
						var lookup = component.find("lookup-container");
						$A.util.addClass(lookup, "slds-has-input-focus");
					}));
					var created = component.getEvent("oncreated");
					created.setParam("record", result);
					created.fire();
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
				})

			);
	},

	onSave : function(component, event, helper) {
		component.set("v.isWaiting", true);
		helper.promiseCreateEcosystemEntity(component)
			.then(
				$A.getCallback(function(result) {
					component.set("v.ecosystem", null);
					component.set("v.type", null);
					component.find("select-type").getElement().selectedIndex = 0;
					component.set("v.isWaiting", false);
					component.set("v.enableSave", false);
					var created = component.getEvent("oncreated");
					created.setParam("record", result);
					created.fire();
					var cancel = component.getEvent("oncancel");
					cancel.fire();
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
				})

			);
	},

	onNewEcosystemCancel : function(component, event, helper) {
		component.set("v.newEcosystem", false);
	},

	onNewEcosystemCreated : function(component, event, helper) {
		var ecosystem = event.getParam("record");
		helper.setOnlyEcosystem(component, ecosystem);
	}
})