({
	doInit : function(component, event, helper) {
		Promise.all([
			helper.promiseGetOpportunitiesForHierarchy(component),
			helper.promiseGetHierarchyMembers(component)
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
	}
})