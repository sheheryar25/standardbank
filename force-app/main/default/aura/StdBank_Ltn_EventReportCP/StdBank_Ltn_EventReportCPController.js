({
    doInit: function(component, event, helper) {
        var self = this;
        var recordId = component.get('v.recordId');
        var getRecord = component.get('c.getRecord');

        getRecord.setParam('recordId', recordId);
        getRecord.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.record', result.getReturnValue());
            }
        });

        $A.enqueueAction(getRecord);
    },
    doCheck: function(component, event, helper) {
        var self = this;
        var recordId = component.get('v.recordId');
        var isEligible = component.get('c.buttonsEnabled');

        isEligible.setParam('recordId', recordId);
        isEligible.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.isEligible', result.getReturnValue());
                component.set('v.isLoading', false);
            }
        });

        $A.enqueueAction(isEligible);
    },
    btnAddToOutlook: function(component, event, helper) {
        var record = component.get('v.record');
        var randomNumber = Math.floor(Math.random()*9999999999999);

        location.replace('/servlet/servlet.OutlookEvent?rnd=' + randomNumber + '&id=' + record.EventId__c);
    },
    btnSendEventReport: function(component, event, helper) {
        var self = this;
        var record = component.get('v.record');
        var action = component.get('c.getEmailAttributes');
        var withTeamMembers = confirm('Would you like to send this to the Client Team?');

        action.setParams({
            recordId: record.Id,
            clientId: record.Relate_to_Client__c,
            withTeamMembers: withTeamMembers
        });

        action.setCallback(self, function(result) {
            var navigateToComponent = $A.get("e.force:navigateToComponent");
            navigateToComponent.setParams({
                componentDef: "c:SendEmail",
                componentAttributes: result.getReturnValue()
            });
            navigateToComponent.fire();
        });

        $A.enqueueAction(action);
    },    
    btnAttendeesInternal: function(component, event, helper) {
        var record = component.get('v.record');
        var isEligible = component.get('v.isEligible');

        if (isEligible) {
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
        }
    },
    btnAttendeesExternal: function(component, event, helper) {
        var record = component.get('v.record');
        var isEligible = component.get('v.isEligible');

        if (isEligible) {
             var navService = component.find("navService");
             var pageReference = {
                         type: 'standard__component',
                         attributes: {
                             componentName: 'c__ExternalAttendees',
                         },
                         state: {
                             "c__recordId": record.Id
                         }
                     };
             navService.navigate(pageReference);
        } else {
            helper.showToast('warning','Operation rejected!', 'You do not have the required permission to add Attendees to this Event Report. Please request the Event Owner (' + record.Owner.Name + ')');
        }
    }
})