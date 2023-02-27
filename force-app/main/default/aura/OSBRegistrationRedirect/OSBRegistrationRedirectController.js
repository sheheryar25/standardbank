({
	init : function(component, event, helper) {
        let setEvents = component.get('c.setEventListener');
        $A.enqueueAction(setEvents);

        let sPageURL = decodeURIComponent(window.location.search.substring(1));
        let sURLVariables = sPageURL.split('&');
        let sParameterName;
        let i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === 'record') {
                sParameterName[1] === undefined ? 'Not found' : sParameterName[1];
            }
        }
        component.set("v.solution",sParameterName[1]);
        if(sPageURL.includes('encodeDetails')){
            let urlString = window.location.search.substring(1);
            let urlParams = String(urlString).split('?');
            let urlParamValueArray = String(urlParams).split('&');
            
            let logoutUrlArray = String(urlParamValueArray[1]).split('=');
            let logoutUrl = decodeURIComponent(logoutUrlArray[1]);
            component.set("v.logoutURL", logoutUrl);

            let extraDetailsArray = String(urlParamValueArray[0]).split('=');
            let extraDetails = extraDetailsArray[1];
            
            let action = component.get("c.decodeBase64String");
            action.setParams({
                "base64String": extraDetails
            });
            
            action.setCallback(this, function(response){ 
            	let state = response.getState();
                if (state === "SUCCESS"){
                	let userDetails = String(response.getReturnValue()).split('|');
                    component.set("v.firstName", userDetails[0]);
                    component.set("v.lastName", userDetails[1]);
                    component.set("v.email", userDetails[2]);
                    component.set("v.cellphone", userDetails[3]);
                    component.set("v.redirectAfterSubmit", true);
                }
            });
        	$A.enqueueAction(action);
        }
    }, 
    
    resetError: function(component) {
        component.set("v.genericError", "");
    },
    
    signUp: function(component, event, helper) {
        let firstnameField = component.find("firstname");
        let firstname = firstnameField ? firstnameField.get("v.value") : '';
        let surnameField = component.find("surname");
        let surname = surnameField ? surnameField.get("v.value") : '';
        let dialingCodeField = component.find("dialingCode");
        let dialingCode = dialingCodeField ? dialingCodeField.get("v.selectedCode") : '';
        let phoneField = component.find("phone");
        let phone = phoneField ? dialingCode+'-'+phoneField.get("v.value") : '';
		let emailField = component.find("email");
        let email = emailField ? emailField.get("v.value") : '';
        let jobTitleField = component.find("jobTitle");
        let jobTitle = jobTitleField ? jobTitleField.get("v.value") : '';
        let companyNameField = component.find("companyName");
        let companyName = companyNameField ? companyNameField.get("v.value") : '';
        let isAllValid = false;
        if(firstname !== '' && surname !== '' && dialingCode !== '' && phone !== '' && email !== '' &&  jobTitle !== '' && companyName !== ''){
           isAllValid = false;
        }else{
           isAllValid = true;
        }
        if(isAllValid) {
            var redirectAfterSubmit = component.get("v.redirectAfterSubmit");
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
                window.scrollTo(0,0);
                component.set("v.showToastFail",true);
                                setTimeout(function(){
                                    component.set("v.showToastFail",false);
                                }, 5000);
            }
            return;
        } else {
            component.set("v.subMittingCase",true);          
            let subject = 'Registration Request';
            let origin = "Web";
            let status = "New";
            let newCase = component.get('v.newCase');
            newCase.Subject = subject;
            newCase.Origin = origin;
            newCase.Status = status;
            newCase.SuppliedEmail = email;
            newCase.SuppliedName = firstname+' '+surname;
            newCase.SuppliedPhone = phone;
            newCase.SuppliedCompany = companyName;
            newCase.User_Job_Title__c = jobTitle;
            newCase.Subject = 'OneHub - ' + subject;
            newCase.Type = 'OneHub Registration';
            component.set('v.newCase',newCase);
            helper.callCapture(component);
        }
    }, 

    cancel: function(component,event,helper) {
        document.body.setAttribute('style', 'overflow: hidden;');
        let firstCancelClick = component.get("v.firstCancelClick");
        if(firstCancelClick === false){
            component.set("v.firstCancelClick", true);
        }else{
            component.set("v.firstCancelClick", false);
        }
        if(firstCancelClick === true){
            component.set("v.firstCancelClick", true);
        }  
    },

    setEventListener: function(component,event,helper) {
        window.addEventListener("checkvalue", function (event) {
          if(event.detail) {
            helper.createCase(component);
          }
        });
    },

    handlePopupClose : function(component, event, helper) {
        document.body.setAttribute('style', 'overflow: unset;');
        let optionSelected = event.getParam("optionSelected");
        if(optionSelected === 'Yes'){
            if(component.get("v.firstName") != null || component.get("v.firstName") != ""){
                window.location.replace(component.get("v.logoutURL"));
            }
            else{
                let navService = component.find("navService");
                let pageReference = {
                        type: "comm__namedPage",
                        attributes: {
                            pageName: 'home'
                        }
                    };
                navService.navigate(pageReference);
            }
        }
    }
})