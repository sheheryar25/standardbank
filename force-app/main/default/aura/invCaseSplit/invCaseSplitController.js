//2017-11-02 - Rudolf Niehaus - CloudSmiths
({
    doInit : function(component, event, helper){
        var parentCase = component.get("v.recordId");
        helper.getCase1(component);
        helper.getRenderIFStatus(component, event, parentCase);
    },
    handleCancel: function(component, event, helper) {
        helper.cancelAction(component);
        //$A.get('e.force:refreshView').fire();
    },
    handleSplit: function(component, event, helper) {
        
        var parentCase = component.get("v.recordId");
        var varCase1 = component.get("v.case1");
        helper.saveCase1(component, varCase1, parentCase);
        
        //$A.get('e.force:refreshView').fire();
		
	},
    showSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.addClass(spinner, "slds-hide");
    
    }
})