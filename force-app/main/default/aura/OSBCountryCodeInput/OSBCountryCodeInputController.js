({
    init : function(component, event, helper) {
        helper.setCountryCodes(component);
        let selectedCode = component.get("v.selectedCode");
        let displayedCode = selectedCode.slice(selectedCode.lastIndexOf("+"), selectedCode.length);
        component.set("v.displayedCode", displayedCode);
    },

    switchMode : function(component, event, helper) {
        component.set("v.showCountryNames", !component.get("v.showCountryNames"));
    },

    switchModeOff : function(component, event, helper) {
        component.set("v.showCountryNames", !component.get("v.showCountryNames"));
        let dialingCodeField = component.find("dialingCode");
        let selectedCode = dialingCodeField.get("v.value");
        setTimeout(function(component, selectedCode) {
            component.set("v.selectedCode", selectedCode);
            let displayedCode = selectedCode.slice(selectedCode.lastIndexOf("+"), selectedCode.length);
            component.set("v.displayedCode", displayedCode);
        }, 0, component, selectedCode);
    }
});