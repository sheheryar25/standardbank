({
	doSave: function(component, event, helper) {
		var savingModal = component.find('savingModal');
        $A.util.toggleClass(savingModal, 'slds-hide');

        const hasRecordEditAccess = component.get('c.hasRecordEditAccess');
        hasRecordEditAccess.setParams({recordId : component.get('v.recordId')});
        hasRecordEditAccess.setCallback(this, function(response) {
            const state = response.getState();
            if (state === 'SUCCESS') {
                if (!!response.getReturnValue() === true) {
                    helper.saveRecord(component, event, helper);
                } else {
			        $A.util.toggleClass(savingModal, 'slds-hide');
                    component.find('notifLib').showToast({
                        title : 'Insufficient access rights on object id'
                    });
                }
            } else {
                component.find('notifLib').showToast({
                    title : 'Unknown problem',
                    type : 'error'
                });
                $A.util.toggleClass(savingModal, 'slds-hide');
            }
        });
        $A.enqueueAction(hasRecordEditAccess);
	},

	saveRecord : function(component, event, helper) {
		var savingModal = component.find("savingModal");
        var buttons = component.find("buttons");

		component.find("forceRecord").saveRecord($A.getCallback(function(saveResult) {

			$A.util.toggleClass(savingModal, "slds-hide");
			var resultsToast = $A.get("e.force:showToast");

			var message = saveResult.error;

			if (message && Array.isArray(message) && message.length > 0){
			    message = message[0].message ? message[0].message : 'Multiple page errors.';
			}

			if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {

	            resultsToast.setParams({
                    "message": "Record has been saved successfully",
                    "type" : "success"
                });

			    $A.util.toggleClass(buttons, "slds-hide");
			    component.find("forceRecord").reloadRecord();

	            var componentAction = $A.get("e.c:ComponentAction");
                componentAction.setParams({'data':{'name' : 'save'}});
                componentAction.fire();

			} else if (saveResult.state === "INCOMPLETE") {

				resultsToast.setParams({
	                "title": "Problem saving record",
	                "message": "User is offline, device doesn't support drafts.",
	                "type" : "error",
	                "mode" : "sticky"
	            });

			} else if (saveResult.state === "ERROR") {
				if(message.match(/(.*)\: data value too large\:/) &&
					Array.isArray(message.match(/(.*)\: data value too large\:/)) &&
					message.match(/(.*)\: data value too large\:/).length > 1 &&
					message.match(/max length\=(\d*)/) &&
					Array.isArray(message.match(/max length\=(\d*)/)) &&
					message.match(/max length\=(\d*)/).length > 1) {
					message = message.match(/(.*)\: data value too large\:/)[1] +
							': Please remove some text as it has exceeded the character limit. Max Limit: ' +
							message.match(/max length\=(\d*)/)[1];
				}

				resultsToast.setParams({
	                "title": 'Problem saving record',
	                "message": message,
	                "type" : "error",
	                "mode" : "sticky"
	            });

			} else {

				resultsToast.setParams({
	                "title": "Unknown problem",
	                "message": message,
	                "type" : "error",
	                "mode" : "sticky"
	            });

			}
			resultsToast.fire();
		}));
    },

	doCancel: function(component, event, helper) {
	    this.doReload(component, event, helper);

        var componentAction = $A.get("e.c:ComponentAction");
        componentAction.setParams({'data':{'name' : 'cancel'}});
        componentAction.fire();
	},

	doReload : function(component, event, helper) {
		var buttons = component.find("buttons");
        $A.util.addClass(buttons, "slds-hide");
		component.find("forceRecord").reloadRecord();
	},

	 buildComponents : function(component){
            var componentsNames = component.get('v.components');

            if(componentsNames){

                componentsNames = componentsNames.split(',');
                var components = [];
                for (var i = 0; i < componentsNames.length; i++) {
                    components.push([componentsNames[i].trim()]);
                }

               $A.createComponents(
                   components
                   , function(newComponents, status, errorMessage){
                     if (status === "SUCCESS") {
                          var additionalComponents = component.get("v.additionalComponents");

                         for (var key in newComponents ) {
                                 var additionalComponent = newComponents[key];
                                 additionalComponent.set("v.recordDataComponent", component);
                                 additionalComponents.push(additionalComponent);
                            }

                         component.set("v.additionalComponents", additionalComponents);
                     }
                     else if (status === "INCOMPLETE") {
                         console.log("No response from server or client is offline.")
                         // Show offline error
                     }
                     else if (status === "ERROR") {
                         console.log("Error: " + errorMessage);
                         // Show error message
                     }
                 }
               )

            }
        }
})