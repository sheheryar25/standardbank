/**

@ Author        : Youssef Ibrahim
@ Date          : 09/09/2019
@ Feature       : C-00002931
@ Description   : Lightning Component JS controller

*/
({
    doInit: function(component, event, helper) {
        var action = component.get('c.getClientIdFromEvent');
        action.setParams({
            eventId : component.get("v.recordId")
        })
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (component.isValid() && state === "SUCCESS") {
             var result = response.getReturnValue();
             helper.navigateToURL(event, '/lightning/r/Call_Report__c/'+result+'/view');
          } else {
                var toast = $A.get('e.force:showToast');
                toast.setParams({
                    'type': 'error',
                    'title': 'Error performing action!',
                    'message': JSON.stringify(response.getError())
                });
                toast.fire();
          }
       });
        $A.enqueueAction(action);
    }
})