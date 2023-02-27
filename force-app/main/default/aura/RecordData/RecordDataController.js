({
	doInit : function(component, event, helper) {
        helper.buildComponents(component);

		var getFields = component.get("c.getFields");

		getFields.setParams({
			"recordId" : component.get("v.recordId")
		});

		getFields.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS"){
					component.set("v.fields", response.getReturnValue());
				}
			}
		});

		$A.enqueueAction(getFields);
		
	},

	handleFieldChange : function(component, event, helper) {
		var fieldName = event.getParam('fieldName');
		var propperContext = event.getParam('id') && event.getParam('id') == component.get('v.recordId');

		if(component && fieldName && propperContext ){
		    var rec = component.get("v.simpleRecord");
			if(rec){
			    var newValue = event.getParam('fieldValue');

			    //check if we have Industry code
                if(  ( fieldName === "Industry_Code__c" ) && $A.util.isUndefinedOrNull( newValue ) )
                    return;                 //terminate function

				if (typeof rec[fieldName] == 'boolean')
			    {
                    if(newValue.toString() == 'true')
                    	rec[fieldName] = true;
                    else if(newValue.toString() == 'false')
                    	rec[fieldName] = false;
                }
				else
			    	rec[fieldName] = newValue ? newValue.toString() : newValue ;
			}
			component.set("v.simpleRecord", rec);
		}
	},

	handleComponentAction : function(component, event, helper) {
		if(component 
			&& event.getParam('data')
			&& event.getParam('data').name){

			var actionName = event.getParam('data').name;
			
			if(actionName=='edit'){
                var buttons = component.find("buttons");
                $A.util.removeClass(buttons, "slds-hide");
			}
		}
	},

	saveAction : function(component, event, helper) {
		helper.doSave(component, event, helper);
	},

	cancelAction : function(component, event, helper) {
		helper.doCancel(component, event, helper);
	},

	handleToastMessage : function(component,event,helper){
		if(event.getParams().type === "success" ){
			helper.doReload(component, event, helper);
		}
	},

})