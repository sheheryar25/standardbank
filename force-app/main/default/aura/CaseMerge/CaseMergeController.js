({
    doInit : function(component, event, helper){
        var parentCase = component.get("v.recordId");
        helper.relatedCases(component, parentCase);
    },
    openNewTab : function(component, event, helper){
        var caseId = event.getSource().get("v.title");
         window.open('/' +caseId);  
    },
    mergeCaseNow : function(component, event, helper){
        var case2Merge = component.get("v.recordId");
        var selectedId = component.get("v.relatedCaseId");
        if(selectedId == null){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error",
                "message": "Please Select Case Record",
                "type":"error"
            });
            
            toastEvent.fire();
        }
        if(selectedId != null){
            helper.mergeCaseAction(component, selectedId, case2Merge);
        }
    },
    mergeMultipleCaseNow : function(component, event, helper){
        var case2Merge =component.get("v.recordId");
        var selectedId =component.get("v.lstSelectedRecords");
        if(selectedId.length == 0){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error",
                "message": "Please Select Case Record",
                "type":"error"
            });
            
            toastEvent.fire();
        }
        if(selectedId.length > 0){
            helper.mergeMultipleCaseAction(component, case2Merge, selectedId);  
        }
    },
    logId : function(component, event, helper){
        var selectedCaseId = event.getSource().get("v.text");
        component.set("v.relatedCaseId", selectedCaseId);
    },
    showSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("TheSpinner");
        $A.util.addClass(spinner, "slds-hide");
        
    },
    getRecord : function(component, event) {	
        var selectedCaseId = event.getSource().get("v.Id");
        var tempRec = component.find("viewRecord");
        tempRec.set("v.recordId", selectedCaseId);
        tempRec.getNewRecord();
        
    },
    onblur : function(component,event,helper){
        // on mouse leave clear the listOfSeachRecords & hide the search result component 
        component.set("v.listOfSearchRecords", null );
        component.set("v.SearchKeyWord", '');
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },
    onfocus : function(component,event,helper){
        // show the spinner,show child search result component and call helper function
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        component.set("v.listOfSearchRecords", null ); 
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC 
        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);
    },
    
    keyPressController : function(component, event, helper) {
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if(getInputkeyWord.length > 0){
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    
    // function for clear the Record Selection 
    clear :function(component,event,heplper){
        var selectedPillId = event.getSource().get("v.name");
        var AllPillsList = component.get("v.lstSelectedRecords"); 
        
        for(var i = 0; i < AllPillsList.length; i++){
            if(AllPillsList[i].Id == selectedPillId){
                AllPillsList.splice(i, 1);
                component.set("v.lstSelectedRecords", AllPillsList);
            }  
        }
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );      
    },
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        component.set("v.SearchKeyWord",null);
        // get the selected object record from the COMPONENT event 	 
        var listSelectedItems =  component.get("v.lstSelectedRecords");
        var selectedCaseGetFromEvent = event.getParam("recordByEvent");
        listSelectedItems.push(selectedCaseGetFromEvent);
        component.set("v.lstSelectedRecords" , listSelectedItems); 
        var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
        
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open'); 
    },
})