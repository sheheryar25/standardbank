({
	doInit : function(component, event, helper) {

		var getNumberOfInternalMeetings = component.get("c.getNumberOfInternalMeetings");
		getNumberOfInternalMeetings.setParams({
            "clientId": component.get("v.recordId")
        });

		
		getNumberOfInternalMeetings.setCallback(this, function(response) {
			var state = response.getState();
			var noOfMeetingsResposne = response.getReturnValue();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.numberOfInternalMeetings", response.getReturnValue());
			}
		});

		var getNumberOfExternalMeetings = component.get("c.getNumberOfExternalMeetings");
		getNumberOfExternalMeetings.setParams({
            "clientId": component.get("v.recordId")
        });

		
		getNumberOfExternalMeetings.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.numberOfExternalMeetings", response.getReturnValue());
			}
		});

		
		$A.enqueueAction(getNumberOfInternalMeetings);
		$A.enqueueAction(getNumberOfExternalMeetings);
	}
})