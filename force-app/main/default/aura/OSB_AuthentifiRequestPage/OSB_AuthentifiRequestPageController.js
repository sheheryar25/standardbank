({
    init : function(component, event, helper){ 
        helper.getTermsAndConditionsLink(component);
        helper.getUserDetails(component);
    },

    requestAccess : function(component, event, helper) { 
        let fullNameField = component.find("Fullname");
        let fullName = fullNameField ? fullNameField.get("v.value") : "";
        let emailField = component.find("emailAddress");
        let email = emailField ? emailField.get("v.value") : ""; 
        let companyNameField = component.find("Company");
        let companyName = companyNameField ? companyNameField.get("v.value") : "";
        let cellphoneField = component.find("mobileNumber");
        let cellphone = cellphoneField ? cellphoneField.get("v.value") : "";
        if(fullName && email && companyName && cellphone){
            component.set("v.loading", true);
            let newCase = component.get('v.newCase');
            let origin = "Web";
            let status = "New";
            newCase.Origin = origin;
            newCase.Status = status;
            newCase.SuppliedEmail = email;
            newCase.SuppliedName = fullName;
            newCase.SuppliedPhone = cellphone;
            newCase.SuppliedCompany = companyName;
            newCase.Description =  'Authentifi sign up request';
            newCase.Type = 'OneHub Authentifi Registration';    
            newCase.Subject = "OneHub - Authentifi";
            helper.createCase(component, newCase);
            helper.sendEmail(component);
        }
    },
    
    returnToOneHub : function(component){
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navService.navigate(pageReference);
	}    
})