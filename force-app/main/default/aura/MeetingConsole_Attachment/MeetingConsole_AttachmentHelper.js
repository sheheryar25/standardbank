/**
 * Created by Chibuye Kunda on 2019/12/19.
 */

({
    showMyToast: function(message, type) {
    let toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        mode: 'sticky',
        message: message,
        type:type//which can be 'error', 'warning', 'success', or 'info'.

    });
    toastEvent.fire();

},
    getListOfAttachments:function(cmp,event){

        try{

            let nbacId = cmp.get('v.nbacId');
            let action =  cmp.get("c.getListOfAttachments");
            action.setParams({nbacId:nbacId})
            action.setCallback(this,function (res){

                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    let childComponent = cmp.find('child');
                    let conVersion = [];
                    let attachList = [];
                    for(let i in returnedData['conVersion']){
                       let tempMerge = Object.assign({},returnedData['conVersion'][i],
                                            {Name:returnedData['conVersion'][i].Title});
                        tempMerge.Id = 'sfc/servlet.shepherd/version/download/'+tempMerge.Id;
                        conVersion.push(tempMerge);
                    }
                    for(let i in returnedData['attachList']){

                        returnedData['attachList'][i].Id = 'servlet/servlet.FileDownload?file='+returnedData['attachList'][i].Id;
                        attachList.push(returnedData['attachList'][i]);
                    }
                    let mergedData = conVersion.concat(attachList);
                    childComponent.dataTableMethod(mergedData);
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
    }
    ,
    uploadFile:function(cmp,event,contentDocument){
        cmp.set('v.isWaiting',true);
        try{
            let nbacId = cmp.get('v.nbacId');
            let action =  cmp.get("c.uploadAura");
            action.setParams({nbacId:nbacId,ContentDocumentId:contentDocument.documentId})
            action.setCallback(this,function (res){
                cmp.set('v.isWaiting',false);
                let state = res.getState();

                if(state=="SUCCESS") {

                    let returnedData = res.getReturnValue();
                    returnedData = JSON.parse(JSON.stringify(returnedData));
                    if(!returnedData.isError) {
                        this.showMyToast('Document "' + contentDocument.name + '" was uploaded', 'success');
                        this.getListOfAttachments(cmp,event);
                    }
                    else{

                        this.showMyToast('Document "' + contentDocument.name + '" was not uploaded', 'error');
                    }

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
});