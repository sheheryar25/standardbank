/**
 * Created by Chibuye Kunda on 2019/12/02.
 * 
 * Last Modified By: Balint Gyokeres
 * Description: SFP-4617, MeetingConsole_Detail shows up for a second even when not needed, added conditional rendering
 * Last Modified Date: 24 June 2021
 */

({
    init:function(cmp,event,helper){

        let url = window.location.href;
        if(url.includes('new?')){
            // if we are creating new record go get the record type name by recordType ID
            let params = url.split('?')[1];
            let parmsegments  = params.split('&');
            let recordtype = parmsegments[0].split('=')[1];
            let pageReference = {
                type: 'standard__component',
                attributes: {
                    componentName: 'c__EventReport',
                }
            };
            helper.getNumOfRecordTypesAndlist(cmp,event,pageReference,recordtype);
        }
        else if(url.includes('edit?') || url.includes('/edit')){
            let pageReference = {
                type: 'standard__component',
                attributes: {
                    componentName: 'c__EventReport',
                },
                state: {
                    "c__recordId": cmp.get('v.recordId')
                }
            };
            helper.getRecordTypeNameForEdit(cmp,event,pageReference);
        }
        if(cmp.get('v.recordId')!=null){
        let action = cmp.get('c.whichRecordTypeName');
        let returnedData;
        action.setParams({recId: cmp.get('v.recordId')});
        action.setCallback(this, function (res) {
            try {

                let state = res.getState();

                if (state == "SUCCESS") {
                    returnedData = res.getReturnValue();
                    if(returnedData=='NBAC Meeting'){
                        cmp.set('v.isNbacMeeting', true);
                    } 
                } else if (state == "ERROR") {

                    throw res.getError();
                }

            } catch (e) {
                this.showMyToast(e.message, 'error');
            }
        })
        $A.enqueueAction(action);
    }
        helper.getNBAcCommitteeOptions(cmp,event);
        helper.getHasAccess(cmp,event);
        if(cmp.get('v.recordId')!=undefined){
            helper.getEventReport(cmp,event);
            helper.getAgendaSize(cmp,event);
        }
        else {
            cmp.set('v.readOnly', false);
            helper.newEventReport(cmp,event);
        }

    },
    onChangenabcCommitteeOp: function (cmp, event, helper) {
        let nabcCommitteeOp = event.getSource().get("v.value");
        let eventData = cmp.get('v.eventData');
        if(nabcCommitteeOp=="--None--"){
            eventData.NBACCommittee = null;
        }
        else {
            eventData.NBACCommittee = nabcCommitteeOp;
        }
        cmp.set('v.eventData',eventData);
        eventData = cmp.get('v.eventData');
    },
    onChangeStartDate: function (cmp, event, helper) {
        let startDate = event.getSource().get("v.value");
        let eventData = cmp.get('v.eventData');
        eventData.meetingStartDate = startDate;
        eventData.meetingEndDate = startDate;
        cmp.set('v.eventData',eventData);
    },
    onChangeEndDate: function (cmp, event, helper) {
        let endDate = event.getSource().get("v.value");
        let eventData = cmp.get('v.eventData');
        eventData.meetingEndDate = endDate;
        cmp.set('v.eventData',eventData);

    },
    closeNbacDetatils:function (cmp, event, helper){

        cmp.set('v.isNbacDetails',false);
},
    handleMeetingEvent:function (cmp,event,helper) {

        let data = event.getParam("data");
        data = JSON.parse(data);//unwraping proxy

        switch (data.event_type) {
            case 'show_agenda_details':
                helper.viewNbac(data.data,cmp);
                break;
            case 'remove_agenda_details':
                helper.removeNbac(data.data,cmp);
                break;
            case 'editTask':
                helper.editTask(data.data,cmp);
                break;
            case 'viewTask':
                helper.viewTask(data.data,cmp);
                break;
        }

    },
    saveDataMeetingDetails:function (cmp,event,helper) {
      try {
          let action = cmp.get('c.saveDataMeetingDetailsAura');

          let eventDataToValidate = cmp.get('v.eventData');
          let subject = cmp.find("subject");
          let meetingStartDate = cmp.find("meetingStartDate");
          let meetingEndDate = cmp.find("meetingEndDate");
          let NBACCommittee = cmp.get('v.NBACCommitteeOption');
          if(NBACCommittee.length == 1){
                eventDataToValidate.NBACCommittee =NBACCommittee[0].value;
           }
           else if(NBACCommittee.length >1){
                eventDataToValidate.NBACCommittee = eventDataToValidate.NBACCommittee==null  ?NBACCommittee[0].value:eventDataToValidate.NBACCommittee;
          }
          let eventData = JSON.stringify(eventDataToValidate);
          if (subject.checkValidity() && (eventDataToValidate.NBACCommittee != null || NBACCommittee != null) &&
              meetingStartDate.checkValidity() && meetingEndDate.checkValidity()) {

              cmp.set('v.isLoadingMain', true);
              action.setParams({evntData: eventData});

              action.setCallback(this, function (res) {
                  cmp.set('v.isLoadingMain', false);
                  try {

                      let state = res.getState();

                      if (state == "SUCCESS") {

                          let returnedData = res.getReturnValue();

                          returnedData = JSON.parse(returnedData);

                          if (returnedData.iserror == false) {

                              cmp.set('v.recordId', returnedData.eventId);
                              cmp.set('v.eventDataTempo', cmp.get('v.eventData'));
                              cmp.set('v.readOnly', true);
                              let navEvt = $A.get("e.force:navigateToSObject");
                              navEvt.setParams({
                                  "recordId": returnedData.eventId
                              });
                              navEvt.fire();
                          } else {
                              helper.showMyToast(returnedData.msg, 'error');
                          }


                      } else if (state == "ERROR") {

                          throw res.getError();
                      }

                  } catch (e) {


                      helper.showMyToast(e.message, 'error');
                  }


              })
              $A.enqueueAction(action);
          }
      }
      catch(e){
          helper.showMyToast(e.message, 'error');
      }
    },
    handleEditMeeting:function (cmp,event,helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {
            if (cmp.get('v.readOnly')) {
                cmp.set('v.readOnly', false);
            }
        }
        else {
             helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    handleCancelMeeting:function (cmp,event,helper) {


        cmp.set('v.readOnly',true);
        cmp.set('v.eventData', cmp.get('v.eventDataTempo'))


    }
,
    sendAgenda:function (cmp,event,helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if((access.hasAccess || !(access.isSubmission || access.isCommittee) )&& cmp.get('v.agendaSize')>0 ){

                helper.sendAgenda(cmp,event);
        }
        else {
            if(cmp.get('v.agendaSize')>0) {
                helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
            }
            else {
                helper.showMyToast('Please add agenda first.', 'error');
            }
        }
    }
    ,
    deleteEvent:function (cmp,event,helper) {
        let access = JSON.parse(cmp.get('v.access'));
        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {

            helper.deleteEvent(cmp,event);
        }
        else {
            helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    warningbtn:function(cmp){
        cmp.set('v.warning',true);
    },
    cancelWarningbtn:function(cmp){
        cmp.set('v.warning',false);
    },
    goBack:function (cmp,event,helper) {
     helper.goBack();
    }


});