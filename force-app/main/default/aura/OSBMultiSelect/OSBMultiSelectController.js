({
    onRender : function(component, event, helper) {
        if(!component.get("v.initializationCompleted")){
            component.getElement().addEventListener("click", function(event){
                helper.handleClick(component, event, 'component');
            });
            document.addEventListener("click", function(event){
                helper.handleClick(component, event, 'document');
            });
            component.set("v.initializationCompleted", true);
            helper.setPickListName(component, component.get("v.selectedOptions"));
        }
        
    },
    
    onblurChange: function(component, event, helper) {
        let comp = component.find("MultiSelect")
        let compValue = comp.get("v.value");
        comp.set("v.readonly", false);
        comp.setCustomValidity("Enter an operating country");
        comp.reportValidity(); 
        compValue == "" ? '': component.set("v.setErrorMessage","Enter an operating country");  
        comp.set("v.readonly", true);
    },

    onInputChange : function(component, event, helper) {
        var inputText = event.target.value;
        helper.filterDropDownValues(component, inputText);
    },
    
    onRefreshClick : function(component, event, helper) {
        component.set("v.selectedOptions", []);
        helper.rebuildPicklist(component);
        helper.setPickListName(component, component.get("v.selectedOptions"));
    },
    
    onClearClick : function(component, event, helper) {
        component.getElement().querySelector('#filter-input').value = '';
        helper.resetAllFilters(component);
    },
    
    executeValidationCheck : function(component, event, helper) {
        let validationValue = event.getParam('arguments');
        let inputComp = component.find('MultiSelect');
        let ValueofComp = inputComp.get("v.value");
        if(validationValue.validation == 'true' && ValueofComp == 'Enter operating country/countries'){
            inputComp.set("v.value",'');
            inputComp.reportValidity();
        }else{
            inputComp.setCustomValidity("");
            inputComp.reportValidity(); 
        }
    }
})