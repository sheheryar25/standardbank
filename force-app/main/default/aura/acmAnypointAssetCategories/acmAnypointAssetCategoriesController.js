({
	doInit : function(component, event, helper) {
		helper.fetchAnypointAssetCategories(component);
        helper.fetchAnypointAssets(component);
	}
})