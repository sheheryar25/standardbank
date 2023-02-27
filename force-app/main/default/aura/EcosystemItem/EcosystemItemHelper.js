({
	promiseGetBankedClients : function(component) {
		return this.createPromise(component, "c.getBankedClients", {"groupNumber": component.get("v.groupNumber")});
	},

	promiseGetUnbankedClients : function(component) {
		return this.createPromise(component, "c.getUnbankedClients", {"groupNumber": component.get("v.groupNumber")});
	},

	promiseGetRevenueAndProfitability : function(component) {
		return this.createPromise(component, "c.getProfitability", {
			groupNumber: component.get("v.groupNumber"),
			currencyCode: "ZAR"
		});
	},

	promiseGetDtfDataPipelineByElement : function(component) {
		return this.createPromise(component, "c.getDtfDataPipelineByElement", {
			groupNumber: component.get("v.groupNumber"),
			currencyCode: "ZAR"
		});
	},

	promiseGetDtfDataBankedByElement : function(component) {
		return this.createPromise(component, "c.getDtfDataBankedByElement", {
			groupNumber: component.get("v.groupNumber"),
			currencyCode: "ZAR"
		});
	},

	promiseGetDtfData : function(component) {
		return this.createPromise(component, "c.getDtfData", {
			groupNumber: component.get("v.groupNumber"),
			currencyCode: "ZAR"
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

	formatCurrency : function(amount) {
	    if (isNaN(amount)) { 
	    	amount = 0.00; 
	    }
	 
	    var s = new String(amount);

	    if (s.indexOf(".") < 0) { 
	    	s += ".00"; 
	    }
	 
	    if (s.indexOf(".") == (s.length - 2)) { 
	    	s += "0"; 
	    }
	 
	    var delimiter = ",";
	    var a = s.split(".",2);
	    var d = a[1];
	    var n = a[0];
	    var a = [];
	 
	    while (n.length > 3) {
	        var block = n.substr(n.length - 3);
	        a.unshift(block);
	        n = n.substr(0,n.length - 3);
	    }
	 
	    if (n.length > 0) { 
	    	a.unshift(n); 
	    }
	 
	    n = a.join(delimiter);
	 
	    return s = n + "." + d;
	},

	isUnbanked : function(element) {
		return element.cif == null || element.cif.trim().length == 0;
	},

	isBanked : function(element) {
		return !this.isUnbanked(element);
	}
})