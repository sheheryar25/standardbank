({
    doInit : function(component, event, helper) {
        var getRecord = component.get("c.getRecord");
        getRecord.setParams({
            "caseId": component.get("v.recordId")
        });
        getRecord.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.caseRecord", response.getReturnValue());
            }
        });
        $A.enqueueAction(getRecord);
        var getStatuses = component.get("c.getStatuses");		
        getStatuses.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.options", response.getReturnValue());							
            }
        });
        $A.enqueueAction(getStatuses);		
    },
    openModel : function(component, event, helper) {
        component.set("v.isModalOpen", true);
        
    },
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    submitDetails: function(component, event, helper) {
        if(component.isValid()){
            var saveRecord = component.get("c.saveRecord");
            console.log('component.get("v.caseRecord") ' + component.get("v.caseRecord"));
            var caseRecord=component.get("v.caseRecord");
            if(caseRecord.Priority == null || caseRecord.Type ==null ||
              caseRecord.AccountId == null || caseRecord.CCC_Angola_Category__c == null ||
              caseRecord.CCC_Angola_Sub_Category__c == null || caseRecord.CCC_Angola_Team__c == null){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error",
                    "message": "Por favor, preencha o campo Obrigatório Status, Prioridade, Equipe, Categoria, Subcategoria, Tipo e Detalhes do Cliente",
                    "type":"Error"
                });
                component.set("v.isModalOpen", false);
                toastEvent.fire();}
            else{
                saveRecord.setParams({
                    "caseRecordUpdate": component.get("v.caseRecord"),
                    "selectedRecord" : component.get("v.selectedRecord")
                });
                saveRecord.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS"){
                        $A.get("e.force:closeQuickAction").fire();	
                        component.set("v.isModalOpen", false);
                        $A.get('e.force:refreshView').fire();
                    }
                    if (state === "ERROR") {
                        component.set("v.errorMsg",response.getError()[0].pageErrors[0].message);
                        component.set("v.isModalOpen", false);
                    }
                });
            }
            $A.enqueueAction(saveRecord);
        }
    },
    onfocus : function(component,event,helper){
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC  
        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);
    },
    onblur : function(component,event,helper){       
        component.set("v.listOfSearchRecords", null );
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 0 ){
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
    
    // function for clear the Record Selaction 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );   
    },
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        // get the selected Contact record from the COMPONETN event 	 
        var selectedContactGetFromEvent = event.getParam("recordByEvent");
        component.set("v.selectedRecord" , selectedContactGetFromEvent); 
        
        var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
        
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
        var lookUpTarget = component.find("lookupField");
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');  
        
    },
})