({
	checkredtxper: function(component) {
        var self = this;
        var recordId = component.get('v.recordId');
        var action = component.get('c.checkpermission');

        action.setParam('recordId', recordId);
        action.setCallback(self, function(result) {
            if (component.isValid()) {
                if (result.getReturnValue()) {
                    component.set('v.isLoading', false);
                    alert('Insufficient Privileges, Please contact the opportunity owner.');
                    var urlEvent = $A.get("e.force:navigateToURL");
    				urlEvent.setParams({
     				 "url": "/" + recordId
                    });
    				urlEvent.fire();
                } else {
                    var urlEvent = $A.get("e.force:navigateToURL");
    				urlEvent.setParams({
     				 "url": "/apex/oppTransferPage_lds?transfer=true&oppId=" + recordId
                    });
    				urlEvent.fire();
                }
            }
        });

        $A.enqueueAction(action);
    }
})