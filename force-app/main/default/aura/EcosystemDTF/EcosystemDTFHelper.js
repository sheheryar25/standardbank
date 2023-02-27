({
	promiseGetOpportunitiesForHierarchy : function(component) {
		return this.createPromise(component, "c.getOpportunitiesForAccountHierarchy", {
			"groupNumber": component.get("v.groupNumber")
		});
	},

	promiseGetHierarchyMembers : function(component) {
		return this.createPromise(component, "c.getHierarchyMembers", {
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

	processResults : function(component, results) {
		var helper = this;

		var opportunities = results[0];
		var hierarchyMembers = results[1];

		helper.processOpportunities(component, opportunities);
		helper.processHierarchyMembers(component, hierarchyMembers);
		
	},

	processOpportunities : function(component, opportunities) {
		var helper = this;

		var leadOpps = opportunities.filter(function(value) {return value.StageName === "1 - Lead";});
		var developOpps = opportunities.filter(function(value) {return value.StageName === "2 - Develop";});
		var closedWonOpps = opportunities.filter(function(value) {return value.StageName === "3 - Closed Won";});

		var pipelineOpps = [];
		pipelineOpps = pipelineOpps.concat(leadOpps);
		pipelineOpps = pipelineOpps.concat(developOpps);
		pipelineOpps = pipelineOpps.concat(closedWonOpps);

		var dtfPipeline = 0;
		
		pipelineOpps.forEach(function(element) {
			if (element.hasOwnProperty('Products__r')) {
				element.Products__r.forEach(function(prod) {
					if (prod.hasOwnProperty('Facility_Size__c')) {
						dtfPipeline += prod.Facility_Size__c;
					}
				});
			}
		});
		
		dtfPipeline = helper.formatCurrency(dtfPipeline) + " ZAR";

		component.set("v.dtfPipeline", dtfPipeline);

		var oppsCount = [leadOpps.length, developOpps.length, closedWonOpps.length];
		var total = oppsCount.reduce(function(a, b) { return a + b; }, 0);
		var radialValues = oppsCount.map(function(value) { return total === 0 ? value : value / total; });
		var percentages = radialValues.map(function(value) { return "" + Math.round(value * 100) + "%"; });
		var radialLegends = [[oppsCount[0], "Lead"], [oppsCount[1], "Develop"], [oppsCount[2], "Closed - Won"]];
		component.set("v.radialValues", radialValues);
		component.set("v.radialLegends", radialLegends);
		component.set("v.radialCircleText", percentages[2]);
	},

	processHierarchyMembers : function(component, hierarchyMembers) {
		var helper = this;

		component.set("v.hierarchyMembers", hierarchyMembers);

		var barValues = [0, 0, 0, 0];
		var roe = 0;
		var count = 0;
		var barLegendText = "";
		
		hierarchyMembers.forEach(function(element) {
			barValues[0] += element.profitability.netIncome;
			barValues[1] += element.profitability.nonRevenue;
			barValues[2] += element.profitability.operationalIncome;
			barValues[3] += element.profitability.headlineErnings;
			roe += element.profitability.roe;
			count += element.profitability.count;
		});

		barValues.forEach(function(element) {
			element = helper.formatCurrency(element);
		});

		var dtfBanked = helper.formatCurrency(barValues[2]) + " ZAR";
		component.set("v.dtfBanked", dtfBanked);

		if (count !== 0) {
			roe = roe / count;
		}
		barLegendText = "ROE " + roe.toFixed(2) + "%";

		var barTooltips = barValues.map(function(value) {
			return helper.formatCurrency(value) + " ZAR";
		});
		component.set("v.barValues", barValues);
		component.set("v.barTooltips", barTooltips);
		component.set("v.barLegendText", "");

	},

	formatCurrency : function(amount) {
		if (isNaN(amount)) {
			amount = 0.00;
		}
		amount = amount.toFixed(2);
		var str = amount.toString().split('.');
		if (str[0].length >= 4) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		return str.join('.');
	}
})