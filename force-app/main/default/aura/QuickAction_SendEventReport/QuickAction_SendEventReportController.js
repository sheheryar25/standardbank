({
	doInit : function(component, event, helper) {
        var recordId = component.get('v.recordId');
        var getRecord = component.get('c.getRecord');
        var record;

        getRecord.setParam('recordId', recordId);

        var getRecordPromise = new Promise(function(resolve) {
        	getRecord.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === 'SUCCESS') {
	            	record = response.getReturnValue();
	            }
	            resolve();
	        })
        });

        getRecordPromise.then(function() {
	        var getEmailAttributes = component.get('c.getEmailAttributes');
	        var withTeamMembers = confirm('Would you like to send this to the Client Team?');

	        getEmailAttributes.setParams({
	            recordId: record.Id,
	            clientId: record.Relate_to_Client__c,
	            withTeamMembers: withTeamMembers
	        });

	        getEmailAttributes.setCallback(this, function(result) {
	            var navigateToComponent = $A.get("e.force:navigateToComponent");
	            navigateToComponent.setParams({
	                componentDef: "c:SendEmail",
	                componentAttributes: result.getReturnValue()
	            });
	            navigateToComponent.fire();
                $A.get("e.force:closeQuickAction").fire();

	        });
        	$A.enqueueAction(getEmailAttributes);
        });

        $A.enqueueAction(getRecord);
	}
})