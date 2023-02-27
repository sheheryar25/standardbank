({
	clone : function(obj) {
		var copy = null;
		if (obj !== null) {
			if (typeof obj === 'object') {
				copy = obj.constructor();
				if (Array.isArray(obj)) {
					var that = this;
					copy = obj.map(function(value) { return that.clone(value); });
				}
				else {
					for (var attr in obj) {
						if (obj.hasOwnProperty(attr)) {
							copy[attr] = this.clone(obj[attr]);
						}
					}
				}
			}
			else {
				copy = obj;
			}
		}
		return copy;
	},

	getIndex : function(event) {
		var element = event.target;
		for (var index = 0; index < 3; index++) {
			if (element.dataset.index) {
				break; 
			}
			element = element.parentNode;
		}
		return element.dataset.index;
	},

	diff : function(oldValues, newValues) {
		var result = [];
		var i = 0;
		while (i < Math.min(oldValues.length, newValues.length)) {
			var oldValue = oldValues[i];
			var newValue = newValues[i];
			if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
				result.push(newValue);
			}
			i++;
		}
		while (i < newValues.length) {
			result.push(newValue);
			i++;
		}
		return result;
	},

	promiseUpsertEntities : function(component, entities) {
		return this.createPromise(component, "c.upsertEntities", {
			"entities": entities
		});
	},

	promiseDeleteEntities : function(component, entities) {
		return this.createPromise(component, "c.deleteEntities", {
			"entities": entities
		});
	},

	promiseGetBankedClients : function(component) {
		return this.createPromise(component, "c.getBankedClients", {
			"groupNumber": component.get("v.groupNumber")
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

	showToast : function(title, message) {
		var showToast = $A.get("e.force:showToast");
		if (showToast) {
			showToast.setParams({
				title: title,
				message: message,
			});
			showToast.fire();
		}
	},

	init : function(component) {
		component.set("v.isWaiting", true);
		var type = component.get("v.type");
		var idType = type ? type.replace(/[ /]/, "_") : type;
		component.set("v.idType", idType);
		var that = this;
		
		Promise.all([this.promiseGetBankedClients(component), this.promiseGetEcosystem(component)])
			.then(
				$A.getCallback(function(result) {
					var bankedClients = result[0]
						.filter(function(e) { return that.isUnbanked(e); })
						.filter(function(e) { return e.elementType === component.get("v.type"); });
					component.set("v.oldBankedClients", that.clone(bankedClients));
					component.set("v.bankedClients", bankedClients);
					component.set("v.ecosystem", result[1]);
					component.set("v.isWaiting", false);
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
				})
			);
	},

	isUnbanked : function(element) {
		return element.cif == null || element.cif.trim().length == 0;
	},

	isBanked : function(element) {
		return !this.isUnbanked(element);
	}

})