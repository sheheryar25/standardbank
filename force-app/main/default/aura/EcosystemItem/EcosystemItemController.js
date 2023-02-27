({
	doInit : function(component, event, helper) {
		Promise.all([
				helper.promiseGetBankedClients(component), 
				helper.promiseGetUnbankedClients(component),
				helper.promiseGetRevenueAndProfitability(component),
				helper.promiseGetDtfDataPipelineByElement(component),
				helper.promiseGetDtfDataBankedByElement(component),
				helper.promiseGetDtfData(component)
			])
			.then(
				$A.getCallback(function(results) {
					var bankedClients = results[0];
					var ecosystem = results[1];
					var revenueAndProfitability = results[2];
					var dtfDataPipelineByElement = results[3];
					var dtfDataBankedByElement = results[4];
					var dtfData = results[5];

					component.set("v.bankedClients", bankedClients);
					component.set("v.ecosystem", ecosystem);
					component.set("v.revenueAndProfitability", revenueAndProfitability);
					component.set("v.dtfDataPipelineByElement", dtfDataPipelineByElement);
					component.set("v.dtfDataBankedByElement", dtfDataBankedByElement);
					component.set("v.dtfData", dtfData);
					var type = component.get("v.type");

					var typeBankedClients = bankedClients.filter(function(element) { return element.elementType === type; });
					component.set("v.dtfData", dtfData.filter(function(value) { return value.elementType === type; }));
					var bankedClientsSize = typeBankedClients
						.filter(function(e) { return helper.isBanked(e); }).length;
					var knownUnbankedSize = typeBankedClients
						.filter(function(e) { return helper.isUnbanked(e); }).length;
					var unknownUnbankedField = "Unknown_Unbanked_" + component.get("v.fieldName") + "__c";
					var unknownUnbankedSize = ecosystem[unknownUnbankedField];
					var bankedUnbanked = [bankedClientsSize, knownUnbankedSize, unknownUnbankedSize].map(function(element) { 
						return element ? element : 0; 
					});
					var total = bankedUnbanked.reduce(function(acc, value) { return acc + value; }, 0);
					var values = bankedUnbanked.map(function(value) { return total === 0 ? value : value / total; });
					var percentages = values.map(function(value) { return "" + Math.round(value * 100) + "%"; });
					var legends = [[bankedUnbanked[0], "Known Banked"], [bankedUnbanked[1], "Known Unbanked"], [bankedUnbanked[2], "Unknown Unbanked"]];
					component.set("v.values", values);
					component.set("v.legends", legends);
					component.set("v.circleText", percentages[0]);
					component.set("v.isLoading", false);

					var typeRP = revenueAndProfitability.filter(function(element) { return element.name === type; });
					var barValues = [0, 0, 0, 0];
					var roe = 0;
					var legendText = "";
					if (typeRP.length > 0) {
						barValues = [
							typeRP[0].netIncome,
							typeRP[0].nonRevenue,
							typeRP[0].operationalIncome,
							typeRP[0].headlineErnings
						];
						if (typeRP[0].count !== 0) {
							roe = typeRP[0].roe / typeRP[0].count;
						}
						legendText = "";//"ROE " + roe.toFixed(2) + "%";
					}
					var barTooltips = barValues.map(function(value) {
						return helper.formatCurrency(value) + " ZAR";
					});
					component.set("v.barValues", barValues);
					component.set("v.barTooltips", barTooltips);
					component.set("v.legendText", legendText);

					var dtfDataPipeline = dtfDataPipelineByElement.filter(function(element) { return element.elementType === type; });
					var dtfPipeline = "0 ZAR";
					if (dtfDataPipeline.length > 0) {
						dtfPipeline = "" + dtfDataPipeline[0].notionalValue + " ZAR";
					}
					component.set("v.dtfPipeline", dtfPipeline);

					var dtfDataBanked = dtfDataBankedByElement.filter(function(element) { return element.elementType === type; });
					var dtfBanked = "0 ZAR";
					if (dtfDataBanked.length > 0) {
						dtfBanked = "" + dtfDataBanked[0].notionalValue + " ZAR";
					}
					component.set("v.dtfBanked", dtfBanked);

					component.set("v.netInterestIncome", barValues[0] + " ZAR");
					component.set("v.nonInterestIncome", barValues[1] + " ZAR");
					component.set("v.operatingIncome", barValues[2] + " ZAR");
					component.set("v.headlineEarnings", barValues[3] + " ZAR");
					component.set("v.roe", ""/*roe.toFixed(2) + "%"*/);
				}),
				$A.getCallback(function(status) {
					helper.showToast("Error reading data", "");
				})
			);
	},

	doPenetrationChange : function(component, event, helper) {
		if (event.getParam("type") === component.get("v.type")) {
			Promise.all([
					helper.promiseGetBankedClients(component), 
					helper.promiseGetUnbankedClients(component),
				])
				.then(
					$A.getCallback(function(results) {
						var bankedClients = results[0];
						var ecosystem = results[1];

						component.set("v.bankedClients", bankedClients);
						component.set("v.ecosystem", ecosystem);
						var type = component.get("v.type");

						var typeBankedClients = bankedClients.filter(function(element) { return element.elementType === type; });
						var bankedClientsSize = typeBankedClients
							.filter(function(e) { return helper.isBanked(e); }).length;
						var knownUnbankedSize = typeBankedClients
							.filter(function(e) { return helper.isUnbanked(e); }).length;

						var unknownUnbankedField = "Unknown_Unbanked_" + component.get("v.fieldName") + "__c";
						var unknownUnbankedSize = ecosystem[unknownUnbankedField];
						var bankedUnbanked = [bankedClientsSize, knownUnbankedSize, unknownUnbankedSize].map(function(element) { 
							return element ? element : 0; 
						});
						var total = bankedUnbanked.reduce(function(acc, value) { return acc + value; }, 0);
						var values = bankedUnbanked.map(function(value) { return total === 0 ? value : value / total; });
						var percentages = values.map(function(value) { return "" + Math.round(value * 100) + "%"; });
						var legends = [[bankedUnbanked[0], "Known Banked"], [bankedUnbanked[1], "Known Unbanked"], [bankedUnbanked[2], "Unknown Unbanked"]];
						component.set("v.values", values);
						component.set("v.legends", legends);
						component.set("v.circleText", percentages[0]);
					}),
					$A.getCallback(function(status) {
						helper.showToast("Error reading data", "");
					})
			);
		}
	},

	doEntityChange : function(component, event, helper) {
		if (event.getParam("type") === component.get("v.type")) {
			Promise.all([
					helper.promiseGetBankedClients(component), 
					helper.promiseGetUnbankedClients(component),
					helper.promiseGetRevenueAndProfitability(component),
					helper.promiseGetDtfDataPipelineByElement(component),
					helper.promiseGetDtfDataBankedByElement(component),
					helper.promiseGetDtfData(component)
				])
				.then(
					$A.getCallback(function(results) {
						var bankedClients = results[0];
						var ecosystem = results[1];
						var revenueAndProfitability = results[2];
						var dtfDataPipelineByElement = results[3];
						var dtfDataBankedByElement = results[4];
						var dtfData = results[5];

						component.set("v.bankedClients", bankedClients);
						component.set("v.ecosystem", ecosystem);
						component.set("v.revenueAndProfitability", revenueAndProfitability);
						component.set("v.dtfDataPipelineByElement", dtfDataPipelineByElement);
						component.set("v.dtfDataBankedByElement", dtfDataBankedByElement);
						component.set("v.dtfData", dtfData);
						var type = component.get("v.type");

						var typeBankedClients = bankedClients.filter(function(element) { return element.elementType === type; });
						component.set("v.dtfData", dtfData.filter(function(value) { return value.elementType === type; }));
						var bankedClientsSize = typeBankedClients
							.filter(function(e) { return helper.isBanked(e); }).length;
						var knownUnbankedSize = typeBankedClients
							.filter(function(e) { return helper.isUnbanked(e); }).length;

						var unknownUnbankedField = "Unknown_Unbanked_" + component.get("v.fieldName") + "__c";
						var unknownUnbankedSize = ecosystem[unknownUnbankedField];
						var bankedUnbanked = [bankedClientsSize, knownUnbankedSize, unknownUnbankedSize].map(function(element) { 
							return element ? element : 0; 
						});
						var total = bankedUnbanked.reduce(function(acc, value) { return acc + value; }, 0);
						var values = bankedUnbanked.map(function(value) { return total === 0 ? value : value / total; });
						var percentages = values.map(function(value) { return "" + Math.round(value * 100) + "%"; });
						var legends = [[bankedUnbanked[0], "Known Banked"], [bankedUnbanked[1], "Known Unbanked"], [bankedUnbanked[2], "Unknown Unbanked"]];
						component.set("v.values", values);
						component.set("v.legends", legends);
						component.set("v.circleText", percentages[0]);

						var typeRP = revenueAndProfitability.filter(function(element) { return element.name === type; });
						var barValues = [0, 0, 0, 0];
						var roe = 0;
						var legendText = "";
						if (typeRP.length > 0) {
							barValues = [
								typeRP[0].netIncome,
								typeRP[0].nonRevenue,
								typeRP[0].operationalIncome,
								typeRP[0].headlineErnings
							];
							if (typeRP[0].count !== 0) {
								roe = typeRP[0].roe / typeRP[0].count;
							}
							legendText = "";//"ROE " + roe.toFixed(2) + "%";
						}
						var barTooltips = barValues.map(function(value) {
							return helper.formatCurrency(value) + " ZAR";
						});
						component.set("v.barValues", barValues);
						component.set("v.barTooltips", barTooltips);
						component.set("v.legendText", legendText);

						var dtfDataPipeline = dtfDataPipelineByElement.filter(function(element) { return element.elementType === type; });
						var dtfPipeline = "0 ZAR";
						if (dtfDataPipeline.length > 0) {
							dtfPipeline = "" + dtfDataPipeline[0].notionalValue + " ZAR";
						}
						component.set("v.dtfPipeline", dtfPipeline);

						var dtfDataBanked = dtfDataBankedByElement.filter(function(element) { return element.elementType === type; });
						var dtfBanked = "0 ZAR";
						if (dtfDataBanked.length > 0) {
							dtfBanked = "" + dtfDataBanked[0].notionalValue + " ZAR";
						}
						component.set("v.dtfBanked", dtfBanked);

						component.set("v.netInterestIncome", barValues[0] + " ZAR");
						component.set("v.nonInterestIncome", barValues[1] + " ZAR");
						component.set("v.operatingIncome", barValues[2] + " ZAR");
						component.set("v.headlineEarnings", barValues[3] + " ZAR");
						component.set("v.roe", ""/*roe.toFixed(2) + "%"*/);
					}),
					$A.getCallback(function(status) {
						helper.showToast("Error reading data", "");
					})
				);
		}
	}
})