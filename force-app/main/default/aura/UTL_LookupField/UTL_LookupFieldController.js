({
	doInit: function(component, event, helper){
		helper.doInit(component);
	},

	handleValueChange : function(component, event, helper) {
	    helper.doInit(component);
	    const onchangeAction = component.get("v.onchange");
	    if (onchangeAction) {
	        onchangeAction.run();
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
				helper.setRecord(component, suggestions, index);
			}
		}
		// TAB
		if (event.keyCode === 9) {
			var suggestions = component.get("v.suggestions");
			var index = component.get("v.index");
			if (index >= 0) {
				helper.setRecord(component, suggestions, index);
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

	onRxLoaded : function(component, event, helper) {
		helper.initSuggestions(component);
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
		helper.setRecord(component, suggestions, index);
	},

	onSuggestionListDown : function(component, event, helper) {
		event.preventDefault();
	},

	onRemove : function(component, event, helper) {
		component.set("v.assignTo", null);
		component.set("v.parentFieldValue", null);
		setTimeout($A.getCallback(function() {
			var input = component.find("input-name").getElement();
    		input.focus();
			input.setAttribute("autocomplete", "off");
			var lookup = component.find("lookup-container");
			$A.util.addClass(lookup, "slds-has-input-focus");
		}));
	}	
})