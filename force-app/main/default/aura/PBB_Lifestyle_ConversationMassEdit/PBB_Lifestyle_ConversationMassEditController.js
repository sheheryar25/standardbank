({
	onInit: function (component, event, helper) {
		var currentPageRef = component.get("v.pageReference");
		if(currentPageRef && currentPageRef.state && currentPageRef.state.c__recordId){
			component.set('v.recordId', currentPageRef.state.c__recordId);
		}
	}
})