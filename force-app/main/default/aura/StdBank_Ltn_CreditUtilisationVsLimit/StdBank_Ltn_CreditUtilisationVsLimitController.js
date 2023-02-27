({
	doInit : function(component, event, helper) {

		helper.isEconomicGroupParent(component);
		helper.hasCreditLines(component);
		helper.isLimited(component);

	}
})