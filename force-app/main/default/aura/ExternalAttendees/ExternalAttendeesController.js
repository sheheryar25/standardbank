({
    doInit: function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
        var Id = myPageRef.state.c__recordId;
        component.set("v.recordId", Id);

        var eventReport = component.get('c.getEventReportAttendees');
        eventReport.setParam('idEventReport', Id);
        eventReport.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let list = [];
                let contactIds = [];

                response.getReturnValue().forEach(function(rec) {
                    list.push(rec);
                    contactIds.push(rec.sobjAttendee.Contact_id__c);
               });

               component.set('v.attList', list);
               component.set('v.currentAttendees', contactIds);

               helper.getClientContacts(component, Id);
            }
        });
        $A.enqueueAction(eventReport);
    },

    onCancel: function(component, event, helper) {
        let url = component.get('v.recordId');
        helper.navigateToURL(url);
    },

    addRow: function(component, event, helper) {
        var list =  component.get('v.attList');
        list.push(helper.createNewAttendee(component));
        component.set('v.attList', list);
    },

    onSave: function(component, event, helper) {
        component.set('v.showSpinner', true);
        let attendeeList = component.get('v.attList');

        var error = false;
        var attendeeToAdd = [];
        var toAddIds = new Set();
        var attendeeToDelete = [];
        var currentAttendees = new Set(component.get('v.currentAttendees'));

        attendeeList.forEach(function(record) {
            record.errorMessage = false;
                if (record.addRemove == true) {
                    if (record.sobjAttendee.Contact_id__c != null) {

                        if (!toAddIds.has(record.sobjAttendee.Contact_id__c)) {
                             toAddIds.add(record.sobjAttendee.Contact_id__c);
                             if(record.sobjAttendee.Id != null && record.sobjAttendee.Id.startsWith('temp')) {
                                 record.sobjAttendee.Id = null;
                             }
                             attendeeToAdd.push(record.sobjAttendee);
                        } else {
                            helper.showError('You cannot select same Contact more than once');
                            error = true;
                            record.errorMessage = true;
                            component.set('v.attList', attendeeList);
                            return;
                        }
                    } else {
                        helper.showError('Please enter a value for attendee name');
                        error = true;
                        record.errorMessage = true;
                        component.set('v.attList', attendeeList);
                        return;
                    }
                } else if (currentAttendees.has(record.sobjAttendee.Contact_id__c) && !toAddIds.has(record.sobjAttendee.Contact_id__c)) {
                    attendeeToDelete.push(record.sobjAttendee);
                }
        });

        if(error) {
            component.set('v.showSpinner', false);
            return;
        };

        helper.validateAndSave(component, event, helper, attendeeToDelete, attendeeToAdd);
    },

    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    }
})