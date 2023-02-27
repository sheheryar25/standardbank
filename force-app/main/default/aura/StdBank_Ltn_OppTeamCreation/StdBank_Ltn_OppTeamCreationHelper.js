({
	chkpermission : function(component) {
		var self = this;
        var recordId = component.get('v.recordId');
        var action = component.get('c.checkpermission');
        action.setParam('recordId', recordId);
        
        action.setCallback(self, function(result) {
            if (component.isValid()) {
                var fxnResponse = result.getReturnValue();
                console.log('fxnResponse'+fxnResponse.success);
                if (fxnResponse.success == true) {
                    component.set('v.isLoading', false);
                    var urlEvent = $A.get("e.force:navigateToURL");
    				urlEvent.setParams({
     				 "url": "/" + recordId
                    });
    				urlEvent.fire();
                    var toast = $A.get('e.force:showToast');

                    toast.setParams({
                        'type': 'error',
                        'title': 'Insufficient Privileges!',
                        'message': fxnResponse.errorMessage//'Please contact the opportunity owner.'
                    });
            
                    toast.fire();
                } else {
                    var urlEvent = $A.get("e.force:navigateToURL");
    				urlEvent.setParams({
     				 "url": "/apex/oppTeamCreation_lds?oppId=" + recordId
                    });
    				urlEvent.fire();
                }
            }
        });

        $A.enqueueAction(action);
	}
})