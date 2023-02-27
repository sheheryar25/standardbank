({
	initSuggestions : function(component) {
		var subject = new Rx.BehaviorSubject("");
		component.searchSubject = subject;
		var focusSubject = new Rx.BehaviorSubject(true);
		component.focusSubject = focusSubject;
		var that = this;

		var searchAccounts = $A.getCallback(function(observer, search) {
			if (component.isValid()) {
				if (search.length > 0) {
					var action = component.get("c.searchAccountsUnbanked");
					action.setParams({
						name: search,
						ecosystemId: component.get("v.recordId")
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

	getListElement : function(component, index) {
		var list = component.find("suggestion-list-item");
		var result;
		if (Array.isArray(list)) {
			result = list[index];
		}
		else {
			result = list;
		}
		return result;
	},

	setAccount : function(component, suggestions, index) {
		if (index < suggestions.length) {
			this.setOnlyAccount(component, suggestions[index]);
		}
		else {
			component.set("v.newClient", true);
		}
	},

	setOnlyAccount : function(component, account) {
		component.set("v.account", account);
		component.searchSubject.onNext("");
		if (component.get("v.type") !== undefined) {
			component.set("v.enableSave", true);
		}
	},

	promiseCreateEcosystemEntity : function(component) {
		return this.createPromise(component, "c.createEcosystemEntity", {
			"ecosystemId": component.get("v.recordId"),
			"accountId": component.get("v.account").Id,
			"type": component.get("v.type")
		});
	},

	promiseGetEcosystem : function(component) {
		return this.createPromise(component, "c.getUnbankedClients", {
			"groupNumber": component.get("v.groupNumber") 
		});
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

	save : function(component, event, helper) {
		component.set("v.isWaiting", true);
		helper.promiseCreateEcosystemEntity(component)
			.then(
				$A.getCallback(function(result) {
					component.set("v.account", null);
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
})