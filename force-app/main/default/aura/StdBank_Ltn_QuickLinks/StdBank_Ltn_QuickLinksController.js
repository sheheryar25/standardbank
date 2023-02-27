({
	handleCreateClient : function(component, event, helper) {
        var action = component.get("c.getRecordTypeIdByLabel");
        action.setParams({
            "objectName": "Account",
            "recordTypeLabel": "Prospect"
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": "Account",
                    "recordTypeId": response.getReturnValue()
                });
                
                console.log('StdBank_Ltn_QuickLinks::Creating Client ');
                createRecordEvent.fire();
            } else {
            	console.log('StdBank_Ltn_QuickLinks::Problem - getting Client RT Id either failed or component unrendered; response state = ' + state);
            }
        });
        
        console.log('StdBank_Ltn_QuickLinks::Getting Client RecordType Id');
        $A.enqueueAction(action);
	},

	doInit :  function(component, event, helper) {
		var action = component.get("c.getQuickLinks");
        var context = component.get("v.sObjectName");
        if(context == null){
           context = "Homepage";
    	}

         action.setParams({
            "columns": "[1,2]",
             "componentContext" : context
        });
		  action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var mapColumn2Links = response.getReturnValue();
				component.set("v.quicklinks", mapColumn2Links["1"]);
                component.set("v.otherdashboards", mapColumn2Links["2"]);
                
            } else {
            	console.log('StdBank_Ltn_QuickLinks::Problem - getting QuickLinks either failed or component unrendered; response state = ' + state);
            }
        });

        helper.showDashboardHeading( component );                       //determine if we should show the dashbaord

        console.log('StdBank_Ltn_QuickLinks::Getting Quick Links ');
        $A.enqueueAction(action);
	},
    
    handleCreateClientComplaint : function(component, event, helper) {
        var action = component.get("c.getRecordTypeIdByLabel");
        action.setParams({
            "objectName": "Case",
            "recordTypeLabel": "CIB Client Case"
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": "Case",
                    "recordTypeId": response.getReturnValue()
                });
                
                console.log('StdBank_Ltn_QuickLinks::Creating Case');
                createRecordEvent.fire();
            } else {
            	console.log('StdBank_Ltn_QuickLinks::Problem - getting Case RT Id either failed or component unrendered; response state = ' + state);
            }
        });
        
        console.log('StdBank_Ltn_QuickLinks::Getting Case RecordType Id');
        $A.enqueueAction(action);
	}
})