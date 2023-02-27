({
	initSuggestions : function(component) {
		var subject = new Rx.BehaviorSubject("");
		component.searchSubject = subject;
		var focusSubject = new Rx.BehaviorSubject(true);
		component.focusSubject = focusSubject;
		var that = this;

		var searchEcosystems = $A.getCallback(function(observer, search) {
			if (component.isValid()) {
				if (search.length > 0) {
					var action = component.get("c.searchEcosystems");
					action.setParams({
						"groupNumber": search,
						"accountId": component.get("v.recordId")
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
				searchEcosystems(observer, search);
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
				var lookup = component.find("ecosystem-lookup");
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

	setEcosystem : function(component, suggestions, index) {
		if (index < suggestions.length) {
			this.setOnlyEcosystem(component, suggestions[index]);
		}
		else {
			component.set("v.newEcosystem", true);
		}
	},

	setOnlyEcosystem : function(component, ecosystem) {
		component.set("v.ecosystem", ecosystem);
		component.searchSubject.onNext("");
		if (component.get("v.type") !== undefined) {
			component.set("v.enableSave", true);
		}
	},

	promiseCreateEcosystemEntity : function(component) {
		return new Promise(function(resolve, reject) {
			let ecosystem = component.get("v.ecosystem");
			let recordId = component.get("v.recordId");
			let type = component.get("v.type");
			let prh = component.get('v.account').Primary_Relationship_Holder__c;
			let entityName = component.get('v.account').Name;
			var createEcosystemEntity = component.get("c.createEcosystemEntity");
			createEcosystemEntity.setParams({
				"ecosystemId": ecosystem.Id,
				"accountId": recordId,
				"type": type,
				"prh":prh,
				"entityName":entityName
			});
			createEcosystemEntity.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					var result = response.getReturnValue();
					resolve(result);
				}
				else {
					reject(state);
				}
			});
			$A.enqueueAction(createEcosystemEntity);
		});
	},

	promiseGetEcosystem : function(component) {
		return new Promise(function(resolve, reject) {
			var getUnbankedClients = component.get("c.getUnbankedClients");
			getUnbankedClients.setParam("groupNumber", component.get("v.groupNumber"));
			getUnbankedClients.setCallback(this, function(response)  {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					var result = response.getReturnValue();
					resolve(result);
				}
				else {
					reject(state);
				}
			});
			$A.enqueueAction(getUnbankedClients);
		});
	},
	/**this function will create a promise object
	 * @param componentP is the component we are updating
	 * @param action_nameP is the name of the action we are calling from server
	 * @param paramsP is parameters if available
	 */
	createPromise: function( componentP, action_nameP, paramsP ){

		//create new promise
		return new Promise( function( resolve, reject ){

			let action = componentP.get( action_nameP );

			//check if parameters are being passed
			if( paramsP )
				action.setParams( paramsP );

			//set the action callback
			action.setCallback( this, function( response ){

				//check if we have success state
				if( response.getState() === "SUCCESS" )
					resolve( response.getReturnValue() );
				else
					reject( response.getError() );

			});

			$A.enqueueAction( action );             //enqueue the action

		});

	},
	getClientData: function (componentP) {

		let action_params = { recordId:componentP.get( "v.recordId" )};
		//create promise and process the results
		this.createPromise( componentP ,'c.getClientData',action_params).then(

			//process success
			$A.getCallback( function( result ){
				componentP.set( "v.account", result );
			}),

			$A.getCallback(function(error){

			})
		);
	}
})