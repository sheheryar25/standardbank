({
	updateCheckboxes : function(component, event) {
	  var id = event.getSource().get("v.text");
	  var index = component.get("v.checkedOpportunities").indexOf(id);
	  if (event.getSource().get("v.value")) {
	    // Checkbox is checked - add id to checkedContacts
	    if (index < 0) {
	      component.get("v.checkedOpportunities").push(id);
	    }
	  } else {
	    // Checkbox is unchecked - remove id from checkedOpportunities
	    if (index > -1) {
	      component.get("v.checkedOpportunities").splice(index, 1);
	    }
	  }
	  component.set("v.saveEnabled",(component.get("v.checkedOpportunities").length>0));
	},

	doInit: function(component, event){
		var getOpportunities = component.get("c.getOpportunities");
		var clientId = component.get("v.recordId");
		getOpportunities.setParams({
			"clientId" : clientId
		});

		getOpportunities.setCallback(this, function(response) {
			component.set("v.isLoading", false);
			if (component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS") {
					var opportunities = response.getReturnValue();

					if(opportunities!=null){
						if(opportunities.length>0){
							component.set("v.opportunities", opportunities);
						}else{
							component.set("v.messageSeverity", "info");
							component.set("v.message", $A.get("$Label.c.Not_Available"));
						}
					}/*else{
				        component.set("v.messageSeverity", "error");
						component.set("v.message", $A.get("$Label.c.Business_Assessment_Insufficient_Privileges"));
					}*/	
				}else if (state === "ERROR") {
					component.set("v.messageSeverity", "error");
					var message = response.getError();
					if (message && Array.isArray(message) && message.length > 0){
						if(message[0].fieldErrors && message[0].fieldErrors.length > 0){
							message = message[0].fieldErrors[0].message;
						}
						else
						 if(message[0].pageErrors && message[0].pageErrors.length > 0){
							message = message[0].pageErrors[0].message;
						} else if (message[0].message){
							message = message[0].message;
						}
					    
					}
					component.set("v.message", message);
				}
			}
		});

		$A.enqueueAction(getOpportunities);
		
	},

	createAssessment: function(component,event, helper){
		var clientId = component.get("v.recordId");
		var oppsIds = component.get("v.checkedOpportunities");
		var savingModal = component.find("savingModal");
        $A.util.toggleClass(savingModal, "slds-hide");
		helper.createAssessment(component, clientId, oppsIds, function(response){
			if (component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS") {
					var assessment = response.getReturnValue();

					var componentAction = $A.get("e.c:ComponentAction");
				    componentAction.setParams({'data':{'name' : 'continue', 'recordId' : assessment.Id}});
				    componentAction.fire();
			 
				}else if (state === "ERROR") {
					component.set("v.messageSeverity", "error");
					var errors = response.getError();
					if (errors) {
						if (errors[0] && errors[0].message) {
							console.log("Error message: " +
								errors[0].message);
						}
					} else {
						console.log("Unknown error");
					}
					component.set("v.message", errors[0].message);
				}
				$A.util.toggleClass(savingModal, "slds-hide");
			}
		});

		
	},

	cancel: function(component,event){
		var componentAction = $A.get("e.c:ComponentAction");
	    componentAction.setParams({'data':{'name' : 'cancel'}});
	    componentAction.fire();
	},

	recordUpdated: function(component, event){}
})