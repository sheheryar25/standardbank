//2017-11-02 - Rudolf Niehaus - CloudSmiths
({
    doInit : function(component, event, helper){
        var parentCase = component.get("v.recordId");
        helper.relatedCases(component, parentCase);
    },
    logId : function(component, event, helper){
        var selectedCaseId = event.getSource().get("v.text");
        component.set("v.relatedCaseId", selectedCaseId);
    },
    mergeCaseNow : function(component, event, helper){
         var case2Merge = component.get("v.recordId");
         var selectedId = component.get("v.relatedCaseId");
         helper.mergeCaseAction(component, selectedId, case2Merge);
    },
    openNewTab : function(component, event, helper){
         var caseId = event.getSource().get("v.title");
         helper.openTab(component, event, caseId);
    },
    getRecord : function(component, event) {	
        var selectedCaseId = event.getSource().get("v.Id");
        var tempRec = component.find("viewRecord");
        tempRec.set("v.recordId", selectedCaseId);
        tempRec.getNewRecord();
		
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