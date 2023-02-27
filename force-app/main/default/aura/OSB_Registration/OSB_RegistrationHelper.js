({
    signUp: function(component, newContact, password,IdNumberValue) {
        let CallPing = component.get("c.sendDataToPing");
        CallPing.setParams({
            "newContact": newContact,
            "password": password,
            "idNum":IdNumberValue,
        });
        CallPing.setCallback(this, function(response){
            let state = response.getState();
            let PingId = response.getReturnValue();
            if(state === "SUCCESS"){
                if(PingId.includes("entryUUID")){
                    let UpdateContact = component.get("c.updateContact");
                    UpdateContact.setParams({
                        "newContact": newContact,
                        "idNum":IdNumberValue,
                        "pingId": PingId
                    });
                    UpdateContact.setCallback(this, function(response){ 
                        component.set("v.loading", false);
                        let contactId = response.getReturnValue();
                        if (component.isValid() && state === "SUCCESS" && component.get("v.Authorisation")) {
                            let url = component.get("v.SSOUrl");
                            window.open(url,'_top');
                        } 
                        else {
                            let navService = component.find("navService");
                            let pageReference = {
                                type: "comm__namedPage",
                                attributes: {
                                    name: "CongratulationsPage__c"
                                },
                                state : {
                                    "record" : contactId
                                }
                            };
                            navService.navigate(pageReference); 
                        }
                    });
                    $A.enqueueAction(UpdateContact);
                }else{
                    component.set("v.loading", false);
                    component.set("v.showPingErrorToast",true);
                }
            }
        });
        $A.enqueueAction(CallPing);
    },
    
    checkForReturningUser : function (component, event, helper){
        let checkForOld = component.get("c.checkForUser");
        checkForOld.setParams({
            "userEmail": component.get("v.UserEmail")
        });
        checkForOld.setCallback(this, function(response){
            let state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
				console.log('Check response ' + response.getReturnValue());
                component.set("v.foundOldUser", response.getReturnValue());
                console.log(component.get("v.foundOldUser"));
            }
        });
        $A.enqueueAction(checkForOld);
    },
    
    getRecordValues : function (component, event, helper){
        let action = component.get("c.getLightContact");
        action.setParams({
            "contactId": component.get("v.contactId"),
            "encoded" : false
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.contact", response.getReturnValue()[0]);   
            }
        });
        $A.enqueueAction(action);
    },
    
    handleSelectStyle : function(component, event, helper) {
        if(component.find('industry').get('v.value')) {
            $A.util.removeClass(component.find('industry'), 'signUp__form__industry-placeholder');
        } else {
            $A.util.addClass(component.find('industry'), 'signUp__form__industry-placeholder');
        }
    },
    
    getCountryCodes : function(component, event, helper) {
        let action = component.get("c.getCountryCodes");
        action.setCallback(this, function(response) {
            let state = response.getState();
            let responseList = [];
            let opCountries = [];
            if (state === "SUCCESS") {
                let phoneCountries = response.getReturnValue().countryCodes; 
                component.set("v.phoneCodes", phoneCountries);
                window.setTimeout(
                    $A.getCallback( function() {
                        component.find("dialingCode").set("v.value", 'South Africa');
                    }));
                let responseList = response.getReturnValue().operatingCountries;
                responseList.forEach(function (item, index) {
                    opCountries.push({"Id": index, "Name": item});
                });
                component.set("v.optionsCountry",opCountries);
            }
        });
        $A.enqueueAction(action);
    },
    
    handleLogin: function (component, username, password) {
        let action = component.get("c.login");
        let startUrl = component.get("v.startUrl");
        startUrl =decodeURIComponent(startUrl);
        action.setParams({
            username:username,
            password:password,
            startUrl: startUrl
        });
        action.setCallback(this, function(a) {
            let rtnValue = a.getReturnValue();
            if (rtnValue !==null) {
                component.set("v.genericError",rtnValue);
            }
        });
        $A.enqueueAction(action);
    },
    
    getCustomSettings: function(component, event, helper) {
        let action = component.get("c.getCustomURLS");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let ResourceList = [];
                for(let index in response.getReturnValue()) {
                    let URL = response.getReturnValue()[index];
                    if(URL.Name == 'OSB_Base_URL') {
                        component.set("v.baseURL",URL.Value__c);
                    }
                    if(URL.Name == 'OSB_SSO') {
                        component.set("v.SSOUrl",URL.Value__c);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    getTermsAndConditionsLink: function(component) {
        let action = component.get("c.getOSBDocumentURL");
        action.setParams({
            "docName": "Terms_Conditions"
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

    validatePassValue : function(component, passValue){
        let regExUppercase = "(?=.*?[A-Z])";
        let regExLowercase = "(?=.*?[a-z])";
        let regExSpecial = "(?=.*?[#?!@$%^&*-])";
        let regExNumber = "(?=(.*?\\d){2})";
		let regWhiteSpace = new RegExp("\\s+");
        
        let validations = [];
        validations.push(passValue.search(regExUppercase) != -1);
        validations.push(passValue.search(regExLowercase) != -1);
        validations.push(passValue.search(regExSpecial) != -1);
        validations.push(passValue.search(regExNumber) != -1);
        validations.push(regWhiteSpace.test(passValue) != true);
        validations.push(passValue.length > 7);

        component.set("v.passValidations", validations);
    }
})