({
	doInit : function(component, event, helper) {
	    component.set("v.RecordTypeIdValid", typeof (component.get("v.record.RecordTypeId")) != "undefined");
		var getFieldAttributes = component.get("c.getFieldAttributes");
        var fieldName = component.get("v.fieldName");
		let isCommBUser = component.get("c.isCommBUser");
		let canEditField = component.get("c.canEditField");
		let userId = $A.get( "$SObjectType.CurrentUser.Id" );
		getFieldAttributes.setParams({
			"sObj": component.get('v.record'),
			"fieldName": fieldName
		});

		getFieldAttributes.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if(state=="SUCCESS"){

					component.set("v.attributes",response.getReturnValue());
					    helper.setFieldValue(component, helper);


					//component.set("v.isLoading", false);
					if (component.get("v.attributes.accessible")
					    || component.get("v.skipFls")) {
					    helper.build(component, helper);
					}
				}
				else if (state === "ERROR") {
				    console.log(response.getError());
                }
			}
		})
		$A.enqueueAction(getFieldAttributes);

		isCommBUser.setParams({
		"userId": userId
		});
		isCommBUser.setCallback(this, function(response){

			let state = response.getState();
			if(state=="SUCCESS"){
				component.set('v.isCommBUser',response.getReturnValue())
			}
		});
		$A.enqueueAction(isCommBUser);

		canEditField.setParams({
			"objectType": 'Account',
			"field": 'Relationship_Group_Number__c'
		});
		canEditField.setCallback(this, function(response){
			let state = response.getState();
			if(state=="SUCCESS"){
				component.set('v.isGroupNumberEditable',response.getReturnValue())
			}
		});
		$A.enqueueAction(canEditField);
	},
	handleMouseOver : function(component, event, helper) {
		var fieldIcon = component.find("fieldIcon");
		if(fieldIcon){

			$A.util.removeClass(fieldIcon, 'unhover');
			$A.util.addClass(fieldIcon, 'hover');
			
		}

	},

	handleMouseOut : function(component, event, helper) {
		var fieldIcon = component.find("fieldIcon");
		if(fieldIcon){
			$A.util.removeClass(fieldIcon, 'hover');
			$A.util.addClass(fieldIcon, 'unhover');
		}

	},

	handleEdit : function(component, event, helper) {
		var attributes = component.get("v.attributes");
		var isReadOnly = component.get('v.readOnly');
        var isSkipFls  = component.get('v.skipFls');
		if(!isReadOnly
		    && attributes
		    && (attributes.updateable
		        || isSkipFls)){
			component.set("v.editMode", true);
			
			var componentAction = $A.get("e.c:ComponentAction");
		    componentAction.setParams({'data':{'name' : 'edit'}});
		    componentAction.fire();

			var componentAction = $A.get("e.c:ComponentAction");
		    componentAction.setParams({'data':{'name' : 'lock'}});
		    componentAction.fire();
		}
	},

	handleRichTextChange : function(component, event, helper){

		var helperRecord = component.get("v.helperRecord");
		var fieldValue = component.get("v.fieldValue");
		var attributes = component.get("v.attributes");
        var isReadOnly = component.get('v.readOnly');
        var isSkipFls  = component.get('v.skipFls');
		
		if(helperRecord.Rich_Text_Field__c!==fieldValue){
			
			if(!isReadOnly
			    && attributes
			    && (attributes.updateable
			        || isSkipFls)){
				helper.updateRecord(component, helperRecord.Rich_Text_Field__c);
			}
		}
	},

	handleValueChange : function(component, event, helper) {
		var attributes = component.get("v.attributes");
		var isSkipFls  = component.get("v.skipFls");
		var isReadOnly = component.get('v.readOnly');
		let clientRecord = component.get('v.record');
		var newValue = component.get("v.fieldValue");
		let isCommBUser = component.get('v.isCommBUser');
		let isGroupNumberEditable = component.get('v.isGroupNumberEditable');
		var recordFieldValue = helper.getRecordFieldValue(component);

		if(!isReadOnly
		    && attributes
		    && (attributes.updateable
		        || isSkipFls)
		    && JSON.stringify(recordFieldValue) !== JSON.stringify(newValue)){

		    var type = attributes.type;
		    var fieldName = component.get("v.fieldName");

            if(type == "ADDRESS"){
                helper.updateRecord(component, fieldName.replace("Address","City"), newValue.city);
                helper.updateRecord(component, fieldName.replace("Address","Country"), newValue.country);
                helper.updateRecord(component, fieldName.replace("Address","Street"), newValue.street);
                helper.updateRecord(component, fieldName.replace("Address","PostalCode"), newValue.postalCode);
                helper.updateRecord(component, fieldName.replace("Address","State"), newValue.state);
            }else {
            	helper.updateRecord(component, fieldName, newValue);
            	if(attributes.sobjectname == 'Account' && isCommBUser && newValue[0] && clientRecord['ParentId'] &&
					fieldName=='ParentId'){

            		helper.getParentRGN(component,clientRecord['ParentId']);
				}
            	else if(isCommBUser && isGroupNumberEditable && attributes.sobjectname == 'Account' && fieldName=='ParentId' && newValue[0] == undefined){

            		setTimeout($A.getCallback(function(results) {
						let rec = component.get("v.record");
						rec['Relationship_Group_Number__c'] = undefined;
						component.set("v.record",rec);
						helper.updateRecord(component,'Relationship_Group_Number__c',undefined);
					}),10);
				}

            }
		}
	},

	handleComponentAction: function(component,event, helper){
		if(component 
			&& event.getParam('data')
			&& event.getParam('data').name){

			var actionName = event.getParam('data').name;
			
			if(actionName=='edit'){

				component.set("v.editMode", true);
	

			}else if(actionName=='cancel'){
				component.set("v.editMode", false);
			}else if(actionName=='save'){
				component.set("v.editMode", false);
			}
		}
	},

	/*handleRecordFieldChange : function(component, event, helper) {
		var fieldName = event.getParam('fieldName');
		var properContext = event.getParam('id') && event.getParam('id') == component.get('v.record').Id;

		if (component
		    && properContext
		    && fieldName
		    && component.get("v.attributes")
		    && fieldName === component.get("v.attributes").controllingField) {
		    helper.build(component, helper);
		}
    },*/

	handleRecordChange : function(component,event, helper){
        helper.setFieldValue(component, helper);
        if (component.get("v.attributes.accessible")
            || component.get("v.skipFls")) {
            helper.buildInput(component);
        }
	},

	handleHasErrorChange : function(component, event, helper) {
	    if (component.get("v.hasError")) {
	        var cmp = component.find("inputField");
	        $A.util.addClass(cmp, "slds-has-error");
	    }
	    else {
	        $A.util.removeClass(component.find("inputComponent"), "slds-has-error");
        }
    },

    navigateToRecord : function (component, event, helper) {
        var fieldValue = component.get("v.fieldValue");
        if(fieldValue){
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
              "recordId": component.get("v.fieldValue")
            });
            navEvt.fire();
        }
    }
})