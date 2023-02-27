({
    doInit: function(component, event, handler) {
        var self = this;
        var recordId = component.get('v.recordId');
        var action = component.get('c.showConsole');

        action.setParam('recordId', recordId);
        action.setCallback(self, function(result) {
            if (component.isValid()) {
                if (result.getReturnValue()) {

                 var urlEvent = $A.get("e.force:navigateToURL");
    			urlEvent.setParams({
     				 "url": "/apex/MeetingConsole?id=" + recordId
                    });
    			urlEvent.fire();

                } else {
                 var redirectToExternal = component.get('c.showExternalAttendees');
                 var navService = component.find("navService");
                 redirectToExternal.setParam('recordId', recordId);
                 redirectToExternal.setCallback(self, function(result){
                    if(result.getReturnValue()) {
                    var pageReference = {
                                type: 'standard__component',
                                attributes: {
                                    componentName: 'c__EventReport',
                                },
                                state: {
                                    "c__recordId": recordId
                                }
                            };
                    navService.navigate(pageReference);
                    }  else {
                         component.set('v.isLoading', false);
                    }
                 });
                 $A.enqueueAction(redirectToExternal);
                }
            } else {
                component.set('v.isLoading', false);
            }
        });

        $A.enqueueAction(action);
    }
})