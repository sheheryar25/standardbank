({
	cancel : function(cmp,event, helper) {
		   
		helper.closeTab(cmp);
	}, 
    init:function(cmp,event,helper){
        helper.loadData(cmp);
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
    saveRecord:function(cmp,event,helper) {
        helper.saveRecord(cmp);
    }
    
})