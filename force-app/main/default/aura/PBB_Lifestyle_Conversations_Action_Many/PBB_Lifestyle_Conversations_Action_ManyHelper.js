({
    showMyToast : function(cmp,message, type) {
        cmp.find('notifLib').showToast({
            "variant":type,
            "message": message
        });
        
    },
    handleError:function(cmp,errors,type){
        if(errors){
            
            if(errors[0]&&errors[0].message){
                this.showMyToast(cmp,errors[0].message ,type);
            }
        }
        else {
            this.showMyToast(cmp,'Unknown error has occurred, please contact system administrator' ,type);
        }
    },
    loadData: function(cmp) {
        
        cmp.set("v.isLoading",true);
        let current = this;
        Promise.all([
            UTL.promise(cmp.get("c.getCategoryFieldValue")),
            UTL.promise(cmp.get("c.getArrangedDependancies")),
            UTL.promise(cmp.get("c.getConversations"),{clientId:cmp.get('v.clientId')})
        ])
        .then(
            $A.getCallback(function(result) {
                let res1 = result[0]; 
                let res2 = result[1];
                let res3 = result[2];

                cmp.set("v.respMap",res2.resp);
                cmp.set("v.reasMap",res2.reas);
                cmp.set("v.isLoading",false);
                let recordData = res3;
                let respMap = cmp.get('v.respMap');
                let reasMap = cmp.get('v.reasMap');
                for(let x in recordData){              
                    recordData[x].resplist = respMap[recordData[x].Subcategory__c];
                    recordData[x].reaslist = reasMap[recordData[x].Response__c];
                    recordData[x].reasMap = reasMap;
                    recordData[x].isInValidResp = false;
                    recordData[x].isInValidReas = false;
                    recordData[x].isInValidComment = false;
                    
                }
                
                cmp.set('v.recordData',recordData);
            }),
            $A.getCallback(function(error) {
                cmp.set("v.isLoading",false);
                current.showMyToast(cmp,UTL.getErrorMessage(error),'error');
            })
        )
    },
        validateData:function(cmp,recordData){
            
            if(recordData.Comments__c){
                recordData.isInValidComment= false;
            }else{
                recordData.isInValidComment = true;
            }

            if(recordData.Reason__c){
                recordData.isInValidReas = false;
            }else{
                recordData.isInValidReas = true;
            }

            if(recordData.Response__c){
                recordData.isInValidResp =false;
            }else{
                recordData.isInValidResp =true;
            }
            let recordDataList = cmp.get('v.recordData');
            
            recordDataList.find(y => {
                if(y.Id == recordData.Id){
                y.isInValidResp = recordData.isInValidResp;
                y.isInValidReas = recordData.isInValidReas;
                y.isInValidComment = recordData.isInValidComment;
            }
                                });
            cmp.set('v.recordData',recordDataList);
            return (recordData.isInValidResp||recordData.isInValidReas||recordData.isInValidComment);
    },
    saveRecordData:function (cmp,recordData) {
        
        
        cmp.set("v.isLoading",true);
        if(this.validateData(cmp,recordData)){
            cmp.set("v.isLoading",false);
            return;
        }
               
        delete recordData.resplist;
        delete recordData.reaslist;
        delete recordData.reasMap;
        delete recordData.isInValidResp;
        delete recordData.isInValidReas;
        delete recordData.isInValidComment;
        let action = cmp.get("c.saveData");
        action.setParams({conv:recordData});
        
        action.setCallback(this,function (res) {
            
            let state = res.getState();
            if(state==="SUCCESS"){
               this.showMyToast(cmp,'Successfully saved.' ,'success');
               this.loadData(cmp);
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                cmp.set("v.isLoading",false);
            }
                else if(state==="ERROR"){
                    
                    let errors = res.getError();
                    this.loadData(cmp)
                    this.handleError(cmp,errors,'error');
                }
        });
        
        $A.enqueueAction(action);
        },
})