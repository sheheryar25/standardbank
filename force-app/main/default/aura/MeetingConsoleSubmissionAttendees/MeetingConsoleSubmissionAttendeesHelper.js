/**
 * Created by Chibuye Kunda on 2019/12/30.
 */

({

    getSubmissionAttendeesStatusOptions:function (cmp,event) {

        let action = cmp.get('c.getSubmissionAttendeesStatusOptions');
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

                    cmp.set('v.submissionAttendeesStatusOptions',optionLabel);

                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){

                showMyToast(e.message,'error');
            }


        })
        $A.enqueueAction(action);

    },
    getListOfAttendees:function (cmp ,agendaId) {


        try{

            let action =  cmp.get("c.getListOfAttendees");
            action.setParams({agendaId:agendaId})
            action.setCallback(this,function (res){


                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();

                    let childComponent = cmp.find('child');
                    childComponent.dataTableMethod(returnedData);
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            })
            $A.enqueueAction(action);

        }
        catch(e){

            this.showMyToast(e.message,'error');
        }


    },
    insertsubattendees:function (cmp) {


        try{
            let access = JSON.parse(cmp.get('v.access'));


           let agendaId= cmp.get('v.agendaId');
           let ERID = cmp.get('v.ERrecordId');
           let nbacID=  cmp.get('v.nbacId');
           let action =  cmp.get('c.insertsubattendees');
            action.setParams({nbacID:nbacID,agendaId:agendaId,ERID:ERID,hasAccess:access.hasAccess})
            action.setCallback(this,function (res){

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    returnedData= JSON.parse(returnedData);
                    this.getListOfAttendees(cmp ,agendaId)

                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            })
            $A.enqueueAction(action);

        }
        catch(e){
            console.log(e);
            this.showMyToast(e.message,'error');
        }


    }
    ,
    add_4_RowAura:function (cmp,event) {
        let currentERIdsub = cmp.get('v.ERrecordId');
        let currentAgendaIdsub = cmp.get('v.agendaId');
        let action =  cmp.get("c.add_4_RowAura");
        action.setParams({currentERIdsub:currentERIdsub,currentAgendaIdsub:currentAgendaIdsub});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let submissionList = cmp.get('v.submissionList');
                    let newSubmissionlist = JSON.parse(returnedData);
                    for(let newSubmissionIndex in newSubmissionlist){

                        submissionList.push(newSubmissionlist[newSubmissionIndex]); // 4 empty rows
                    }

                    cmp.set('v.submissionList',submissionList);
                }
                else if(state=="ERROR"){

                    throw res.getError();
                }

            }
            catch(e){
                console.log(e)
                this.showMyToast(e.message,'error');
            }
        })
        $A.enqueueAction(action);

    }
    ,
    showMyToast : function(message, type) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'sticky',
            message: message,
            type:type//which can be 'error', 'warning', 'success', or 'info'.

        });
        toastEvent.fire();
    }
});