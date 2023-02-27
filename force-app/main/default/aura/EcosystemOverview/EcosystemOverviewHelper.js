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

	processResults : function(component, results) {
		var that = this;

		var bankedClients = results[0];
		var ecosystem = results[1];
		var revenueAndProfitability = results[2];
		var dtfDataPipelineByElement = results[3];
		var dtfDataBankedByElement = results[4];

		component.set("v.bankedClients", bankedClients);
		component.set("v.ecosystem", ecosystem);
		component.set("v.revenueAndProfitability", revenueAndProfitability);
		component.set("v.dtfDataPipelineByElement", dtfDataPipelineByElement);
		component.set("v.dtfDataBankedByElement", dtfDataBankedByElement);

		var types = component.get("v.types");
		var knownBankedValues = types.map(function(type) {
			var typeBankedClients = bankedClients
				.filter(function(element) { return element.elementType === type; })
				.filter(function(element) { return that.isBanked(element); });
			return typeBankedClients.length;
		});

		var knownUnbankedValues = types.map(function(type) {
			var typeUnbankedClients = bankedClients
				.filter(function(element) { return element.elementType === type; })
				.filter(function(element) { return that.isUnbanked(element); });
			return typeUnbankedClients.length;
		});
		
		var fieldNames = component.get("v.fieldNames");
		var unknownUnbankedValues = fieldNames.map(function(fieldName) {
			var unknownUnbankedField = "Unknown_Unbanked_" + fieldName + "__c";
			var value = ecosystem[unknownUnbankedField];
			return value === null || value === undefined ? 0 : value;
		});

		var verticalValues = knownBankedValues.map(function(a, i) {
			return [a, knownUnbankedValues[i], unknownUnbankedValues[i]];
		});

		component.set("v.verticalValues", verticalValues);

		var knownBankedTotal = knownBankedValues.reduce(function(a, b) { return a + b; }, 0);
		var knownUnbankedTotal = knownUnbankedValues.reduce(function(a, b) { return a + b; }, 0);
		var unknownUnbankedTotal = unknownUnbankedValues.reduce(function(a, b) { return a + b; }, 0);

		var verticalLegends = [
			["KNOWN BANKED", knownBankedTotal], 
			["KNOWN UNBANKED", knownUnbankedTotal], 
			["UNKNOWN UNBANKED", unknownUnbankedTotal]
		];

		component.set("v.verticalLegends", verticalLegends)

		var bankedUnbanked = [knownBankedTotal, knownUnbankedTotal, unknownUnbankedTotal];
		var total = bankedUnbanked.reduce(function(a, b) { return a + b; }, 0);
		var radialValues = bankedUnbanked.map(function(value) { return total === 0 ? value : value / total; });
		var percentages = radialValues.map(function(value) { return "" + Math.round(value * 100) + "%"; });
		var radialLegends = [[bankedUnbanked[0], "Known Banked"], [bankedUnbanked[1], "Known Unbanked"], [bankedUnbanked[2], "Unknown Unbanked"]];
		component.set("v.radialValues", radialValues);
		component.set("v.radialLegends", radialLegends);
		component.set("v.radialCircleText", percentages[0]);

		var barValues = revenueAndProfitability.reduce(function(acc, value) {
			return [
				acc[0] + value.netIncome, 
				acc[1] + value.nonRevenue, 
				acc[2] + value.operationalIncome, 
				acc[3] + value.headlineErnings
			];
		}, [0, 0, 0, 0]);

		var barTooltips = barValues.map(function(value) {
			return that.formatCurrency(value) + " ZAR";
		});

		var roe = revenueAndProfitability.reduce(function(acc, value) { return acc + value.roe; }, 0);
		var count = revenueAndProfitability.reduce(function(acc, value) { return acc + value.count; }, 0);
		if (count !== 0) {
			roe = roe / count;
		}
		revenueAndProfitability.forEach(function(value) {
			value.realRoe = value.count === 0 ? value.roe : value.roe / value.count;
			value.realRoe = value.realRoe.toFixed(2);
		})
		var legendText = "";/*"ROE " + roe.toFixed(2) + "%"*/;
		component.set("v.barValues", barValues);
		component.set("v.barTooltips", barTooltips);
		component.set("v.legendText", legendText);

		component.set("v.knownBanked", bankedUnbanked[0]);
		component.set("v.knownUnbanked", bankedUnbanked[1]);
		component.set("v.unknownUnbanked", bankedUnbanked[2]);
		component.set("v.totalBankedUnbanked", total);

		var dtfDataPipeline = dtfDataPipelineByElement.reduce(function(acc, value) { return acc + value.notionalValue; }, 0);
		var dtfPipeline = that.formatCurrency(dtfDataPipeline) + " ZAR";
		component.set("v.dtfPipeline", dtfPipeline);

		var dtfDataBanked = dtfDataBankedByElement.reduce(function(acc, value) { return acc + value.notionalValue; }, 0);
		var dtfBanked = that.formatCurrency(dtfDataBanked) + " ZAR";
		component.set("v.dtfBanked", dtfBanked);

		component.set("v.netInterestIncome", barValues[0] + " ZAR");
		component.set("v.nonInterestIncome", barValues[1] + " ZAR");
		component.set("V.operatingIncome", barValues[2] + " ZAR");
		component.set("v.headlineEarnings", barValues[3] + " ZAR");
		component.set("v.roe", "");

		var dtfChartValues = dtfDataPipelineByElement.map(function(value, index) {
			return [value.notionalValue, dtfDataBankedByElement[index].notionalValue];
		});

		var dtfChartTooltips = dtfChartValues.map(function(values) {
			return values.map(function(value) {
				return that.formatCurrency(value) + " ZAR";
			});
		})

		component.set("v.dtfChartValues", dtfChartValues);
		component.set("v.dtfChartLegends", [["Deliver-the-Firm Pipeline", dtfPipeline], ["Deliver-the-Firm Banked", dtfBanked]]);
		component.set("v.dtfChartTooltips", dtfChartTooltips);
	},

	isUnbanked : function(element) {

		let statuses = ['Prospect', 'Potential',undefined];
		return statuses.reduce(function(acc, status) {
			return acc || (status === element.status); 
		}, false);
	},

	isBanked : function(element) {
		return !this.isUnbanked(element);
	}
})