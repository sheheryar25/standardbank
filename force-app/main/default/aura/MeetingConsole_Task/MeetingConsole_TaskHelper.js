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
},
    getTaskList:function (cmp,event) {

        try{

            let action =  cmp.get("c.getTasksList");
            action.setParams({opptyId:cmp.get('v.nbacId'),gpClientName:cmp.get('v.gpClientName')})
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

            this.showMyToast(e.message,"error");
        }
    }
});