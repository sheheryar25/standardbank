({   
    createCase: function(component) {
        let button = component.find('disablebuttonid');
    	button.set('v.disabled',true);
        let newCase = component.get('v.newCase');
        let action = component.get("c.saveCase");
        action.setParams({
            "regCase": newCase
        });
        
        action.setCallback(this, function(response){
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.subMittingCase",false);
                document.querySelector(".newCase__form").reset();
                component.find("firstname").set("v.value") == '';
                component.find("surname").set("v.value") == '';
                component.find("dialingCode").set("v.value") == '';
                component.find("phone").set("v.value") == '';
                component.find("email").set("v.value") == '';
                component.find("jobTitle").set("v.value") == '';
                component.find("companyName").set("v.value") == '';
    
                let redirectAfterSubmit = component.get("v.redirectAfterSubmit");
                
                if(redirectAfterSubmit){
                    let navService = component.find("navService");
                    let pageReference = {
                            type: "comm__namedPage",
                            attributes: {
                                name: 'Nearly_there__c'
                            }
                        };
                    navService.navigate(pageReference);
                }
                else{
                    component.set("v.showToast",true);
                    window.scrollTo(0,0);
                    setTimeout(function(){ 
                        component.set("v.showToast",false); 
                    }, 5000);
                }
    			button.set('v.disabled',false);
            }
        });
        $A.enqueueAction(action);
    },

    callCapture: function(component) {
        component.find('recaptureChild').doSubmit();
    },
})