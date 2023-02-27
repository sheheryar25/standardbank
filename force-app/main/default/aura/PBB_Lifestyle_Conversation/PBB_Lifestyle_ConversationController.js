({
    init:function(cmp,event,helper){
        helper.loadData(cmp);
    },
    handleEditRecord:function (cmp,event,helper) {
        if (cmp.get('v.readOnly')) {
             cmp.set('v.readOnly', false);
        }
    },
    getRecordData: function (cmp,event,helper) {
        helper.getRecord(cmp);
    },
    cancelEditRecord:function (cmp,event,helper) {
        helper.cancelEditRecord(cmp);
    },
    handleComponentEvent : function(cmp, event, helper) {
        let eventData = JSON.parse(JSON.stringify(event.getParam("data")));
        let recordData = cmp.get('v.recordData');
        if(eventData.fieldName === 'Sub-Category'){
            recordData.Reason__c = '';
            recordData.Response__c = '';
            cmp.set('v.recordData',recordData);
        }
        else if(eventData.fieldName  === 'Response'){
            recordData.Reason__c = '';
            cmp.set('v.recordData',recordData);             
        }  
    },
    saveRecord:function(cmp, event, helper) {
        helper.saveRecordData(cmp);
    },
    toggleRelated:function(cmp, event, helper) {
        let isRelatedTo = cmp.get('v.isRelatedTo');
        cmp.set('v.isRelatedTo',isRelatedTo?false:true);
        let relatedTo  = cmp.find('relatedTo');
        $A.util.toggleClass(relatedTo, 'hide');
    },
    toggleInfo:function(cmp, event, helper) {
        let isInfo = cmp.get('v.isInfo');
        cmp.set('v.isInfo',isInfo?false:true);
        let info  = cmp.find('Info');
        $A.util.toggleClass(info, 'hide');
    }
})