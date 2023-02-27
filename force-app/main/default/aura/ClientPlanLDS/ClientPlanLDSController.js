({
    doInit: function(component, event, helper) {
        var self = this;
        var recordId = component.get('v.recordId');
        var getRecord = component.get('c.getRecord');

        getRecord.setParam('recordId', recordId);
        getRecord.setCallback(self, function(result) {
            if (component.isValid()) {
                component.set('v.record', result.getReturnValue());
            }
        });

        $A.enqueueAction(getRecord);
    },
	opnclientplanlds : function(component, event, helper) {
        var record = component.get('v.recordId');
		window.open('/apex/ClientPlan?scontrolCaching=1&Lightning=true&Id='+record,'CPLDS','height=700,width=1000,resizable=yes,scrollbars=1');
	}
})