({
	getTermsAndConditionsLink: function(component) {
        let documentName = component.get("v.termsConditionsDoc");
        let action = component.get("c.getOSBDocumentURL");
        action.setParams({
            "docName": documentName
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let resourceURL = response.getReturnValue();
                component.set("v.termsConditionsURL", resourceURL);
            }
        });
        $A.enqueueAction(action);
    },
    
    checkForCase: function(component) {
        let email = component.get("v.userMap")[0].Email;
        let action = component.get("c.caseCheck");
        action.setParams({
            email: email,
            subject: 'OneHub - Authentifi'
        }); 
        action.setCallback(this, function(response){
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length != 0) {
                component.set("v.RequestNotComplete",false);
            }
        });
        $A.enqueueAction(action);
    },
    
    createCase: function(component, newCase) {
        let action = component.get("c.createCaseWithContactId");
        action.setParams({
            "caseRecord": newCase
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.loading",false);
                component.set("v.RequestNotComplete",false);  
            }
        });
        $A.enqueueAction(action);
        
    },

    getUserDetails: function(component) {
        let action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let isLoggedIn = response.getReturnValue();
                component.set("v.isUserLoggedIn",response.getReturnValue());
                if(isLoggedIn) {
                    let GetDetailsAction = component.get("c.getUserDetails");
                    GetDetailsAction.setCallback(this, function(response) {
                        let state = response.getState();
                        if (state === "SUCCESS") {
                            component.set("v.userMap",response.getReturnValue());
                            this.checkForCase(component);
                        }
                    })
                    $A.enqueueAction(GetDetailsAction);
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    sendEmail: function (component){
        let sendEmailAct = component.get("c.sendEmail");
        $A.enqueueAction(sendEmailAct);
    }
})