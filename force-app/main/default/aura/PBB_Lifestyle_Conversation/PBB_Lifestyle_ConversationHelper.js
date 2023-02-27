({
    showMyToast : function(cmp,message, type) {
        cmp.find('notifLib').showToast({
            "variant":type,
            "message": message
        });
        
    },
    handleError:function(cmp,errors,type){
        if(errors && errors[0]&&errors[0].message){
            
            this.showMyToast(cmp,errors[0].message ,type);
            
        }
        else {
            this.showMyToast(cmp,'Unknown error has occurred, please contact system administrator' ,type);
        }
    },
    validateData:function(cmp,data){
        let requiredFields = cmp.get('v.requiredFields');
        if(data.Name){
            requiredFields[0] = false;
        }else{
            requiredFields[0] = true;
        }
        if(data.Subcategory__c && data.Response__c){
            
            requiredFields[3] = false;
            
        }else{
            requiredFields[3] = true;
        }
         if(data.Subcategory__c && data.Reason__c){
            
            requiredFields[5] = false;
            
        }else{
            requiredFields[5] = true;
        }
         if(data.Comments__c){
            requiredFields[7] = false;
        }else{
            requiredFields[7] = true;
        }
        if(data.Client__c){
            requiredFields[9] = false;
        }else{
            requiredFields[9] = true;
        }
        cmp.set('v.requiredFields',requiredFields);
        for(let index in requiredFields){
            if(requiredFields[index]){
                return true
            }
        }
        return false;
    },
    saveRecordData:function (cmp) {
        cmp.set("v.isLoading",true);
        let recordData = cmp.get('v.recordData')
        if(recordData.PBB_HighValueCD__c){
            recordData.PBB_HighValueCD__c = recordData.PBB_HighValueCD__c==='Yes' ?'Y':'N';
        }
        if(this.validateData(cmp,recordData)){
            cmp.set("v.isLoading",false);
            return;
        }
        let action = cmp.get("c.saveData");
        action.setParams({conv:recordData});
        
        action.setCallback(this,function (res) {
            
            let state = res.getState();
            if(state==="SUCCESS"){
                
                if(recordData.PBB_HighValueCD__c){
                    recordData.PBB_HighValueCD__c = recordData.PBB_HighValueCD__c==='Y' ?'Yes':'No';
                }
                this.cancelEditRecord(cmp);
                this.showMyToast(cmp,'Successfully saved.' ,'success');
                
            }
            else if(state==="INCOMPLETE"){
                this.cancelEditRecord(cmp);
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                cmp.set("v.isLoading",false);
            }
            else if(state==="ERROR"){
                
                let errors = res.getError();
                this.handleError(cmp,errors,'error');
                this.cancelEditRecord(cmp);
                cmp.set("v.isLoading",false);
            }
        });
        
        $A.enqueueAction(action);
    },
    getRecord:function (cmp) {
        let action = cmp.get("c.getRecord");
        action.setParams({recId:cmp.get('v.recordId')});
        
        action.setCallback(this,function (res) {
            
            let state = res.getState();
            if(state==="SUCCESS"){
                let recordData = res.getReturnValue();
                if(recordData.PBB_HighValueCD__c){
                    recordData.PBB_HighValueCD__c = recordData.PBB_HighValueCD__c==='Y' ?'Yes':'No';
                }
                cmp.set('v.recordData',recordData);
                cmp.set("v.isLoading",false);
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                cmp.set("v.isLoading",false);
            }
            else if(state==="ERROR"){
                
                let errors = res.getError();
                this.handleError(cmp,errors,'error');
                cmp.set("v.isLoading",false);
            }
        });
        
        $A.enqueueAction(action);
    },
    cancelEditRecord:function (cmp) {
        
        cmp.set('v.readOnly', true);
        this.getRecord(cmp);
    },
    getSmart2Data:function(cmp,data){
        
        let retValcat = data.subCat;
        let catOpts = retValcat.map(opt => ({ value: opt, label: opt }));               
        cmp.set("v.subCatlist",catOpts);
        cmp.set("v.respMap",data.resp);
        cmp.set("v.reasMap",data.reas);      
        
    },
    loadData: function(cmp) {
        cmp.set("v.isLoading",true);
        let current = this;
        let res0;
        let res1;
        let res2;
        let res3;
        let catFieldMap;
        let highValueFieldMap;
        Promise.all([
            UTL.promise(cmp.get("c.getHighValueFieldValue")),
            UTL.promise(cmp.get("c.getCategoryFieldValue")),
            UTL.promise(cmp.get("c.getArrangedDependancies")),
            UTL.promise(cmp.get("c.getRecord"),{recId:cmp.get('v.recordId')})
        ])
        .then(
            $A.getCallback(function(result) {
                if(result.length === 4){
                    catFieldMap = [];
                    highValueFieldMap = []
                    res0 = result[0];
                    res1 = result[1]; 
                    res2 = result[2];
                    res3 = result[3];

                } 
                res3.PBB_HighValueCD__c = res3.PBB_HighValueCD__c==='Y' ?'Yes':'No';
                current.getSmart2Data(cmp,res2);
                for(let key in res1){
                    catFieldMap.push({value: key, label: res1[key]});
                }
                for(let key in res0){
                    highValueFieldMap.push({value: key, label: res0[key]});
                }
                cmp.set('v.recordData',res3);
                cmp.set('v.catFieldMap',catFieldMap);
                cmp.set('v.highValueFieldMap',highValueFieldMap);
                cmp.set("v.isLoading",false);
                let recordData = cmp.get('v.recordData');
                let respMap = cmp.get('v.respMap');
                cmp.set('v.resplist',respMap[recordData.Subcategory__c]);
                let reasMap = cmp.get('v.reasMap');
                cmp.set('v.reaslist',reasMap[recordData.Response__c]);
            }),
            $A.getCallback(function(error) {
                cmp.set("v.isLoading",false);
                current.showMyToast(cmp,UTL.getErrorMessage(error),'error');
            })
            )
        },
    })