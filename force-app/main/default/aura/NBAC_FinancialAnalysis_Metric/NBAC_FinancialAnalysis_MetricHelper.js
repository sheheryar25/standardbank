({
	fetchData: function (component, helper) {
		var getData = component.get("c.getData");

		getData.setParams({
			"contextRecordId"	: component.get("v.recordId"),
			"relationName"		: component.get("v.relationName"),
			"parrentField"		: component.get("v.parent"),
			"fieldSetName"		: component.get("v.fieldset"),
			"filters"			: component.get("v.filters"),
			"defaults"			: component.get("v.defaults"),
		});
		
		getData.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS") {
					var DTOresponse = response.getReturnValue();
					console.log(DTOresponse);
					if(DTOresponse.records) {
						component.set("v.records", DTOresponse.records);
						component.set("v.isLoading", false);
					}
					if(DTOresponse.fields) {	
						component.set("v.fieldNames", DTOresponse.fields);
						helper.overrideLabels(component);
					}
					if(DTOresponse.objectName) {
						component.set("v.objectApiName", DTOresponse.objectName);
					}
					if(DTOresponse.objectLabel) {
						component.set("v.objectLabel", DTOresponse. objectLabel);
					}			
					if(DTOresponse.defaultValues) {
						component.set("v.defaultFieldValuesMap", DTOresponse. defaultValues);
					}
					helper.overrideLabels(component);			
				}
			}
		}); 
		component.set("v.isLoading", true);
		$A.enqueueAction(getData);		
	},
	getColumnHeader: function (component, helper) {
		var getColumns = component.get("c.getColumns");
		 
		getColumns.setParams({
			"fields"	: component.get("v.columnString")
		});
		
		getColumns.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS") {
					var fieldresponse = response.getReturnValue();
					if(fieldresponse){
						component.set('v.columnFieldObject',fieldresponse);
					}							
				}
			}
		}); 
		$A.enqueueAction(getColumns);	
	},
	populateMockRecord: function (component, helper) {
		var getMock = component.get("c.getMock");
		 
		getMock.setParams({
			"recordId"	: component.get("v.recordId"),
			"fields"	: component.get("v.columnString")
		});
		
		getMock.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS") {
					var mock = response.getReturnValue();
					if(mock){
						component.set('v.tableHeaderMockup',mock);
					}							
				}
			}
		}); 
		$A.enqueueAction(getMock);	
	},
	populateColumnChanges: function (component, helper) {
		var mock = component.get('v.tableHeaderMockup');
		var fieldsWrapper = component.get('v.columnFieldObject');
		var records = component.get('v.records');
		for(var j = 0 ; j < records.length ; j++){
			for(var i = 0 ; i < fieldsWrapper.length ; i++){				
				records[j][fieldsWrapper[i].apiName] = mock[fieldsWrapper[i].apiName];
			}
		}
		component.set('v.records', records);
	},
	saveData: function (component, helper) {
		if(!component.get("v.records").length >0){
		return;
		}
		var records = component.get("v.records");
		var saveRecords = component.get("c.saveRecords");
		saveRecords.setParams({
			"record"	: records,
			"defaults"	: component.get("v.defaultFieldValuesMap")
		});
		saveRecords.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS"){					
					helper.fetchData(component, helper);
					component.set('v.editMode',false);
					//helper.showToast('The records have been saved');
				}
			}
		});
		$A.enqueueAction(saveRecords);			
	},
	addRow : function (component) {
		var records = component.get('v.records');
		var fieldsWrapper = component.get("v.fieldNames");
		var newRecord = {};
		newRecord['sobjectType'] = component.get("v.objectApiName");
		for(var i = 0 ; i < fieldsWrapper.length ; i++){
			newRecord[fieldsWrapper[i].apiName] = '';
		}
		records.push(newRecord);
		component.set('v.records',records);
	},
	removeRow : function (component, helper, recordToDeleteIndex){
		var records = component.get('v.records');
		var recordToBeRemoved = records[recordToDeleteIndex];
		if(recordToBeRemoved['Id'] || ! helper.hasNotEmptyFields(component,recordToBeRemoved)) {
			component.set('v.removeAtIndex',recordToDeleteIndex);
			helper.showModal(component, helper, recordToDeleteIndex);
		} else {
			helper.removeRowOnlyFrontSite(component, helper, records, recordToDeleteIndex);
		}
	},
	removeRowOnlyFrontSite :  function (component, helper, records, index) {
		records.splice(index, 1);
		component.set('v.records', records);
		helper.showToast('The record has been deleted');
	},
	removeActionConfirmed :  function (component, helper){
		var records = component.get('v.records');
		var index = component.get('v.removeAtIndex');
		if(records[index]['Id']){
			helper.removeServerSide(component, helper, records, index);
		} else {
			helper.removeRowOnlyFrontSite(component, helper, records, index);
		}
	},
	removeServerSide : function (component, helper, records, index){
		var removeAction = component.get("c.removeRecord");

		removeAction.setParams({
			"record"	: records[index]
		});
		
		removeAction.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state === "SUCCESS"){
					helper.removeRowOnlyFrontSite(component, helper, records, index);
					helper.hideModal(component);					
				}
			}
		}); 
		$A.enqueueAction(removeAction);		
	},
	hasNotEmptyFields : function (component,record) {
		var fieldWrapers = component.get('v.fieldNames');
		console.log('hnef :' + record);
		var isNotEmpty = false;
		for(var i = 0 ; i < fieldWrapers.length && !isNotEmpty;  isNotEmpty |= record[fieldWrapers[i++].apiName]){}
		return !isNotEmpty;
	},
	overrideLabels : function (component) {
		var fields = component.get("v.fieldNames");
		if($A.util.isUndefinedOrNull(component.get("v.customLabels"))){return;}
		var customLabels = component.get("v.customLabels").split(';');
		for(var i = 0 ; i < Math.min(customLabels.length, fields.length) ; i++){
			if(customLabels[i]){
				fields[i].label = customLabels[i];
			}
		}
		component.set("v.fieldNames", fields);
	},
	showModal : function (component, helper) {
		$A.createComponent(
			"c:ModalConfirm",
			{
				"aura:id" : "confirmModal",
				"header" : 'Delete ' + component.get("v.objectLabel"),
				"text" : "Are you sure you want to delete this "+ component.get("v.objectLabel"),
				"brandText" : "Delete",
				"onneutral" : component.getReference('c.modalabortremoval'),
				"onbrand" : component.getReference('c.modalconfirmremoval'),			
				"onclose" : component.getReference('c.modalabortremoval')
			},
			function(modalComponent, status, errorMessage){
				if (status === "SUCCESS") {
					var body = component.get("v.body");
					body.push(modalComponent);
					component.set("v.body", body);
				}
				else if (status === "INCOMPLETE") {
					console.log("No response from server or client is offline.")
				}
				else if (status === "ERROR") {
					console.log("Error: " + errorMessage);
				}
				
			}
		);
	},
	hideModal : function (component) {
		var modals = component.find({ instancesOf : "c:ModalConfirm"});
		for(var i = 0 ; i < modals.length ; i++){
			modals[i].destroy();
		}
	},
	showToast : function(message) {
		var toastEvent = $A.get("e.force:showToast");
		toastEvent.setParams({
			"title": "Success!",
			"message": message
		});
		toastEvent.fire();
}


})