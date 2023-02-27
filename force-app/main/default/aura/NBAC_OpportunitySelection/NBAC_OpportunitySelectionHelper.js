({
	createAssessment : function(component, clientId, oppsIds, callback) {
		var createAction = component.get("c.saveAssessment");

		createAction.setParams({
			"clientId" : clientId,
			"opportunitiesIds" : oppsIds
		});

		if(callback){
			createAction.setCallback(this, callback);
		}

		$A.enqueueAction(createAction);
	}
})