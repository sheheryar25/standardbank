({
    
    init : function(component, event, helper) {
        var section = component.get("v.section")
        var cmpTarget = component.find('changeIt');
        if(section == 'Business Problem'){
        	$A.util.addClass(cmpTarget, 'AdjustLength');
            var compIcon = component.find('adjustIcon');
            $A.util.addClass(compIcon, 'adjustIc');
        }else{
            $A.util.addClass(cmpTarget, 'original');
        }
    },
    
    createCase : function(component, event, helper) {
        component.set("v.subMittingCase",true);
        //Group all the fields ids into a JS array
        var controlAuraIds = ["description"];
        //reducer function iterates over the array and return false if any of the field is invalid otherwise true.
        
        let isAllValid = controlAuraIds.reduce(function(isValidSoFar, controlAuraId){
            //fetches the component details from the auraId
            var inputCmp = component.find(controlAuraId);
            if(!inputCmp) {
                return true;
            }
            if(inputCmp.reportValidity) {
                inputCmp.reportValidity();
            }
            //form will be invalid if any of the field's valid property provides false value.
            return isValidSoFar && inputCmp.checkValidity();
        },true);
        if(!isAllValid) {
            component.set("v.subMittingCase",false);
            window.scrollTo(0,0);
            component.set("v.showErrorToast", true);
            setTimeout(function(){ 
                component.set("v.showErrorToast",false);  
            }, 5000);
            return;
        } else {
        var subject = component.get("v.section");
        var origin = "Web";
        var status = "New";
        var descriptionField = component.find("description");
        var description = descriptionField ? descriptionField.get("v.value") : '';
        var type = component.get("v.section");
        
        
        var newCase = component.get('v.newCase');
        newCase.Subject = 'OneHub - '+subject;
        newCase.Origin = origin;
        newCase.Status = status;
        newCase.Description = description;
        newCase.Type = type;
        helper.createCase(component, newCase); 
        }
        
    },
    handleCancel: function(component) {
        component.set("v.showPopup",true);
    },
    
    handlePopupClose : function(component, event, helper) {
        var optionSelected = event.getParam("optionSelected");
        if(optionSelected=="Yes"){
            document.querySelector(".newCase__form").reset();
            component.set("v.description","");
            component.set("v.showPopup",false);
        }
        else{
            component.set("v.showPopup",false);
        }
    },
})