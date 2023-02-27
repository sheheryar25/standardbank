({
	doInit : function(component, event, helper) {
		Promise.all([
			helper.promiseGetProspectRecordTypeId(component)
			])
			.then(
				$A.getCallback(function(result) {
					var account = component.get("v.account");
					account.RecordTypeId = result[0];
					account.Status__c = 'Prospect';
					component.set("v.account", account);
					component.set("v.isLoading", false);
				}),
				$A.getCallback(function(errors) {
					component.set("v.isLoading", false);
					component.set("v.hasError", true);
					component.set("v.errorMessage", helper.getErrorMessage(errors));
			})
		);
		helper.applyCSS(component);
	},

	onCancel : function(component, event, helper) {
		helper.revertCssChange(component);
		var cancel = component.getEvent("oncancel");
		cancel.fire();
	},

	onSave : function(component, event, helper) {

		var account_record = component.get( "v.account" );

		//check if client coordinator has been filled in
        if( !account_record.Client_Co_ordinator__c ){

            component.set( "v.hasError", true );            //set the component to true
            component.set( "v.errorMessage", "Proposed Client Coordinator Field must be Populated." );          //set our error messages

            return;             //terminate function

        }//end of if-block

		helper.revertCssChange(component);
		var save = component.getEvent("oncreated");
		save.fire();
	}

});