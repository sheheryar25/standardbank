({
	doInit: function(component) {
		component.set("v.userId",$A.get("$SObjectType.CurrentUser.Id"));
		this.checkLock(component);
	},


	checkLock: function(component) {
		var rec = component.get("v.simpleRecord");
		if(rec.LockedBy__c){
			var userId = component.get("v.userId");
			var message;
	
			if(rec.LockedBy__c == userId){
				message = $A.get("$Label.c.My_NBAC_record_is_locked");
			}else{
				message = $A.get("$Label.c.NBAC_record_is_locked");
				message = message.replace("{0}", component.get("v.simpleRecord").LockedBy__r.Name);
			}
			component.set("v.message", message);
		}else{
			component.set("v.message", null);
		}
	},

	doLock: function(component) {
		var rec = component.get("v.simpleRecord");
		if(!rec.LockedBy__c || rec.LockedBy__c.length===0){
			var userId = component.get("v.userId");
			rec.LockedBy__c = userId;
			var today = new Date();
			rec.LockDate__c = today;
			component.set("v.simpleRecord", rec);
			component.set("v.inProgress", true);
			this.doSave(component);
			this.checkLock(component)
		}

	},

	doUnlock: function(component) {
		var rec = component.get("v.simpleRecord");
		var userId = component.get("v.userId");
		if(rec.LockedBy__c && userId==rec.LockedBy__c){
			rec.LockedBy__c = null;
			rec.LockDate__c = null;
			component.set("v.simpleRecord", rec);
			component.set("v.inProgress", true);
			this.doSave(component);
			this.checkLock(component)
		}

	},

	doSave : function(component) {
	    var saveRecord = component.get("c.saveRecord");
	    saveRecord.setParams({
	        "record" : component.get("v.simpleRecord")
        });

        saveRecord.setCallback(this, function(response){
            var state =  response.getState();
            if(state == "SUCCESS"){
                component.set("v.inProgress", false);
            } else if(state == "ERROR"){
                var resultsToast = $A.get("e.force:showToast");
                var errorMsg = saveRecord.getError()[0].message;
                resultsToast.setParams({
                    "title": "Problem updating record",
                    "message": errorMsg,
                    "type" : "error",
                    "mode" : "sticky"
                });
                resultsToast.fire();
            }
        });
        $A.enqueueAction(saveRecord);

		/*component.find("forceRecord").saveRecord($A.getCallback(function(saveResult) {
			var resultsToast = $A.get("e.force:showToast");
			var message = saveResult.error;

			if (message && Array.isArray(message) && message.length > 0){
			    message = message[0].message;
			}

			if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
			} else if (saveResult.state === "INCOMPLETE") {
				resultsToast.setParams({
	                "title": "Problem updating record",
	                "message": "User is offline, device doesn't support drafts.",
	                "type" : "error",
	                "mode" : "sticky"
	            });
	            resultsToast.fire();
			} else if (saveResult.state === "ERROR") {

				resultsToast.setParams({
	                "title": "Problem updating record",
	                "message": message,
	                "type" : "error",
	                "mode" : "sticky"
	            });
	            resultsToast.fire();

			} else {
				
				
				resultsToast.setParams({
	                "title": "Unknown problem",
	                "message": message,
	                "type" : "error",
	                "mode" : "sticky"
	            });
	            resultsToast.fire();
			}
			
		}));*/
	}
})