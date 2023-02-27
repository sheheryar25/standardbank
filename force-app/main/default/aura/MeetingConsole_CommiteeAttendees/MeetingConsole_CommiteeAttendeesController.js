/**
 * Created by Emmanuel Nocks on 2019/11/21.
 */

({

    init: function (cmp, event, helper) {
        cmp.set('v.columns', [
            { label: 'Attendee Name', fieldName: 'Contact_id__r.Name', type: 'text' },
            { label: 'Status', fieldName: 'Status__c', type: 'text' }
        ]);

       helper.getCallReportAttendees(cmp,event);
       helper.getCommitteeAttendeesStatusOptions(cmp,event);
    }
    ,
    clickToSave: function (cmp, event, helper) {


        let commAttendeeList = JSON.stringify(cmp.get('v.committeeList'));
        cmp.set('v.isLoading' , true);
        let currentERId = cmp.get('v.ERrecordId');
        let action =  cmp.get('c.saveCommitteAttendee');
        action.setParams({commAttendeeList:commAttendeeList,currentERId:currentERId});
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


                            helper.getCallReportAttendees(cmp,event);
                            cmp.set('v.isEditMode' , false);
                        }
                    }
                    else {

                        cmp.set('v.committeeList', JsonObj);
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
    onCheckBoxChange:function(cmp,event,helper){

        let committeeList = JSON.parse(JSON.stringify(cmp.get('v.committeeList')));

            for( var i = 0; i < committeeList.length; i++){
                    if(event.target.id==committeeList[i].sobjAttendee.Contact_id__c){

                         if(committeeList[i].bChecked){

                             committeeList[i].bChecked = false;
                         }
                         else{

                             committeeList[i].bChecked = true;
                         }
                    }

        }

    },
    clickToEdit: function (cmp, event, helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {
            cmp.set('v.isEditMode', true);
            cmp.set('v.isLoading', true);
            let currentERId = cmp.get('v.ERrecordId');
            let action = cmp.get('c.showinternalattendeeAura');
            action.setParams({currentERId: currentERId});
            action.setCallback(this, function (res) {

                try {

                    let state = res.getState();
                    cmp.set('v.isLoading', false);
                    if (state == "SUCCESS") {

                        let returnedData = res.getReturnValue();
                        cmp.set('v.committeeList', JSON.parse(returnedData));

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
    onChangeCommitteeAttendeesStatusOptions:function (cmp,event,helper) {

        let e = document.getElementById(event.target.id);
        let selectedValue = e.options[e.selectedIndex].value;

        let commList = cmp.get('v.committeeList');
        commList[event.target.id].sobjAttendee.Status__c = selectedValue;
        cmp.set('v.committeeList',commList);

    }
,
    addRow:function (cmp,event,helper) {

        let action =  cmp.get('c.addRowAura');
        let currentERId = cmp.get('v.ERrecordId');
        action.setParams({currentERId:currentERId});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let commList = cmp.get('v.committeeList');
                    let newCommittee = JSON.parse(returnedData);
                    commList.push(newCommittee);
                    cmp.set('v.committeeList',commList);
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
    userHasAccess:function (cmp,event,helper) {
        let tempData = event.getParam("arguments");
        let data =tempData.perm.data;
        cmp.set('v.access',data);
    }
    ,
    clickToCancel:function (cmp,event,helper) {

        cmp.set('v.isEditMode' , false);
        helper.getCallReportAttendees(cmp,event);
        helper.getCommitteeAttendeesStatusOptions(cmp,event);
    }
});