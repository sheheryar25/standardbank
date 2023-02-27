/**
 * Created by Chibuye Kunda on 2019/11/25.
 */

({

    init: function (cmp, event, helper) {

        cmp.set('v.lookUps',[]);

        cmp.set('v.columns', [
            { label: 'Attendee Name', fieldName: 'Contact_id__r.Name', type: 'text'},
            { label: 'Status', fieldName: 'Status__c', type: 'text'}
        ]);
        helper.getSubmissionAttendeesStatusOptions(cmp,event);
    },
    onLookupChange: function (cmp,event) {
        let submissionList = JSON.parse(JSON.stringify(cmp.get('v.submissionList')));
        console.log(submissionList)

    }
    ,
    onChangeSubmissionAttendeesStatusOptions:function (cmp,event,helper) {

        let e = document.getElementById(event.target.id);
        let selectedValue = e.options[e.selectedIndex].value;

        let subList = cmp.get('v.submissionList');
        subList[event.target.id].sobjAttendee.Status__c = selectedValue;
        cmp.set('v.submissionList',subList);

    }
    ,
    onCheckBoxChange:function(cmp,event,helper){

        let submissionList = JSON.parse(JSON.stringify(cmp.get('v.submissionList')));

        for( var i = 0; i < submissionList.length; i++){


            // committeeList.splice(i, 1);

            if(event.target.id==submissionList[i].sobjAttendee.Contact_id__c){

                if(submissionList[i].bChecked){

                    submissionList[i].bChecked = false;
                }
                else{

                    submissionList[i].bChecked = true;
                }
            }

        }

    },
    clickToEdit: function (cmp, event, helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {

            cmp.set('v.isEditMode', true);
            cmp.set('v.isLoading', true);
            let currentERIdsub = cmp.get('v.ERrecordId');
            let currentAgendaIdsub = cmp.get('v.agendaId');
            let action = cmp.get('c.showinternalattendeesub');
            action.setParams({currentERIdsub: currentERIdsub, currentAgendaIdsub: currentAgendaIdsub});
            action.setCallback(this, function (res) {

                try {

                    let state = res.getState();
                    cmp.set('v.isLoading', false);
                    if (state == "SUCCESS") {

                        let returnedData = res.getReturnValue();
                        console.log(JSON.parse(returnedData))
                        cmp.set('v.submissionList', JSON.parse(returnedData));
                        helper.add_4_RowAura(cmp, event);
                    } else if (state == "ERROR") {

                        throw res.getError();
                    }

                } catch (e) {

                    helper.showMyToast(e.message, 'error');
                }


            })
            $A.enqueueAction(action);
        }
        else {

            helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    addRow:function (cmp,event,helper) {
        let currentERIdsub = cmp.get('v.ERrecordId');
        let currentAgendaIdsub = cmp.get('v.agendaId');
        let action =  cmp.get("c.addRowAura");
        action.setParams({currentERIdsub:currentERIdsub,currentAgendaIdsub:currentAgendaIdsub});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let submissionList = cmp.get('v.submissionList');
                    let newSubmission = JSON.parse(returnedData);

                    submissionList.push(newSubmission);
                    cmp.set('v.submissionList',submissionList);
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){
                helper.showMyToast(e.message,'error');
            }
        })
        $A.enqueueAction(action);

    }
    ,
    clickToSave: function (cmp, event, helper) {

        let currentERIdsub = cmp.get('v.ERrecordId');
        let currentAgendaIdsub = cmp.get('v.agendaId');
        let submissionList = JSON.stringify(cmp.get('v.submissionList'));

        cmp.set('v.isLoading' , true);
        let action =  cmp.get("c.saveSubmissionAttendee");
        action.setParams({currentERIdsub:currentERIdsub,submissionList:submissionList});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();
                cmp.set('v.isLoading' , false);
                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let JsonObj =  JSON.parse(returnedData);

                    if(JsonObj.isError!=undefined) {

                        if (JsonObj.isError) {

                            throw JsonObj.msg;

                        } else{


                            helper.getListOfAttendees(cmp,currentAgendaIdsub);
                            cmp.set('v.isEditMode' , false);
                        }
                    }
                    else {

                        cmp.set('v.submissionList', JsonObj);
                    }


                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){
                helper.showMyToast(e.message,'error');
            }


        })

        $A.enqueueAction(action);

    },
    dataTableMethodSubmissionAttendees : function(cmp, event, helper) {
        let tempData = event.getParam("arguments");
        let agendaId =tempData.nbacdata.agendaId;
        let ERrecordId = tempData.nbacdata.ERrecordId;
        let nbacId = tempData.nbacdata.nbacId
        cmp.set('v.agendaId',agendaId);
        cmp.set('v.ERrecordId',ERrecordId);
        cmp.set('v.nbacId',nbacId)
        helper.insertsubattendees(cmp);
    },
    clickToCancel:function (cmp,event,helper) {
        let currentAgendaIdsub = cmp.get('v.agendaId');
        cmp.set('v.isEditMode' , false);
        helper.getListOfAttendees(cmp,currentAgendaIdsub);
    },
    userHasAccess:function (cmp,event,helper) {
        let tempData = event.getParam("arguments");
        let data =tempData.perm.data;
        cmp.set('v.access',data);
    }
    ,
});