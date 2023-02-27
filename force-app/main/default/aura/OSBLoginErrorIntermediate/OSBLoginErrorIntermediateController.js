({
    init : function(component, event, helper) {
        let action = component.get("c.createLog");
        action.setParams({
            errorMessage : decodeURIComponent(window.location)
        });
        $A.enqueueAction(action);
        let handleErr = component.get('c.handleError');
        setTimeout($A.enqueueAction(handleErr, 1000));
    },
    
    handleError: function(component,event,helper){
        let sPageURL = decodeURIComponent(window.location);
        
        if(sPageURL.includes('User_not_registered')){
            helper.handleAMTUser(component, sPageURL);
        }
        else if(sPageURL.includes('User_Approval_Denied')){
            helper.handleUserDeclined(component, sPageURL);
        }
        else if(sPageURL.includes('User_Access_Removed')){
            helper.handleUserRemoved(component, sPageURL);
        }
        else if(sPageURL.includes('User_Approval_Pending')){
            helper.handleUserPendingApproval(component, sPageURL);
        }
        else if(sPageURL.includes('access_denied')){
            helper.handleAccessDenied(component, sPageURL);
        }
        else{
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "Login_Error__c"
                }
            };
            navService.navigate(pageReference);
        }
    },
})