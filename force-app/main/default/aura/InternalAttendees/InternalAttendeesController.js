/**
 * Created by mjaznicki on 29.08.2018.
 */
({
    doInit: function(component, event, helper) {
        component.set('v.attList', []);
        component.set('v.showSpinner', true);
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
                            response.getReturnValue().forEach(function(rec){
                               list.push(rec);
                               contactIds.push(rec.sobjAttendee.Contact_id__c);
                            });
                            component.set('v.attList', list);
                            component.set('v.currentAttendees', contactIds);
                            helper.getClientTeamMembers(component, Id, helper);
                    }
          });
          $A.enqueueAction(eventReport)

    },

    addRow: function(component, event, helper){
        var list =  component.get('v.attList');
         list.push(helper.createNewAttendee(component));
           component.set('v.attList', list);
    },

    onCancel: function(component, event, helper){
        let url = component.get('v.recordId');
        helper.navigateToURL(url);
    },

   onSave: function(component, event, helper){
        component.set('v.showSpinner', true);
        let attendeeList = component.get('v.attList');
        var error = false;
        var attendeeToAdd = [];
        var toAddIds = new Set();
        var attendeeToDelete = [];
        var currentAttendees = new Set(component.get('v.currentAttendees'));
        attendeeList.forEach(function(record) {
             record.errorMessage = false;
            if(record.addRemove == true) {
                if(record.sobjAttendee.Contact_id__c != null) {
                    if(!toAddIds.has(record.sobjAttendee.Contact_id__c)) {
                        toAddIds.add(record.sobjAttendee.Contact_id__c);
                        if(record.sobjAttendee.Id != null && record.sobjAttendee.Id.startsWith('temp')){
                            record.sobjAttendee.Id = null;
                        }
                        attendeeToAdd.push(record.sobjAttendee);
                    } else {
                        helper.showError('Error', 'You cannot select same Contact more than once');
                        record.errorMessage = true;
                        error = true;
                        component.set('v.attList', attendeeList);
                        return;
                    }
                } else {
                    helper.showError('Error', 'Please enter a value for attendee name');
                    record.errorMessage = true;
                    component.set('v.attList', attendeeList);
                    error = true;
                    return;
                }
            } else if(currentAttendees.has(record.sobjAttendee.Contact_id__c) && !toAddIds.has(record.sobjAttendee.Contact_id__c)) {

                   attendeeToDelete.push(record.sobjAttendee);
            }
        });
        if(error) {
             component.set('v.showSpinner', false);
            return;
        };
        helper.validateAndSave(component, event, helper, attendeeToDelete, attendeeToAdd);
   }


})