({
    navigateToURL: function(url) {
        var urlEvent = $A.get("e.force:navigateToSObject");
        urlEvent.setParams({ "recordId": url });
        urlEvent.fire();
    },

    showError: function(msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: 'Error Message',
            message: msg ,
            duration:' 5000',
            type: 'error',
        });
        toastEvent.fire();
    },

    createNewAttendee: function(component) {
        let newAttendee = {};
        newAttendee.sObjectType = 'ExternalAttendeeWrapper';
        newAttendee.addRemove = false;
        newAttendee.isOwner = false;
        newAttendee.sobjAttendee = {};
        newAttendee.sobjAttendee.sobjectType = 'Call_Report_Attendees__c';

        var iterator = component.get('v.iterator');
        newAttendee.sobjAttendee.Id = 'tempId' + iterator;
        newAttendee.sobjAttendee.Call_Report__c = component.get('v.recordId');
        newAttendee.errorMessage = false;
        iterator++;
        component.set('v.iterator', iterator);

        return newAttendee;
    },

    getClientContacts: function(component, eventId) {
        var attendeeList = component.get('v.attList');

        var getClients = component.get('c.getClientContacts');
        getClients.setParams({idEventReport : eventId, JSONwrappedAttendees : JSON.stringify(attendeeList)});
        getClients.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var list = component.get('v.attList');

                response.getReturnValue().forEach(function(rec) {
                    rec.sobjAttendee.sobjectType = 'Call_Report_Attendees__c';
                    var iterator = 1;
                    rec.sobjAttendee.Id = 'tempTeamId' + iterator;
                    iterator++;
                    list.push(rec);
               });

               component.set('v.attList', list);
               component.set('v.showSpinner', false);
            }
        });
        $A.enqueueAction(getClients);
    },

    validateAndSave: function(component, event, helper, toDelete, toAdd) {
        var validate = component.get('c.validateAndSaveRecords');
        var recordId = component.get('v.recordId');

        validate.setParams({ toAdd : toAdd, toDelete : toDelete, recordId : recordId });
        validate.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                if(response.getReturnValue() === 'SUCCESS') {
                    let url = recordId;
                    helper.navigateToURL(url);
                } else {
                    if(response.getReturnValue().includes('INSUFFICIENT_ACCESS')) {
                        helper.showError('Insufficient access');
                    } else {
                        helper.showError(response.getReturnValue());
                    }

                   component.set('v.showSpinner', false);
               }
           }
       });
       $A.enqueueAction(validate);
    }
})