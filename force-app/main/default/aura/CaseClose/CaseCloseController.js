({
	doInit : function(component, event, helper) {
		Promise.all([
			UTL.promise(component.get("c.getRecord"), {contextId:component.get("v.recordId")}),
			UTL.promise(component.get("c.getStatuses")),
		])
			.then(
				$A.getCallback(function(result) {
					component.set("v.isLoading",false);
					if (component.isValid()) {
						component.set("v.caseRecord",result[0]);
						component.set("v.options",result[1]);
					}
				}),
				$A.getCallback(function(error) {
					component.set("v.isLoading",false);
					component.set('v.errorMsg',UTL.getErrorMessage(error));
				})
			)
	},
	close : function(component, event, helper) {
		$A.get("e.force:closeQuickAction").fire();
	},
	save :function(component, event, helper) {
		component.set("v.isLoading",true);
		var saveRecord = component.get("c.saveRecord");
		saveRecord.setParams({
            "caseRecord": component.get("v.caseRecord")
        });
		saveRecord.setCallback(this, function(response) {
			var state = response.getState();
			component.set("v.isLoading",false);
			if (component.isValid() && state === "SUCCESS") {
				$A.get("e.force:refreshView").fire();
				helper.showToast(component,'Case '+component.get("v.caseRecord").CaseNumber+' was saved.','success');
			}
			if (component.isValid() && state === "ERROR") {
				component.set("v.errorMsg",response.getError()[0].pageErrors[0].message);
			}
		});
		$A.enqueueAction(saveRecord);
	}
})