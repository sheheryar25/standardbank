({
	doInit : function(component, event, helper) {
		var sobjectId = component.get("v.recordId");
        var sObjectEvent = $A.get("e.force:navigateToSObject");
        sObjectEvent .setParams({
            "recordId": sobjectId  
        });
        sObjectEvent.fire(); 
  }
})