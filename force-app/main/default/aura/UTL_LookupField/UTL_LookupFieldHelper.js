({
	doInit: function(component){
		var value = component.get("v.assignTo");
		if(value){
			var parentFieldValue = component.get("v.parentFieldValue");
			if (!parentFieldValue || parentFieldValue === null || parentFieldValue.length === 0) {
				var getRecord = component.get("c.getRecord");
				getRecord.setParams({
					"recordId": value
				});
				getRecord.setCallback(this, function(response) {
					var state = response.getState();
					if (component.isValid() && state === "SUCCESS") {
						component.set("v.parentFieldValue",  response.getReturnValue().queriedField);
					}
				});
				$A.enqueueAction(getRecord);
			}
		}
		else {
			component.set("v.parentFieldValue",  null);
		}
	},

	initSuggestions : function(component) {
		var subject = new Rx.BehaviorSubject("");
		component.searchSubject = subject;
		var focusSubject = new Rx.BehaviorSubject(true);
		component.focusSubject = focusSubject;
		var that = this;

		var searchAccounts = $A.getCallback(function(observer, search) {
			if (component.isValid()) {
				if (search.length > 0) {
					var action = component.get("c.getSuggestedParents");
					action.setParams({
						name: search,
						sObjectName: component.get("v.sObjectName"),
						fieldName: component.get("v.fieldName"),
						whereClause: component.get("v.whereClause")
					});
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
					observer.onNext(null);
					observer.onCompleted();
				}	
			}
		});

		var getSuggestions$ = function(search) {
			return Rx.Observable.create(function(observer) {
				searchAccounts(observer, search);
			});
		};

		var searching$ = subject
			.map(function(search) { return search.length !== 0; })
			.distinctUntilChanged()
			.share();

		var allSuggestions$ = subject	
			.debounce(100)
			.distinctUntilChanged()
			.flatMapLatest(getSuggestions$)
			.distinctUntilChanged();

		var suggestions$ = searching$
			.flatMapLatest(function(searching) {
				if (searching) {
					return allSuggestions$;
				} else {
					return Rx.Observable.just(null);
				}
			})
			.share();

		var isOpen$ = suggestions$
			.map(function() { return true; })
			.merge(searching$.filter(function(element) { return element === false; }).map(function() { return false; }))
			.combineLatest(focusSubject, function(a, b) { return a && b; })
			.distinctUntilChanged();

		var subscription1 = suggestions$.subscribe(function(suggestions) {
			if (component.isValid()) {
				component.set("v.suggestions", suggestions);
				component.set("v.index", -1);
			}
		});

		var subscription2 = isOpen$.subscribe(function(isOpen) {
			if (component.isValid()) {			
				var lookup = component.find("account-lookup");
				if (isOpen) {
					$A.util.addClass(lookup, "slds-is-open");
				}
				else {
					$A.util.removeClass(lookup, "slds-is-open");
				}
			}
		});

		component.suggestionsSubscription = new Rx.CompositeDisposable(subscription1, subscription2);
	},

	setRecord : function(component, suggestions, index) {
		component.set("v.assignTo", suggestions[index].recordId);
		component.set("v.parentFieldValue", suggestions[index].queriedField);
		component.searchSubject.onNext("");
	}
})