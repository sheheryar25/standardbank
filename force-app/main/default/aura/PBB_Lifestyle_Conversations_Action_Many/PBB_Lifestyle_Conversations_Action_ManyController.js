({
    init:function(cmp,event,helper){
        helper.loadData(cmp);
    },
    saveRecord:function (cmp,event,helper) {
        let convId = event.target.dataset.id;
        let recordData = cmp.get('v.recordData');
        cmp.set('v.currentSavedId',convId);
        let record = recordData.find(y => {
            return y.Id == convId
        });
        
        helper.saveRecordData(cmp,record);
    }
    ,
    handleComponentEvent: function(cmp, event) {
        let eventData = JSON.parse(JSON.stringify(event.getParam("data")));
        let recordData = cmp.get('v.recordData');
        let record = recordData.find(y => {
            return y.Id == eventData.recId
        });
        if(eventData.fieldName == 'Response'){
            record.Reason__c = '';
            cmp.set('v.recordData',recordData);
        } 
    },
})