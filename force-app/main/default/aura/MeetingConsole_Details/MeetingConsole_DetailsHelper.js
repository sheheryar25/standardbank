/**
 * Created by Chibuye Kunda on 2019/12/04.
 */

({
    getNBAcCommitteeOptions:function (cmp,event) {

        let action = cmp.get('c.getNBAcCommitteeOptions');
        let optionLabel = [];

        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = JSON.parse(res.getReturnValue());
                    for(let x in returnedData){
                        let actualKey = Object.keys(returnedData[x]);

                        optionLabel.push({label:actualKey[0],value:returnedData[x][actualKey[0]]});
                    }

                    cmp.set('v.NBACCommitteeOption',optionLabel);

                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                this.showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);

    },
    getNumOfRecordTypesAndlist:function (cmp,event, pgRef,recordtype) {
        try {
            let action = cmp.get('c.getNumOfRecordTypesAndlist');

            action.setCallback(this, function (res) {
                try {

                    let state = res.getState();

                    if (state == "SUCCESS") {

                        let returnedData = res.getReturnValue();
                        // the numberOfRecTypes includes master recordType
                        if((returnedData.numberOfRecTypes==2 && returnedData.Meeting!=undefined) || (returnedData.Meeting==recordtype)
                            ||(returnedData.numberOfRecTypes==1 && returnedData.Master!=undefined)){

                            // go to existing EventReport component
                             let navService = cmp.find("navService");
                             navService.navigate(pgRef);
                         }
                       else{
                                cmp.set('v.isNbacMeeting',true);

                       }

                    } else if (state == "ERROR") {

                        throw res.getError();
                    }
                    this.getHasAccess(cmp);
                } catch (e) {

                    this.showMyToast(e.message, 'error');
                }


            })
            $A.enqueueAction(action);
        }
        catch(e){

            cmp.set('v.isLoadingMain', false);
            this.showMyToast(e.message,'error');
        }
    },

getRecordTypeNameForEdit:function (cmp,event, pgRef) {
    try {
        let action = cmp.get('c.whichRecordTypeName');

        action.setParams({recId: cmp.get('v.recordId')});
        cmp.set('v.isLoadingMain', true);
        action.setCallback(this, function (res) {
            cmp.set('v.isLoadingMain', false);
            try {

                let state = res.getState();

                if (state == "SUCCESS") {

                    let returnedData = res.getReturnValue();

                    if (returnedData != 'NBAC Meeting') {

                        // go to existing EventReport component
                        let navService = cmp.find("navService");
                        navService.navigate(pgRef);
                    }


                } else if (state == "ERROR") {

                    throw res.getError();
                }

            } catch (e) {
                cmp.set('v.isLoadingMain', false);
                this.showMyToast(e.message, 'error');
            }


        })
        $A.enqueueAction(action);
    }
    catch(e){

            cmp.set('v.isLoadingMain', false);
            this.showMyToast(e.message,'error');
        }
},
    getRecordTypeNameForNew:function (cmp,recId) {

        let action = cmp.get('c.getRecordTypeName');

        action.setParams({recId:recId});
        cmp.set('v.isLoadingMain', true);
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();

                    if(returnedData!='NBAC Meeting'){
                        let evt = $A.get("e.force:navigateToComponent");
                        evt.setParams({
                            componentDef : "c:EventReport",
                        });
                        evt.fire();
                    }

                    cmp.set('v.isLoadingMain', false);
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                cmp.set('v.isLoadingMain', false);
                this.showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);
    },
    getEventReport:function (cmp,event) {

        let action = cmp.get('c.getEventReport');
        let recordId = cmp.get('v.recordId');
        action.setParams({eventReportId:recordId});
        cmp.set('v.isLoadingMain', true);
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    cmp.set('v.eventData',JSON.parse(returnedData))
                    cmp.set('v.eventDataTempo',JSON.parse(returnedData))
                    cmp.set('v.isLoadingMain', false);
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                cmp.set('v.isLoadingMain', false);
                this.showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);
    },
    newEventReport:function (cmp,event) {

        let action = cmp.get('c.newEventReport');

        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();

                    cmp.set('v.eventData',JSON.parse(returnedData))
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                this.showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);
    },
    sendAgenda:function (cmp,event) {
        try {
            let action = cmp.get('c.sendAgendaAura');
            let recordId = cmp.get('v.recordId');
            action.setParams({ERID: recordId});
            cmp.set('v.isLoadingMain', true);
            action.setCallback(this, function (res) {

                try {

                    let state = res.getState();
                    cmp.set('v.isLoadingMain', false);
                    if (state == "SUCCESS") {

                        let returnedData = res.getReturnValue();

                        returnedData = JSON.parse(returnedData);

                        if (returnedData.iserror) {
                            this.showMyToast(returnedData.msg, 'error');
                        } else {
                            this.showMyToast(returnedData.msg, 'success');
                        }

                    } else if (state == "ERROR") {

                        throw res.getError();
                    }

                } catch (e) {

                    cmp.set('v.isLoadingMain', false);
                    this.showMyToast(e.message, 'error');
                }


            })
            $A.enqueueAction(action);
        }
    catch(e){

            cmp.set('v.isLoadingMain', false);
            this.showMyToast(e.message,'error');
        }
    },
    deleteEvent:function (cmp,event) {
    try {
        let action = cmp.get('c.deleteERAura');
        let recordId = cmp.get('v.recordId');
        action.setParams({ERID: recordId});
        cmp.set('v.isLoadingMain', true);
        action.setCallback(this, function (res) {

            try {

                let state = res.getState();
                cmp.set('v.isLoadingMain', false);
                if (state == "SUCCESS") {

                    let returnedData = res.getReturnValue();

                    returnedData = JSON.parse(returnedData);

                    if (returnedData.iserror) {
                        this.showMyToast(returnedData.msg, 'error');
                    } else {
                        this.showMyToast(returnedData.msg, 'success');
                        this.goBack();
                    }

                } else if (state == "ERROR") {

                    throw res.getError();
                }

            } catch (e) {

                cmp.set('v.isLoadingMain', false);
                this.showMyToast(e.message, 'error');
            }


        })
        $A.enqueueAction(action);
    }
    catch(e){

        cmp.set('v.isLoadingMain', false);
        this.showMyToast(e.message,'error');
    }
},
    removeNbac:function(data,cmp){

        try {
            let access = JSON.parse(cmp.get('v.access'));
            if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {
              //
                let action = cmp.get('c.removeAgendaAura');
                action.setParams({agendaIdtormv:data['Id']});
                action.setCallback(this,function (res){

                    try{console.log('test')


                        let state = res.getState();

                        if(state=="SUCCESS") {

                            let returnedData = res.getReturnValue();
                            let JsonObj = JSON.parse(returnedData);

                                if (JsonObj.isError) {
                                    this.showMyToast(JsonObj.msg,'error');

                                } else{

                                    this.showMyToast('Agenda was successfully removed.','success');
                                    let childMeetingConsole_Agenda = cmp.find('childMeetingConsole_Agenda');
                                    childMeetingConsole_Agenda.reload({data:returnedData});
                                }

                        }
                        else if(state=="ERROR"){

                            throw res.getError();
                        }


                }
            catch(e){

                    this.showMyToast(e[0].message,'error');
                }

                })
                $A.enqueueAction(action);
            }
            else {
                this.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
            }
        }
        catch(e){

            this.showMyToast(e.message,'error');
        }
    },
    viewNbac:function(data,cmp){

        cmp.set('v.isLoading', true);

        setTimeout(function () {
            cmp.set('v.isLoading', false);
        }, 1000)

        cmp.set('v.nbacName',data['Related_NBAC__r.Group_Parent_Client_Name__c'])
        cmp.set('v.nbacdata', data);
        cmp.set('v.isNbacDetails', true);
        let recordId = cmp.get('v.recordId');
        let childMeetingConsole_Task = cmp.find('childMeetingConsole_Task');
        let childMeetingConsole_SubmissionAttendees = cmp.find('childMeetingConsole_SubmissionAttendees');
        let childMeetingConsole_Attachment = cmp.find('childMeetingConsole_Attachment');
        childMeetingConsole_Task.dataTableMethodTask({
            nbacId: data['NBAC_Id__c'],
            gpClientName: data['Related_NBAC__r.Group_Parent_Client_Name__c']
        });
        childMeetingConsole_Attachment.dataTableMethodAttachment({nbacId: data['NBAC_Id__c'],eventId:recordId});
        childMeetingConsole_SubmissionAttendees.dataTableMethodSubmissionAttendees({agendaId: data['Id'],nbacId:data['NBAC_Id__c'],ERrecordId:recordId});
    },
    editTask:function(data,cmp){
        let childMeetingConsole_Task = cmp.find('childMeetingConsole_Task');

        childMeetingConsole_Task.dataTableMethodEditTask({taskId:data['Id']});
    },
    viewTask:function (data,cmp) {
        let childMeetingConsole_Task = cmp.find('childMeetingConsole_Task');

        childMeetingConsole_Task.dataTableMethodViewTask({taskId:data['Id']});
    },
    showMyToast : function(message, type) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'sticky',
            message: message,
            type:type//which can be 'error', 'warning', 'success', or 'info'.

        });
        toastEvent.fire();
    },
    getHasAccess:function (cmp,event) {

        let action = cmp.get('c.hasAccessToMeeting');
        let recordId = cmp.get('v.recordId')!=undefined ?cmp.get('v.recordId'):'';
        action.setParams({ERID:recordId});
        action.setCallback(this,function (res){
            cmp.set('v.isLoadingMain', false);
            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();

                    cmp.set('v.access',returnedData)
                    let childMeetingConsole_Comm = cmp.find('childMeetingConsole_Comm');
                    let childMeetingConsole_Agenda = cmp.find('childMeetingConsole_Agenda');
                    let childMeetingConsole_Task = cmp.find('childMeetingConsole_Task');
                    let childMeetingConsole_Attachment = cmp.find('childMeetingConsole_Attachment');
                    let childMeetingConsole_SubmissionAttendees = cmp.find('childMeetingConsole_SubmissionAttendees');
                    childMeetingConsole_Comm.userHasAccess({data:returnedData});
                    childMeetingConsole_Agenda.userHasAccess({data:returnedData});
                    childMeetingConsole_Task.userHasAccess({data:returnedData});
                    childMeetingConsole_Attachment.userHasAccess({data:returnedData});
                    childMeetingConsole_SubmissionAttendees.userHasAccess({data:returnedData});
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                this.showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);
    },
    getAgendaSize:function (cmp,event) {

            Promise.all([
                UTL.promise(cmp.get("c.getAgendaList"), {eventReport: cmp.get('v.recordId')}),
                UTL.promise(cmp.get("c.getAgendaListforNothing"), {eventReport: cmp.get('v.recordId')})
            ]).then(
                    $A.getCallback(function (result) {
                        let len = result[0].length + result[1].length;
                        cmp.set('v.agendaSize', len);
                    }),
                    $A.getCallback(function (error) {
                        cmp.set('v.agendaSize', 0);
                    })
                )
    },
    goBack:function () {
        let homeEvent = $A.get("e.force:navigateToList");
        homeEvent.setParams({
            "scope": "Call_Report__c"
        });
        homeEvent.fire();
    }
});