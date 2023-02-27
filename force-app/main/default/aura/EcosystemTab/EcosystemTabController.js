({
    doInit : function(component, event, helper) {
        var groupNumber = component.get("v.groupNumber");
        var globalId = component.getGlobalId();
        component.set("v.globalId", globalId.replace(/[:;]/g, "_"));
        if (groupNumber) {
            UTL.promise(component.get("c.getUnbankedClients"), {"groupNumber": groupNumber})
                .then(
                    helper.processEcosystem(component),
                    $A.getCallback(function(error) {
                        console.log("Failed with error: " + error);
                    })
                );
        }
        else {
            helper.getEcosystemById(component);
        }
    },

	btnBack : function(component, event, helper) {
        let url = window.location.href;
        let isEdit = component.get("v.isEdit");
        if(isEdit){
            let homeEvent = $A.get("e.force:navigateToList");
            homeEvent.setParams({
                "scope": "Ecosystem__c"
            });
            homeEvent.fire();
        }
        else {
            window.history.back();
        }
	},
    btnEdit : function(component, event, helper) {
        let recordId = component.get("v.recordId");
        let editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": recordId
        });
        component.set("v.isEdit",true);
        editRecordEvent.fire();
    },
    handleToastEvent : function(component, event, helper) {
        let toastMessageParams = event.getParams();
        let message = toastMessageParams.message;
        if(message!=undefined) {
            if (message.includes('was saved')) {
                helper.getEcosystemById(component);
            }
        }
    },
})