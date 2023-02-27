({
	doInit : function(component, event, helper) {
        var recordId = component.get('v.recordId');
        var getRecord = component.get('c.getRecord');
        var isEligible = component.get('c.buttonsEnabled');
        var record;
        var eligible;

        getRecord.setParam('recordId', recordId);
        isEligible.setParam('recordId', recordId);

        var getRecordPromise = new Promise(function(resolve) {
        	getRecord.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === 'SUCCESS') {
	            	record = response.getReturnValue();
	            }
	            resolve();
	        })
        });

        var isEligiblePromise = new Promise(function(resolve) {
        	isEligible.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === 'SUCCESS') {
            		eligible = response.getReturnValue();
            	}
            	resolve();
            })
        });

        var finish = $A.getCallback(function() {
			if (component.isValid()) {
                if (eligible) {
                    var navService = component.find("navService");
                    var pageReference = {
                                type: 'standard__component',
                                attributes: {
                                    componentName: 'c__InternalAttendees',
                                },
                                state: {
                                    "c__recordId": record.Id
                                }
                            };
                    navService.navigate(pageReference);
                } else {
                    helper.showToast('warning','Operation rejected!', 'You do not have the required permission to add Attendees to this Event Report. Please request the Event Owner (' + record.Owner.Name + ')');
                    $A.get("e.force:closeQuickAction").fire();
                }
			}
		});

        Promise.all([getRecordPromise, isEligiblePromise]).then(finish);

        $A.enqueueAction(getRecord);
        $A.enqueueAction(isEligible);
	}
})