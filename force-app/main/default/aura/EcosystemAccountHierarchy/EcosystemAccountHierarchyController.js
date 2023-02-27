({
	init : function (component, event, helper) {
		var hierarchyMembers = component.get("{!v.hierarchyMembers}");
		hierarchyMembers.forEach(function(element) {
			element.profitability.netIncome = helper.formatCurrency(element.profitability.netIncome);
			element.profitability.nonRevenue = helper.formatCurrency(element.profitability.nonRevenue);
			element.profitability.operationalIncome = helper.formatCurrency(element.profitability.operationalIncome);
			element.profitability.headlineErnings = helper.formatCurrency(element.profitability.headlineErnings);
		});
	}
})