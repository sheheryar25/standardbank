({
    init : function(component, event, helper) {
        let sPageURL = decodeURIComponent(window.location.search.substring(1));
        let sURLVariables = sPageURL.split('&');
        let navService = component.find("navService");
        let sParameterName;
        let i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('='); 
            if (sParameterName[0] === 'record') {
                sParameterName[1] === undefined ? 'Not found' : sParameterName[1];
            }
        }
        
        if(sParameterName[1] === undefined || sParameterName[1] === '' || sParameterName[1] === 'Not found'){
            component.set("v.showPingErrorToast",true); 
        }
        let encodedValue = sParameterName[1];
        if(encodedValue.match(/ /g) !== null){
            encodedValue = encodedValue.replace(/ /g,'+');
        }
        let action = component.get("c.getLightContact");
        action.setParams({
            contactId : encodedValue,
            encoded : true
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let values = response.getReturnValue();
                let UserDetails = [];
                for(let index in response.getReturnValue()) {
                    let user = response.getReturnValue()[index];
                    UserDetails.push(user);  
                }
                if(UserDetails[0].OSB_Expire_Sign_Up_Link__c){
                    let pageReference = {
                        type: "comm__namedPage",
                        attributes: {
                            name: "sign_up_link_expired__c"
                        }
                    };
                    navService.navigate(pageReference);
                }
                else{
                    component.set("v.userMap",UserDetails[0]);
                    if(UserDetails.length >= 1){
                        component.set("v.contactId", UserDetails[0].Id);
                        component.set("v.UserName", UserDetails[0].Name);
                        component.set("v.UserEmail", UserDetails[0].Email);
                        component.set("v.UserId", UserDetails[0].Identity_Number__c);
                        component.set("v.passport", UserDetails[0].OSB_Passport_Number__c);
                        if(UserDetails[0].OSB_Community_Access_Role__c == 'Authorised Person'){
                            component.set("v.Authorisation",true); 
                            component.set("v.showFirstSec",true);
                        }else{
                            component.set("v.showFirstSec",false);
                            component.set("v.Authorisation",false);
                            let DPNPfunction = component.get('c.DPNPInitFunc');
                            $A.enqueueAction(DPNPfunction);
                        }   
                    }
                    helper.checkForReturningUser(component, event, helper);
                }
            }
        });
        helper.getTermsAndConditionsLink(component, event, helper);
        helper.getCustomSettings(component, event, helper);
        $A.enqueueAction(action); 
    },
    
    DPNPInitFunc : function(component, event, helper){
        let action = component.get("c.getIndustryValues");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let values = response.getReturnValue();
                component.set("v.industryDict", values);  
            }
        });
        $A.enqueueAction(action);
        helper.getCountryCodes(component, event, helper);
        helper.getRecordValues(component, event, helper);
    },
    
    changeInputAp: function(component, event, helper) {
        let docTypeClicked = component.find("docTypeAp");
        let Doc = docTypeClicked ? docTypeClicked.get("v.value") : "";
        if(Doc == 'idNumber'){
            component.set("v.DoctypeChecked",false);
        }else{
            component.set("v.DoctypeChecked",true);
        }
    },
    
    changeInputDp: function(component, event, helper) {
        let docTypeClicked = component.find("docTypeDp");
        let Doc = docTypeClicked ? docTypeClicked.get("v.value") : "";
        if(Doc == 'idNumber'){
            component.set("v.DoctypeChecked",false);
        }else{
            component.set("v.DoctypeChecked",true);
        }
    },
    
    proceed: function(component, event, helper) {
        let count = component.get("v.errorCount");
        if(count <= '3'){
            component.set("v.errorCount",count+1);
            let recordId = component.get("v.UserId");
            let passNumber = component.get("v.passport");
            let idNumber = component.find("idNumberAp");
            let foundId = idNumber ? idNumber.get("v.value") : "";
            if(recordId === foundId || passNumber === foundId){
                component.set("v.showInformation", true); 
                component.set("v.showFirstSec", false); 
                idNumber.setCustomValidity("");
            }else{
                if(count == '1'){
                    idNumber.setCustomValidity("You have entered an incorrect value that is not associated with your invite. You have 2 more attempts before the invite expires and a new one will have to be resent to you.");
                }if(count == '2'){
                    idNumber.setCustomValidity("You have entered an incorrect value that is not associated with your invite. You have 1 more attempts before the invite expires and a new one will have to be resent to you.");
                }if(count == '3'){
                    idNumber.setCustomValidity("Unfortunately, you have entered your value incorrectly too many times. You won’t be able to continue your sign up. Please contact the OneHub support team to resend your invite. ");
                }
                idNumber.reportValidity();
            }
        }   
    },
    
    togglePassword: function(component) {
        let showPassword = component.get("v.showPassword");
        component.set("v.showPassword", !showPassword);
    },
    resetError: function(component) {
        component.set("v.genericError", "");
    },
    
    formSubmitted: function(component, event, helper) {
        event.preventDefault();
        let showfirstSec = component.get("v.showFirstSec");
        let auth = component.get("v.Authorisation");
        if(showfirstSec){
            let proceedMethod = component.get('c.proceed');
            $A.enqueueAction(proceedMethod); 
        }else if(auth){
            let validateAp = component.get('c.validateAp');
            $A.enqueueAction(validateAp);  
        }else{
            let validateDpNp = component.get('c.validateDpNp');
            $A.enqueueAction(validateDpNp); 
        }
        
    }, 
    
    validateAp: function(component, event, helper) {
        let validationResult = false;
        let regWhiteSpace = new RegExp("\\s+");
        let passwordField = component.find("passwordAp");
        let password =  passwordField ? passwordField.get("v.value") : '';
        let confirmPasswordField = component.find("confirmPasswordAp");
        let confirmPassword = confirmPasswordField ? confirmPasswordField.get("v.value") : "";
        const passwordregexFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const speacialCheck = /(?=.*[@$!%*?&])/;
        const caseLowerCheck = /(?=.*[A-Z])/;
        const caseCheckUpper = /^(?=.*[a-z])/;
        const numerialCheck = /^(?=.*[0-9])/;
        let numbericCount = password.replace(/[^0-9]/g,"").length;
        let oldUser = component.get("v.foundOldUser");
        if(!oldUser){
            if(password.length < 7){
                passwordField.setCustomValidity("Password is too short please add characters"); 
                passwordField.reportValidity();
            }else if(password === component.get("v.UserName")){
                passwordField.setCustomValidity("Password cannot be user name");  
                passwordField.reportValidity();
            }else if(password === component.get("v.userMap[0].FirstName")){
                passwordField.setCustomValidity("Password cannot be first name");  
                passwordField.reportValidity();
            }else if(password === component.get("v.userMap[0].LastName")){
                passwordField.setCustomValidity("Password cannot be last name");  
                passwordField.reportValidity();
            }else if(password === component.get("v.UserName").toLowerCase()){
                passwordField.setCustomValidity("Password cannot be user name");  
                passwordField.reportValidity();
            }else if(password === component.get("v.userMap[0].FirstName").toLowerCase()){
                passwordField.setCustomValidity("Password cannot be first name");  
                passwordField.reportValidity();
            }else if(password === component.get("v.userMap[0].LastName").toLowerCase()){
                passwordField.setCustomValidity("Password cannot be last name");  
                passwordField.reportValidity();
            }else if(!password.match(caseLowerCheck)){
                passwordField.setCustomValidity("Password does not contain any upper case letters");  
                passwordField.reportValidity();
            }else if(!password.match(caseCheckUpper)){
                passwordField.setCustomValidity("Password does not contain any lower case letters");
                passwordField.reportValidity();
            }else if(!password.match(numerialCheck)){
                passwordField.setCustomValidity("Password does not contain any numerals"); 
                passwordField.reportValidity();    
            }else if(numbericCount == 1){
                passwordField.setCustomValidity("Password does not contain 2 or more numerals"); 
                passwordField.reportValidity(); 
            }else if(!password.match(speacialCheck)) {
                passwordField.setCustomValidity("Please add a special character like these *@$!%*?&[]");
                passwordField.reportValidity();
            }else if(regWhiteSpace.test(password)){
                passwordField.setCustomValidity("Please remove any white spaces");
                passwordField.reportValidity();
            }else if(confirmPassword != password){
                passwordField.setCustomValidity("Please ensure both password and confirm password match");
                passwordField.reportValidity();
                confirmPasswordField.setCustomValidity("Please ensure both password and confirm password match");
                confirmPasswordField.reportValidity();
            }else{
                passwordField.setCustomValidity("");
                passwordField.reportValidity();
                confirmPasswordField.setCustomValidity("");
                confirmPasswordField.reportValidity();
                validationResult = true;
            }
        }else{
            validationResult = true; 
        }
        if(validationResult){
            component.set("v.loading", true);
            let UserDetails = [];
            UserDetails = component.get('v.userMap');
            let newContact = component.get('v.newContact'); 
            newContact.Username = UserDetails[0].Email;
            newContact.Email = UserDetails[0].Email;
            newContact.FirstName = UserDetails[0].FirstName;
            newContact.LastName = UserDetails[0].LastName;
            newContact.Title = UserDetails[0].Title;
            newContact.OSB_Company_name__c = UserDetails[0].OSB_Company_name__c;
            newContact.Phone_Country__c = UserDetails[0].Phone_Country__c ? UserDetails[0].Phone_Country__c : "South Africa";
            newContact.Phone = UserDetails[0].Phone;
            newContact.User_Industry__c = UserDetails[0].User_Industry__c;
            newContact.Company_Industry__c = UserDetails[0].Company_Industry__c;
            newContact.Id  = component.get("v.contactId");
            helper.signUp(component, newContact, password,component.get("v.UserId"));
        }
    },
    
    validateDpNp : function(component, event, helper) {
        let validationResult = false;
        let regWhiteSpace = new RegExp("\\s+");
        let emailField = component.find("email");
        let email = emailField ? emailField.get("v.value") : "";
        let passwordField = component.find("password");
        let password = passwordField ? passwordField.get("v.value") : "";
        let confirmPasswordField = component.find("confirmPassword");
        let confirmPassword = confirmPasswordField ? confirmPasswordField.get("v.value") : "";
        const speacialCheck = /(?=.*[@$!%*?&])/;
        const caseLowerCheck = /(?=.*[A-Z])/;
        const caseCheckUpper = /^(?=.*[a-z])/;
        const numerialCheck = /^(?=.*[0-9])/;
        let jobTitleField = component.find("jobTitle");
        let jobTitle = jobTitleField ? jobTitleField.get("v.value") : "";
        let companyNameField = component.find("companyName");
        let companyName = companyNameField ? companyNameField.get("v.value") : "";
        let industryField = component.find("industry");
        let industry = industryField ? industryField.get("v.value") : "";
        let phoneCodeField = component.find("dialingCode");
        let phoneCode = phoneCodeField ? phoneCodeField.get("v.value") : "";
        let cellphoneField = component.find("phoneDpNp");
        let cellphone = cellphoneField ? cellphoneField.get("v.value") : "";
        let IdNumber = component.find("idNumberDP");
        let IdNumberValue = IdNumber ? IdNumber.get("v.value") : "";
        let passPortNumber = component.find("idNumberDP");
        let passPortValue = passPortNumber ? passPortNumber.get("v.value") : "";
        let operatingCountryComp = component.find("operatingMS");
        let operatingCountryValue = operatingCountryComp ? operatingCountryComp.get("v.selectedOptions") : "";
        let newContact = component.get('v.newContact');
        let isAllValid = false;
        if(phoneCode &&  jobTitle && companyName && industry && cellphone && operatingCountryValue.length !== 0){
            isAllValid = false;  
        }else{
            isAllValid = true; 
        } 
        if(isAllValid) {
            window.scrollTo(0,0);
            component.set("v.showToastFail",true);               
            setTimeout(function(){ 
                component.set("v.showToastFail",false);  
            }, 5000);
            companyNameField.reportValidity();
            cellphoneField.reportValidity();
            jobTitleField.reportValidity();
            industryField.showHelpMessageIfInvalid();
            passwordField.reportValidity();
            confirmPasswordField.reportValidity();
            operatingCountryComp.CheckValidation('true');
            return;
        }else{
            let oldUser = component.get("v.foundOldUser");
            if(!oldUser){
                let numbericCount = password.replace(/[^0-9]/g,"").length;
                if(password.length < 7){
                    passwordField.setCustomValidity("Password is too short please add characters"); 
                    passwordField.reportValidity();
                }else if(password === component.get("v.UserName")){
                    passwordField.setCustomValidity("Password cannot be user name");  
                    passwordField.reportValidity();
                }else if(password === component.get("v.contact.FirstName")){
                    passwordField.setCustomValidity("Password cannot be first name");  
                    passwordField.reportValidity();
                }else if(password === component.get("v.contact.LastName")){
                    passwordField.setCustomValidity("Password cannot be last name");  
                    passwordField.reportValidity();
                }else if(password === component.get("v.UserName").toLowerCase()){
                    passwordField.setCustomValidity("Password cannot be user name");  
                    passwordField.reportValidity();
                }else if(password === component.get("v.contact.FirstName").toLowerCase()){
                    passwordField.setCustomValidity("Password cannot be first name");  
                    passwordField.reportValidity();
                }else if(password === component.get("v.contact.LastName").toLowerCase()){
                    passwordField.setCustomValidity("Password cannot be last name");  
                    passwordField.reportValidity();
                }else if(!password.match(caseLowerCheck)){
                    passwordField.setCustomValidity("Password does not contain any upper case letters");  
                    passwordField.reportValidity();
                }else if(!password.match(caseCheckUpper)){
                    passwordField.setCustomValidity("Password does not contain any lower case letters");
                    passwordField.reportValidity();
                }else if(!password.match(numerialCheck)){
                    passwordField.setCustomValidity("Password does not contain any numerals"); 
                    passwordField.reportValidity();
                }else if(numbericCount == 1){
                    passwordField.setCustomValidity("Password does not contain 2 or more numerals"); 
                    passwordField.reportValidity(); 
                }else if(!password.match(speacialCheck)) {
                    passwordField.setCustomValidity("Please add a special character like these *@$!%*?&[]");
                    passwordField.reportValidity();
                }else if(regWhiteSpace.test(password)){
                    passwordField.setCustomValidity("Please remove any white spaces");
                    passwordField.reportValidity();
                }else if(confirmPassword != password){
                    passwordField.setCustomValidity("Please ensure both password and confirm password match");
                    passwordField.reportValidity();
                    confirmPasswordField.setCustomValidity("Please ensure both password and confirm password match");
                    confirmPasswordField.reportValidity();
                }else{
                    passwordField.setCustomValidity("");
                    passwordField.reportValidity(); 
                    confirmPasswordField.setCustomValidity("");
                    confirmPasswordField.reportValidity();
                    validationResult = true;
                }
            }else{
               validationResult = true; 
            }
            if(validationResult){
                component.set("v.loading", true);
                let contact = component.get('v.contact'); 
                newContact.Username = contact.Email;
                newContact.Email = contact.Email;
                newContact.FirstName = contact.FirstName;
                newContact.LastName = contact.LastName;
                newContact.Title = jobTitle;
                newContact.OSB_Company_name__c = companyName;
                newContact.Phone_Country__c = phoneCode;
                newContact.Phone = cellphone;
                newContact.Company_Industry__c = industry;
                newContact.Identity_Number__c = IdNumberValue;
                newContact.OSB_Passport_Number__c = passPortValue;
                let selections = '';
                operatingCountryValue.forEach(option => {
                    selections += option.Name+';';
                });
                    let finalCountries = selections.slice(0, -1);
                    newContact.OSB_Operating_Country__c = finalCountries;  
                    newContact.Id  = component.get("v.contactId");
                    helper.signUp(component, newContact, password,IdNumberValue);
                } 
                    
           }
    },
    
    cancel: function(component,event,helper) {
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
    
    doneRendering: function(component, event) {
        let checkLabel = '<a href="https://secure-web.cisco.com/1hkuyyyLhv5T7JnOrGyZB0NawK7FX1kPSF_85JnoMdoP92QkIrVp1bST7n09_ImyoywQgUg5udV0iXrWBmmXtWuXHSGja-txcE5Y6qGKtSEvkVZEB4G3SZFwF3MfygOn4fae_Mjuwh-ZaMwJzqRZGapnX1QDWQTd2T8FCrc0WDtjhIkrrVkwG_aX6sEFB-94adaK60MC-TLIb0mXeCONv1bE7eGbuChxzgIdW_jNzRBVBfdMx0d4EsxXF4zpNuY7O5ykrwNpqh0c72XN9tZrs5O091FS2lvCfZtyl9DCHK2jYdp2EiFQZhv4B-j_Ekw8Co3ktjbijI7k_0G3swr8ooA/https%3A%2F%2Fwww.standardbank.co.za%2Fsouthafrica%2Fpersonal%2Fabout-us%2Fterms-and-conditions">terms and conditions</a>';
        debugger;
        document.querySelector('.slds-checkbox__label .slds-form-element__label').innerHTML = checkLabel;
    },
         
    handlePopupClose : function(component, event, helper) {
        let optionSelected = event.getParam("optionSelected");
        if(optionSelected=="Yes"){
           document.querySelector(".newCase__form").reset(); 
        } 
    },
            
    handleSelectChange : function(component,event, helper) {
        helper.handleSelectStyle(component, event, helper);
    },
            
    handlePassEntered : function(component, event, helper) {
        let passValue = event.getSource().get('v.value');
        helper.validatePassValue(component, passValue);
    },
            
    activatePassMenu : function(component) {
        component.set("v.passIsTyped", true);
    }
})