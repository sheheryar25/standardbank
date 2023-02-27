({
	initSuggestions : function(component) {
		var subject = new Rx.Subject();
		component.set("v.searchSubject", subject);

		var contextSubscribe = $A.getCallback(function(observer, search) {
			if (component.isValid()) {
				if (search.length > 0) {
					var action = component.get("c.getSuggestions");
					action.setParams({filter: search});
					action.setCallback(this, function(response) {
						var state = response.getState();
						if (component.isValid() && state === 'SUCCESS') {
							observer.onNext(response.getReturnValue());
							observer.onCompleted();
						}
						else {
							observer.onCompleted();
						}
					});

					$A.enqueueAction(action, true);
				}
				else {
					observer.onNext([]);
					observer.onCompleted();
				}
			}
		});

		var getSuggestions$ = function(search) {
			return Rx.Observable.create(function(observer) {
				contextSubscribe(observer, search);
			});
		};

		var suggestions$ = subject
			.debounce(250)
			.distinctUntilChanged()
			.flatMapLatest(getSuggestions$)
			.distinctUntilChanged()
			.share();

		var isOpen$ = suggestions$
			.map(function(element) {
				return (element.length > 0);
			})
			.distinctUntilChanged();

		var subscription1 = suggestions$.subscribe(function(suggestions) {
			if (component.isValid()) {
				component.set("v.suggestions", suggestions);
			}
		});

		var subscription2 = isOpen$.subscribe(function(isOpen) {
			if (component.isValid()) {			
				var lookup = component.find("element-control");
				if (isOpen) {
					$A.util.addClass(lookup, "slds-is-open");
				}
				else {
					$A.util.removeClass(lookup, "slds-is-open");
				}
			}
		});
		
		component.set("v.suggestionsSubscription", new Rx.CompositeDisposable(subscription1, subscription2));
	},

	addRecipient : function(component, suggestionIndex) {
		var addresses = component.get("v.addresses");
		var suggestions = component.get("v.suggestions");
		var suggestion = suggestions[suggestionIndex];
		var searchSubject = component.get("v.searchSubject");
		var searchInput = component.find("search").getElement();
		addresses.push(suggestion);
		component.set("v.addresses", addresses);
		searchInput.value = "";
		searchInput.focus();
		searchSubject.onNext("");
	},

	addEmail : function(component) {
		var element = component.find("search").getElement();
		var value = element.value.trim();
		if (value.length > 0) {
			var addresses = component.get("v.addresses");
			addresses.push({email: value});
			component.set("v.addresses", addresses);
		}
		element.value = "";
		var subject = component.get("v.searchSubject");
		subject.onNext("");
	}
})