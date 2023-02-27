/**
 * Created by mjaznicki on 29.08.2018.
 */
({
    createNewAttendee: function(component){
        let newAttendee = {};
        newAttendee.sObjectType = 'InternalAttendeeWrapper';
        newAttendee.addRemove = false;
        newAttendee.isOwner = false;
        newAttendee.errorMessage = false;
        newAttendee.sobjAttendee = {};
        newAttendee.sobjAttendee.sobjectType = 'Call_Report_Attendees__c';
        var iterator = component.get('v.iterator');
        newAttendee.sobjAttendee.Id = 'tempId' + iterator;
        newAttendee.sobjAttendee.Call_Report__c = component.get('v.recordId');
        console.log(newAttendee.sobjAttendee.Call_Report__c);
        iterator++;
        component.set('v.iterator', iterator);
        return newAttendee;
    },

    getClientTeamMembers: function(component, eventId, helper){

        var attendeeList = component.get('v.attList');
        var getTeam = component.get('c.getTeamMembers');
        console.log(JSON.stringify(attendeeList));
        getTeam.setParams({idEventReport : eventId, JSONwrappedAttendees : JSON.stringify(attendeeList)});
        getTeam.setCallback(this, function(response){
           var state = response.getState();
           if(state === 'SUCCESS'){
               var list = component.get('v.attList');
                 response.getReturnValue().forEach(function(rec){
                     rec.sobjAttendee.sobjectType = 'Call_Report_Attendees__c';
                     var iterator = 1;
                     rec.sobjAttendee.Id = 'tempTeamId'+iterator;
                     iterator++;
                    list.push(rec);
                 });
                 component.set('v.attList', list);
                  helper.isCoreMeeting(component, eventId, JSON.stringify(attendeeList));
                 component.set('v.showSpinner', false);
           }
        });
         $A.enqueueAction(getTeam);
    },

    navigateToURL: function(url) {
       var urlEvent = $A.get("e.force:navigateToSObject");
           urlEvent.setParams({
              "recordId": url
            });
            urlEvent.fire();

       },

    showError: function(type, msg) {
       var toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
          title : type + ' Message',
          message: msg ,
          duration:' 5000',
          type: type,
       });
       toastEvent.fire();
       },

    validateAndSave: function(component, event, helper, toDelete, toAdd) {
        var validate = component.get('c.validateAndSaveRecords');
        var recordId = component.get('v.recordId');
        validate.setParams({toAdd : toAdd, toDelete : toDelete, recordId : recordId});
        validate.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS') {
                if(response.getReturnValue() === 'SUCCESS') {
                    let url = recordId;
                    helper.navigateToURL(url);
                } else {
                    component.set('v.showSpinner', false);
                    if(response.getReturnValue() === 'Internal core client team meetings require at least 2 core client team members in the Attendees section.'){
                        helper.showError('Warning', response.getReturnValue());
                         let url = recordId;
                        helper.navigateToURL(url);
                    } else if(response.getReturnValue().includes('INSUFFICIENT_ACCESS')) {
                         helper.showError('Error', 'Insufficient access');
                    } else {
                         helper.showError('Error', response.getReturnValue());
                    }
                }
            }
        });
        $A.enqueueAction(validate);

    },

    isCoreMeeting: function(component, recordId, attendees) {
        var isCoreMeeting = component.get('c.isCoreClientMeeting');
        isCoreMeeting.setParam('recordId', recordId);
        isCoreMeeting.setParams({recordId : recordId, JSONwrappedAttendees : attendees});
        isCoreMeeting.setCallback(this, function(response){
            if(response.getState() === 'SUCCESS'){
                component.set('v.isCoreClient', response.getReturnValue());
            }
        });
        $A.enqueueAction(isCoreMeeting);
    }

})