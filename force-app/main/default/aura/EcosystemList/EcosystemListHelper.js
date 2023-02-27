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
		var element = event.currentTarget;
		for (var index = 0; index < 6; index++) {
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

	init : function(component) {
		component.set("v.isWaiting", true);
		var that = this;
		
		UTL.promise(component.get("c.getEcosystems"), {"accountId": component.get("v.recordId")})
			.then(
				$A.getCallback(function(result) {
					var ecosystemEntities = result;
					component.set("v.oldEcosystemEntities", that.clone(ecosystemEntities));
					component.set("v.ecosystemEntities", ecosystemEntities);
					component.set("v.isWaiting", false);
				}),
				$A.getCallback(function(error) {
					console.log("Failed with error: " + UTL.getErrorMessage(error));
					component.set("v.isWaiting", false);
				})
			);
	},

	isUnbanked : function(element) {
		return element.cif == null || element.cif.trim().length == 0;
	},

	isBanked : function(element) {
		return !this.isUnbanked(element);
	},

	setEnableSave : function(component) {
		var oldEcosystemEntities = component.get("v.oldEcosystemEntities");
		var ecosystemEntities = component.get("v.ecosystemEntities");

		var changes = oldEcosystemEntities.map(function(element, index) {
			return element.elementType !== ecosystemEntities[index].elementType;
		});
		var enableSave = changes.reduce(function(acc, element) {
			return acc || element;
		}, false);

		component.set("v.enableSave", enableSave);
	},

	find : function(component, name, index) {
		var search = component.find(name);
		if (Array.isArray(search)) {
			return search[index];
		}
		else {
			return search;
		}
	}

})