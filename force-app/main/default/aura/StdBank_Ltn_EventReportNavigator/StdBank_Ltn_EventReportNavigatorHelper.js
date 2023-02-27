({
    resolveNavigation: function(component) {
        var self = this;
        var recordId = component.get('v.recordId');
        var action = component.get('c.showConsole');

        action.setParam('recordId', recordId);
        action.setCallback(self, function(result) {
            if (component.isValid()) {
                if (result.getReturnValue()) {
                    //Navigate to MeetingConsole
           	  // location.replace('#/apex/MeetingConsole?id=' + recordId);
                 var urlEvent = $A.get("e.force:navigateToURL");
    			urlEvent.setParams({
     				 "url": "/apex/MeetingConsole?id=" + recordId
                    });
    			urlEvent.fire();
            
                } else {
                    
                    //Hide loading
                    var checkcore = component.get('c.corecheck');

                    checkcore.setParam('recordId', recordId);
                    checkcore.setCallback(self, function(result) {
                        if (component.isValid()) {
                            if (result.getReturnValue()) {
                                var urlEvent = $A.get("e.force:navigateToURL");
                                urlEvent.setParams({
                                     "url": "/apex/AddInternalAttendee_lds?reportid=" + recordId
                                    });
                                urlEvent.fire();
                            }else{
                                component.set('v.isLoading', false);
                            }
                        }
                    });
                    
                    $A.enqueueAction(checkcore);
                }
            }
        });

        $A.enqueueAction(action);
    }
})