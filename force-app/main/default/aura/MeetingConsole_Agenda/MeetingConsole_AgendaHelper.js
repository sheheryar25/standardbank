/**
 * Created by Chibuye Kunda on 2019/12/19.
 */

({

    showMyToast : function(message, type) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'sticky',
            message: message,
            type:type//which can be 'error', 'warning', 'success', or 'info'.

        });
        toastEvent.fire();
    }
    ,
    getAgendaList:function (cmp,event) {
        let action =  cmp.get('c.getAgendaList');
        cmp.set('v.isLoading', true);
        action.setParams({eventReport:cmp.get('v.ERrecordId')});
        action.setCallback(this,function (res){
            cmp.set('v.isLoading', false);
            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let childComponent = cmp.find('child');

                    if(returnedData.length>0) {

                        childComponent.dataTableMethod(returnedData);
                    }
                else {
                        childComponent.dataTableMethod([]);
                    }
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
    getAgendaListforNothing:function (cmp,event) {
        let action =  cmp.get('c.getAgendaListforNothing');
        cmp.set('v.isLoading', true);
        action.setParams({eventReport:cmp.get('v.ERrecordId')});
        action.setCallback(this,function (res){
            cmp.set('v.isLoading', false);
            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let childComponent = cmp.find('child1');

                    if(returnedData.length>0) {

                        childComponent.dataTableMethod(returnedData);
                    }
                    else {
                        childComponent.dataTableMethod([]);
                    }
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
    createagendarecords:function (cmp,event) {
        let action =  cmp.get('c.createagendarecordsAura');
        cmp.set('v.isLoading', true);
        action.setParams({evntId:cmp.get('v.ERrecordId')});
        action.setCallback(this,function (res){
            cmp.set('v.isLoading', false);
            try {

                let state = res.getState();

                if(state=="SUCCESS") {

                    console.log(res.getReturnValue());
                    this.getAgendaList(cmp,event);

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
});