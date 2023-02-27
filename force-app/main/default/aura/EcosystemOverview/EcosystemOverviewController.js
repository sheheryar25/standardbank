({
	doInit : function(component, event, helper) {
		Promise.all([
				helper.promiseGetBankedClients(component), 
				helper.promiseGetUnbankedClients(component),
				helper.promiseGetRevenueAndProfitability(component),
				helper.promiseGetDtfDataPipelineByElement(component),
				helper.promiseGetDtfDataBankedByElement(component)
			])
			.then(
				$A.getCallback(function(results) {
					helper.processResults(component, results);
					component.set("v.isLoading", false);
				}),
				$A.getCallback(function(status) {
					helper.showToast("Error reading data", "");
				})
			);
	},

	doPenetrationChange : function(component, event, helper) {
		Promise.all([
				helper.promiseGetBankedClients(component), 
				helper.promiseGetUnbankedClients(component)
			])
			.then(
				$A.getCallback(function(results) { 
					var bankedClients = results[0];
					var ecosystem = results[1];

					component.set("v.bankedClients", bankedClients);
					component.set("v.ecosystem", ecosystem);

					var types = component.get("v.types");
					var knownBankedValues = types.map(function(type) {
						var typeBankedClients = bankedClients
							.filter(function(element) { return element.elementType === type; })
							.filter(function(element) { return helper.isBanked(element); });
						return typeBankedClients.length;
					});

					var knownUnbankedValues = types.map(function(type) {
						var typeUnbankedClients = bankedClients
							.filter(function(element) { return element.elementType === type; })
							.filter(function(element) { return helper.isUnbanked(element); });
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
				}),
				$A.getCallback(function(status) {
					helper.showToast("Error reading data", "");
				})
			);
	},

	doEntityChange : function(component, event, helper) {
		Promise.all([
				helper.promiseGetBankedClients(component), 
				helper.promiseGetUnbankedClients(component),
				helper.promiseGetRevenueAndProfitability(component),
				helper.promiseGetDtfDataPipelineByElement(component),
				helper.promiseGetDtfDataBankedByElement(component)
			])
			.then(
				$A.getCallback(function(results) { 
					helper.processResults(component, results);
				}),
				$A.getCallback(function(status) {
					helper.showToast("Error reading data", "");
				})
			);
	}
})