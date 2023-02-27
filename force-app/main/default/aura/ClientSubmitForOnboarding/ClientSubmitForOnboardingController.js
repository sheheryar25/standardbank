({
	doInit : function(component, event, helper) {
		var recordId = component.get("v.recordId");

		var getAccount = component.get("c.getAccount");
		getAccount.setParams({recordId: recordId});
		var accountPromise = new Promise(function(resolve) {
			getAccount.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.record", response.getReturnValue());
				}
				resolve();
			});
		});

		var getContacts = component.get("c.getContacts");
		getContacts.setParams({recordId: recordId});
		var contactsPromise = new Promise(function(resolve) {
			getContacts.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.contacts", response.getReturnValue());
				}
				resolve();
			});
		});

		var getCurrentUserId = component.get("c.getCurrentUserId");
		var currentUserIdPromise = new Promise(function(resolve) {
			getCurrentUserId.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.currentUserId", response.getReturnValue());
				}
				resolve();
			});
		}); 
        
        var getIsCommB = component.get("c.getIsCommB");
		var isCommBPromise = new Promise(function(resolve) {
			getIsCommB.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.isCommB", response.getReturnValue());
				}
				resolve();
			});
		});

		var getIsCIB = component.get("c.getIsCIB");
		var isCIBPromise = new Promise(function(resolve) {
		    getIsCIB.setCallback(this, function(response) {
		        var state = response.getState();
		        if(component.isValid() && state == "SUCCESS") {
		            component.set("v.isCIB", response.getReturnValue());
                }
                resolve();
             });
        });

		Promise.all([isCIBPromise, isCommBPromise, accountPromise, contactsPromise, currentUserIdPromise])
			.then($A.getCallback(function() {
				if (component.isValid()) {
					helper.validateRecord(component, helper);
				}
			})); 
		$A.enqueueAction(getIsCIB);
		$A.enqueueAction(getIsCommB);
		$A.enqueueAction(getAccount);
		$A.enqueueAction(getContacts);
		$A.enqueueAction(getCurrentUserId);
        
	}
})