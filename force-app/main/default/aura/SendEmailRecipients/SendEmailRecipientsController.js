({
	onInit : function(component, event, helper) {
		var recipients = component.get("v.recipients");
		var addUserAddress = component.get("v.addUserAddress")
		var addresses = recipients.trim().length > 0 
			? recipients.split(";")
				.filter(function(email) { return email.length > 0; })
				.map(function(email) { return { email: email }; })
			: [];
		component.set("v.addresses", addresses);
		//
		// Adding curent user to recipients if needed
		//
		if (addUserAddress) {
			var action = component.get("c.getUserAddress");
			action.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === 'SUCCESS') {
					var addresses = component.get("v.addresses");
					addresses.push(response.getReturnValue());
					component.set("v.addresses", addresses);
				}
				else {
					console.log('Error while getting current user');
				}
			});
			$A.enqueueAction(action);
		}
	},

	onDestroy : function(component, event, helper) {
		var subscription = component.get("v.suggestionsSubscription");
		if (subscription) {
			subscription.dispose();
		}
	},

	onRxLoaded : function(component, event, helper) {
		helper.initSuggestions(component);
	},

	onInput : function(component, event, helper) {
		var subject = component.get("v.searchSubject");
		if (subject) {
			var value = event.target.value;
			subject.onNext(value.trim());
		}
	},

	onKeydown : function(component, event, helper) {
		// ENTER
		if (event.keyCode === 13) {
			helper.addEmail(component);
		}
		// TAB
		if (event.keyCode === 9) {
			helper.addEmail(component);
		}
		// UP
		else if (event.keyCode === 38) {
			event.preventDefault();
		}
		// DOWN
		else if (event.keyCode === 40) {
			event.preventDefault();
		}
		// ESCAPE
		else if (event.keyCode === 27) {
			var subject = component.get("v.searchSubject");
			subject.onNext("");
		}
	},

	onFocus : function(component, event, helper) {
		var container = component.find("pill-container");
		$A.util.addClass(container, 'slds-has-focus');
	},

	onBlur : function(component, event, helper) {
		var container = component.find("pill-container");
		$A.util.removeClass(container, 'slds-has-focus');
		var subject = component.get("v.searchSubject");
		subject.onNext("");
	},

	onFocusContainer : function(component, event, helper) {
		var element = component.find("search").getElement();
		element.focus();
	},

	onSuggestionListClick : function(component, event, helper) {
		var element = event.target;
		for (var index = 0; index < 4; index++) {
			if (element.dataset.index) {
				break;
			}
			element = element.parentNode;
		}
		var suggestionsIndex = element.dataset.index;
		helper.addRecipient(component, suggestionsIndex);
	},

	onDeleteRecipient: function(component, event, helper) {
		var index = event.getParam("index");
		var addresses = component.get("v.addresses");
		addresses.splice(index, 1);
		component.set("v.addresses", addresses);
	}
})