({
	ecosystemDefault : function(ecosystem) {
		var fields = 
			[ "Known_Unbanked_Partners__c", "Known_Unbanked_Subsidiaries__c", 
		       "Known_Unbanked_Shareholders__c", "Known_Unbanked_Buyers_Suppliers__c",
			   "Known_Unbanked_Clients_Distributors__c", "Known_Unbanked_Employees__c",
			   "Unknown_Unbanked_Partners__c", "Unknown_Unbanked_Subsidiaries__c",
			   "Unknown_Unbanked_Shareholders_Directors__c", "Unknown_Unbanked_Debtors_Creditors__c",
			   "Unknown_Unbanked_Clients_Distributors__c", "Unknown_Unbanked_Employees__c" ];
		fields.forEach(function(field) {
			if (!ecosystem[field]) {
				ecosystem[field] = "0";
			}
		});
	},

	promiseGetUnbankedClients : function(component) {
		return this.createPromise(component, "c.getUnbankedClients", {
			"groupNumber": component.get("v.groupNumber")
		});
	},

	promiseUpsertEcosystem : function(component, ecosystem) {
		return this.createPromise(component, "c.upsertEcosystem", {
			"eco": ecosystem
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
				message: message
			});
			showToast.fire();
		}
	},

	isUnbanked : function(element) {
		if(element.Entity__c==null){
			return true;
		}
		else {
			return element.Entity__r.CIF__c == null || element.Entity__r.CIF__c.trim().length == 0;
		}
	},

	isBanked : function(element) {
		return !this.isUnbanked(element);
	}
})