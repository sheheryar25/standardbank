/**
 * Created by Chibuye Kunda on 2019/12/09.
 */

({

    getCommitteeAttendeesStatusOptions:function (cmp,event) {

        let action = cmp.get('c.getCommitteeAttendeesStatusOptions');
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

                    cmp.set('v.CommitteeAttendeesStatusOptions',optionLabel);

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
    getCallReportAttendees:function (cmp,event) {

        let currentERId = cmp.get('v.ERrecordId');
        let action =  cmp.get('c.getCallReportAttendees');
        action.setParams({currentERId:currentERId});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let childComponent = cmp.find('child');
                    console.log(returnedData)
                    childComponent.dataTableMethod(returnedData);
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

    }
    ,
    addRow:function (cmp,event) {

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

                this.showMyToast(e.message,'error');
            }
        })
        $A.enqueueAction(action);

    },
    add_4_RowAura:function (cmp,event) {
        let currentERId = cmp.get('v.ERrecordId');
        let action =  cmp.get("c.add_4_RowAura");
        action.setParams({currentERId:currentERId});
        action.setCallback(this,function (res){

            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let committeeList = cmp.get('v.committeeList');
                    let newcommitteeList = JSON.parse(returnedData);
                    for(let newComIndex in newcommitteeList){

                        committeeList.push(newcommitteeList[newComIndex]); // 4 empty rows
                    }

                    cmp.set('v.committeeList',committeeList);
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