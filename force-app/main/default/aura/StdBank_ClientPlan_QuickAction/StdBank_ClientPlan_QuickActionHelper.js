({
	navigateClientPlan : function(component) {
		var self = this;
        var recordId = component.get('v.recordId');
		var record = component.get('v.record');
        var action = component.get('c.getuitheme');
        action.setCallback(self, function(result) {
            console.log('isValid ' + component.isValid());
            if (component.isValid()) {
                console.log('result ' + result.getReturnValue()); 
                if(result.getReturnValue() == 'Theme4d'){
                    var rtname = component.get('c.getRT');
                    rtname.setParam('recordId', recordId);
                    rtname.setCallback(self, function(result) {
                        console.log('isValid 2 ' + component.isValid());
                        console.log('result 2 ' + result.getReturnValue()); 
                        if (component.isValid()) {
                            if(result.getReturnValue() == 'Corporate and Investment Banking'){
                                console.log(' Success 1'); 
                                window.open('/apex/ClientPlan?scontrolCaching=1&Lightning=True&Id='+recordId,'CPLDS','height=700,width=1000,resizable=yes,scrollbars=1');
                                var urlEvent = $A.get("e.force:navigateToURL");
                                urlEvent.setParams({
                                        "url": "/"+recordId
                                });
                                urlEvent.fire(); 
                            }else{
                                window.open('/apex/ClientPlanCommB?scontrolCaching=1&Lightning=True&Id='+recordId,'CPLDS','height=700,width=1000,resizable=yes,scrollbars=1');
                                var urlEvent = $A.get("e.force:navigateToURL");
                                urlEvent.setParams({
                                        "url": "/"+recordId 
                                });
                                urlEvent.fire(); 
                            }
                
                        }
                    });
            
                    $A.enqueueAction(rtname); 
                    
                    
            	}
                else{
                    var rtname = component.get('c.getRT');
                    rtname.setParam('recordId', recordId);
                    rtname.setCallback(self, function(result) {
                        if (component.isValid()) {
                            if(result.getReturnValue() == 'Corporate and Investment Banking'){
                                var urlEvent = $A.get("e.force:navigateToURL");
                                urlEvent.setParams({
                                        "url": "/apex/ClientPlan?scontrolCaching=1&Id="+recordId
                                });
                                urlEvent.fire();
                            }else{
                                var urlEvent = $A.get("e.force:navigateToURL");
                                urlEvent.setParams({
                                        "url": "/apex/ClientPlanCommB?scontrolCaching=1&Id="+recordId
                                });
                                urlEvent.fire();
                            }
                
                        }
                    });
            
                    $A.enqueueAction(rtname);

                }
            }
        });

        $A.enqueueAction(action);
    
	}
})