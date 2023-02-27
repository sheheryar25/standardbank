({
    closeTab: function(cmp){
        let workspaceAPI = cmp.find("workspace");
        let current = this;
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            let focusedTabId = response.tabId;
            
            workspaceAPI.closeTab({tabId: focusedTabId});
            
        })
        .catch(function(error) {
            current.handleError(cmp,error,'error');
        }); 
    },
    setTabModalId:function(cmp){

        let workspaceAPI = cmp.find("workspace");
        let current = this;
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            let focusedTabId = response.tabId;           
            cmp.set('v.modalTabId',focusedTabId);          
        })
        .catch(function(error) {
            current.handleError(cmp,error,'error');
        });
    },
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
    validateData:function(cmp,data){
        let requiredFields = cmp.get('v.requiredFields');
        if(data.Name){
            requiredFields[0] = false;
        }else{
            requiredFields[0] = true;
        }
        if(data.Subcategory__c){
            if(data.Response__c){
                requiredFields[3] = false;
                if(data.Reason__c){
                    requiredFields[5] = false;
                }else{
                    requiredFields[5] = true;
                }
            }else{
                requiredFields[3] = true;
            }  
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
    saveRecord:function (cmp) {
        cmp.set("v.isLoading",true);
        let recordData = cmp.get('v.recordData');
        if(recordData.PBB_HighValueCD__c){
            recordData.PBB_HighValueCD__c = recordData.PBB_HighValueCD__c=='Yes' ?'Y':'N';
        }
        if(this.validateData(cmp,recordData)){
            cmp.set("v.isLoading",false);
            return;
        }
        let action = cmp.get("c.createNewConversation");
        action.setParams({conv:recordData});
        
        action.setCallback(this,function (res) {
            
            let state = res.getState();
            if(state==="SUCCESS"){
                let recordId = res.getReturnValue();
                this.goToRecord(cmp,recordId);
                this.showMyToast(cmp,'Successfully saved.' ,'success');
                
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
    getRecord:function (cmp) {
        
        let action = cmp.get("c.getRecord");
        action.setParams({recId:cmp.get('v.recordId')});
        
        action.setCallback(this,function (res) {
            
            let state = res.getState();
            if(state==="SUCCESS"){
                let recordData = res.getReturnValue();
                if(recordData.PBB_HighValueCD__c){
                    recordData.PBB_HighValueCD__c = recordData.PBB_HighValueCD__c=='Y' ?'Yes':'No';
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
        Promise.all([
            UTL.promise(cmp.get("c.getHighValueFieldValue")),
            UTL.promise(cmp.get("c.getCategoryFieldValue")),
            UTL.promise(cmp.get("c.getArrangedDependancies")),
            UTL.promise(cmp.get("c.newConversation"),{clientId:cmp.get('v.clientId')})
        ])
        .then(
            $A.getCallback(function(result) {
                let catFieldMap = [];
                let highValueFieldMap = []
                let res0 = result[0];
                let res1 = result[1]; 
                let res2 = result[2];
                current.getSmart2Data(cmp,res2);
                for(let key in res1){
                    catFieldMap.push({value: key, label: res1[key]});
                }
                for(let key in res0){
                    highValueFieldMap.push({value: key, label: res0[key]});
                }
                cmp.set('v.recordData',result[3]);
                cmp.set('v.catFieldMap',catFieldMap);
                cmp.set('v.highValueFieldMap',highValueFieldMap);
                cmp.set("v.isLoading",false);
            }),
            $A.getCallback(function(error) {
                cmp.set("v.isLoading",false);
                current.showMyToast(cmp,UTL.getErrorMessage(error),'error');
            })
        )
    },
    goToRecord : function (cmp,recordId) {
        let workspaceAPI = cmp.find("workspace");
        workspaceAPI.openTab({
            pageReference: {
                "type": "standard__recordPage",
                "attributes": {
                    "recordId":recordId,
                    "actionName":"view"
                },
                "state": {}
            },
            focus: true
        }).then(function() {
            workspaceAPI.closeTab({tabId: cmp.get('v.modalTabId')});
        }).catch(function(error) {
        });
    }
    
})