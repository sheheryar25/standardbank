({
    init : function(component, event, helper) {
        helper.getUserDetails(component);
        helper.setCountryCodes(component);
        let setEvents = component.get('c.setEventListener');
        $A.enqueueAction(setEvents);

        let action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let isLoggedIn = response.getReturnValue();
                component.set("v.isUserLoggedIn",response.getReturnValue());
                if(isLoggedIn) {
                    let action = component.get("c.getUserContactDetails");
                    action.setCallback(this, function(response) {
                        let state = response.getState();
                        console.log(state);
                        if (state === "SUCCESS") {
                            component.set("v.userInformationFound",true);
                            component.set("v.userEmail",response.getReturnValue().Email);
                            component.set("v.userName",response.getReturnValue().Name);
                        }
                    })
                    $A.enqueueAction(action);
                }else{
                    
                	let cmpTarget = component.find('changeIt');
        			$A.util.addClass(cmpTarget, 'AdjustLength');
                }
            }
        });
        $A.enqueueAction(action);
    },

    createCase : function(component, event, helper) {
        let email = undefined;
        let firstNameField = undefined;
        let firstName = undefined;
        let surNameField = undefined;
        let surName = undefined;
        let contact = undefined;
        let EmailUser = component.get("v.userEmail");
        let userName = component.get("v.userName");
        if(EmailUser == null || EmailUser == ''){
            let emailField = component.find("email");
            email = emailField ? emailField.get("v.value") : "";
        }else{
            email = EmailUser;
        }
        
        if(userName == null || userName == ''){
            firstNameField = component.find("firstname");
            firstName = firstNameField ? firstNameField.get("v.value") : "Test";
            surNameField = component.find("surname");
            surName = surNameField ? surNameField.get("v.value") : "Test";
            contact =  firstName +' '+ surName;
        }else{
            contact = userName;
        }        
        let controlAuraIds = ["firstname","surname","email","cellphoneNumber","subject","queryType","contact","email","phone","description"];
        let isAllValid = controlAuraIds.reduce(function(isValidSoFar, controlAuraId){
            let inputCmp = component.find(controlAuraId);
            if(!inputCmp) {
                return true;
            }
            if(inputCmp.reportValidity) {
                inputCmp.reportValidity();
            }
            return isValidSoFar && inputCmp.checkValidity();
        },true);
        if(!isAllValid) {
            window.scrollTo(0,0);
            component.set("v.showToastFail",true);               
                            setTimeout(function(){ 
                                component.set("v.showToastFail",false);  
                            }, 10000);
            return;
        }
        
        let subjectField = component.find("subject");
        let subjectDes =  subjectField ? subjectField.get("v.value") : 'Contact Us OneHub';
        let origin = "Web";
        let status = "New";
        let contactName = undefined;
        let contactValue = undefined;
        let givenName = undefined;
        let lastName = undefined;
        let phoneNum = undefined;
        let countryCd = undefined;
        let dialingCode = component.get("v.dialingCode");
        let phoneField = component.find("phone");
        let phone = phoneField ? dialingCode+'-'+phoneField.get("v.value") : '';
        let descriptionField = component.find("description");
        let description = descriptionField ? descriptionField.get("v.value") : '';
        let queryTypeField = component.find("queryType");
        let query = queryTypeField ? queryTypeField.get("v.value") : '';
        let customSubject = "OneHub - " + query;
        if(contact.includes('Test')){
           contactName = component.find("contact"); 
            if(contactName != null){
               contactValue = contactName.get("v.value");
               contact = contactValue;
            }else{
                givenName = component.get("v.userMap.givenName"); 
                lastName = component.get("v.userMap.familyName");
                phoneNum = component.get("v.userMap.phoneNumber");
                countryCd = component.get("v.userMap.countryCode");  
                if(countryCd != null || countryCd != ''){
                   phone =  countryCd + '-'  +  phoneNum;  
                }else{
                   phone =  dialingCode + '-'  +  phoneNum;
                }                   
                contact = givenName + ' ' + lastName;
            }
        }

        let newCase = component.get('v.newCase');
        newCase.Origin = origin;
        newCase.Status = status;
        newCase.SuppliedEmail = email;
        newCase.SuppliedName = contact;
        newCase.SuppliedPhone = phone;
        newCase.Description = subjectDes  + ' ' + description;
        newCase.Type = query;    
		newCase.Subject = customSubject;
        component.set('v.newCase',newCase);
        if(component.get("v.isUserLoggedIn")){
            helper.createCase(component);
        }else{
            helper.callCapture(component);
        }
        
    },

    setEventListener: function(component,event,helper) {
        window.addEventListener("checkvalue", function (event) {
          if(event.detail) {
            helper.createCase(component);
          }
        });
    },
    
    /*Closes the toast IE case created*/
    closeToast : function(component, event, helper) {
        component.set("v.showToast", false);
    },
    
	/*Cancel shows the confirmation modal*/    
    cancel: function(component,event,helper) {
        var firstCancelClick = component.get("v.firstCancelClick");
        if(firstCancelClick === false){
            component.set("v.firstCancelClick", true);
        }else{
            component.set("v.firstCancelClick", false);
        }
        if(firstCancelClick === true){
            component.set("v.firstCancelClick", true);
        }
    },
    handlePopupClose : function(component, event, helper) {
        var optionSelected = event.getParam("optionSelected");
        if(optionSelected=="Yes"){
            document.querySelector(".newCase__form").reset();
        }
        
    },

    switchMode : function(component, event, helper) {
        component.set("v.showCountryNames", !component.get("v.showCountryNames"));
    },

    switchModeOff : function(component, event, helper) {
        component.set("v.showCountryNames", !component.get("v.showCountryNames"));
        let dialingCodeField = component.find("dialingCode");
        let dialingCode = dialingCodeField.get("v.value");
        setTimeout(function(component, dialingCode) {
            component.set("v.dialingCode", dialingCode);
        }, 0, component, dialingCode);
    },
})