({
    init:function(cmp,event,helper){
        let pageRef = cmp.get("v.pageReference");
        let state = pageRef.state; 
        let base64Context = state.inContextOfRef;
        
        if (base64Context.startsWith("1\.")) {
            base64Context = base64Context.substring(2);
        }
        let addressableContext = JSON.parse(window.atob(base64Context));
        cmp.set('v.clientId',addressableContext.attributes.recordId);
        helper.loadData(cmp);
        helper.setTabModalId(cmp);
    },
    saveRecord:function(cmp,event, helper) {
        helper.saveRecord(cmp);
    },
    handleComponentEvent : function(cmp, event,helper) {
        let eventData = JSON.parse(JSON.stringify(event.getParam("data")));
        let recordData = cmp.get('v.recordData');
        if(eventData.fieldName == 'Sub-Category'){
            recordData.Reason__c = '';
            recordData.Response__c = '';
            cmp.set('v.recordData',recordData);
        }
        else if(eventData.fieldName  == 'Response'){
            recordData.Reason__c = '';
            cmp.set('v.recordData',recordData);
            
        }
        
    },
    cancel : function(cmp,event, helper) {
        
        helper.closeTab(cmp);
    }, 
})