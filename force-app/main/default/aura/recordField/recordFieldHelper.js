({
	build : function(component) {
		if(component && component.get("v.attributes")){
				this.buildInput(component);
				this.buildOutput(component);
		}
	},

	buildInput :  function(component) {
	    var helper = this;
		var attrs = component.get("v.attributes");

		if(!attrs){
            return;
        }

		var type = attrs.type;
		var showLabel = component.get("v.showLabel");
		var componentName;
		var componentAttrs = {};

		componentAttrs['aura:id'] = 'inputComponent';

		componentAttrs.value = component.getReference("v.fieldValue");

		/*if(type=="PICKLIST" || type=="MULTIPICKLIST"){
			componentName = "ui:inputSelect";
			let options;
			if (!$A.util.isEmpty(attrs.controllingField)) {
			    options = [attrs.options[0]];
			    options = options.concat(helper.getAllowedDependentValues(component.get("v.record"), attrs));
            }
            else {
                options = attrs.options;
            }
            var unwantedValues = component.get("v.pickListValuesToRemove");
      	    if(!$A.util.isEmpty(unwantedValues)) {
                options = options.filter(val => !unwantedValues.includes(val.value));
            }
			componentAttrs.options = options;

			if(type=="MULTIPICKLIST"){
			    componentAttrs.multiple = 'true';
			    componentAttrs.class = 'multiple';
            }

		}else*/ if(type=="TEXTAREA" && !attrs.htmlFormatted ){
			componentName = "lightning:textarea" ;
			componentAttrs.name = component.get('v.fieldName');

			if(!showLabel && attrs.label){
				componentAttrs.placeholder = attrs.label;
			}

			componentAttrs.label = attrs.label;
			componentAttrs.variant = 'label-hidden';
			componentAttrs.class = 'block';

			componentAttrs.maxlength = attrs.length;

			//componentAttrs.change = null;
            componentAttrs.onchange = component.getReference("c.handleValueChange");
		}/*else if(type=="PERCENT" || type=="INTEGER" ||type=="DOUBLE" ){
			componentName = "ui:inputNumber";
			componentAttrs.change = component.getReference("c.handleValueChange");
		}*/else if(type=="BOOLEAN"){
			componentName = "ui:inputCheckbox";
			componentAttrs.change = component.getReference("c.handleValueChange");
		}else if(type=="REFERENCE" && $A.get("$Browser.formFactor") != 'DESKTOP'){
			componentName = "c:UTL_LookupField";
			componentAttrs.fieldName = component.get("v.fieldName");
			componentAttrs.assignTo = component.getReference("v.fieldValue");
			componentAttrs.sObjectName = attrs.sobjectname;
			componentAttrs.referToObjectName = attrs.referenceTo;
			componentAttrs.enableAddNew = attrs.referenceToIsCreatable;
			componentAttrs.onchange = component.getReference("c.handleValueChange");
		}else if(type=="STRING" || type=="HYPERLINK" || type=="PHONE" || type=="URL"){
			componentName = "ui:inputText";
			if(!showLabel && attrs.label){
				componentAttrs.placeholder = attrs.label;
			}
			componentAttrs.maxlength = attrs.length;
			componentAttrs.change = component.getReference("c.handleValueChange");
		}else if(type=="COMBOBOX"){
			componentName = "ui:inputText";
			if(!showLabel && attrs.label){
				componentAttrs.placeholder = attrs.label;
			}
			componentAttrs.change = component.getReference("c.handleValueChange");
		}/*else if(type=="DATETIME"){
			componentName = "ui:inputDateTime";
			componentAttrs.change = component.getReference("c.handleValueChange");
		}*/else if(type=="CURRENCY"){
			componentName = "ui:inputCurrency";
			componentAttrs.format = "0.00";
			if(!showLabel && attrs.label){
				componentAttrs.placeholder = attrs.label;
			}
			componentAttrs.change = component.getReference("c.handleValueChange");
		}/*else if(type=="DATE"){
			componentName = "ui:inputDate";
			componentAttrs.displayDatePicker = true;
			componentAttrs.change = component.getReference("c.handleValueChange");
		}*/else if(type == "ADDRESS"){
		    componentName = "lightning:inputAddress";
            this.setAddressAttributes(component,componentAttrs);

            componentAttrs.onchange = component.getReference("c.handleValueChange");
        }else{
            componentName = "lightning:inputField";//
            componentAttrs.fieldName = component.getReference("v.fieldName");//
            componentAttrs.onchange = component.getReference("c.handleValueChange");
            componentAttrs.variant = "label-hidden";
        }

		if(componentName){
			this.buildComponent(componentName, componentAttrs, component, "inputField");
		}
	},

    /*getAllowedDependentValues : function(record, attrs) {
        return attrs.options.filter(function(option) {
            if ($A.util.isEmpty(option.controllingValues)) {
                return false;
            }
            return option.controllingValues.includes(record[attrs.controllingField]);
        });
    },*/

	buildOutput :  function(component) {
		var attrs = component.get("v.attributes");

		if(!attrs){return;}

		var type = attrs.type;
		var componentName = "lightning:outputField";//
		var componentAttrs = {};
		componentAttrs.fieldName = component.getReference("v.fieldName");
		componentAttrs.value = component.getReference("v.fieldValue");
		componentAttrs.class="slds-form-element__static";

		if(type=="TEXTAREA"){
			if(attrs.htmlFormatted){
				componentName = "lightning:formattedRichText";
			}else{
				componentName = "lightning:formattedText";
			}
		}else if(type=="CURRENCY"){
			componentName = "c:outputCurrency";
			//componentAttrs.format = component.get("v.record").CurrencyIsoCode + " ###,###,###,##0.00";
			componentAttrs.format = "###,###,###,##0.00";
			componentAttrs.isoCode = component.get("v.record").CurrencyIsoCode;
			componentAttrs.convertedValue = attrs.convertedValue;
			componentAttrs.convertedIsoCode = attrs.convertedIsoCode;;
		}else if(type=="PERCENT"){
			componentName = "ui:outputNumber";
			componentAttrs.format = "###0.00";
		}else if(type=="INTEGER"){
			componentName = "lightning:formattedNumber";
		}else if(type=="DOUBLE"){
			componentName = "lightning:formattedNumber";
		}else if(type=="DATETIME"){
			componentName = "lightning:formattedDateTime";
		}else if(type=="DATE"){
			componentName = "ui:outputDate";
		}else if(type=="STRING"){
			componentName = "lightning:formattedText";
		}else if(type=="COMBOBOX"){
			componentName = "lightning:formattedText";
		}else if(type=="PICKLIST"){
			componentName = "lightning:formattedText";
		}else if(type=="HYPERLINK"){
			componentName = "aura:unescapedHtml";
		}else if(type=="URL"){
            componentName = "lightning:formattedText";
        }else if(type=="PHONE"){
             componentName = "lightning:formattedText";
         }else if(type=="BOOLEAN"){
			componentName = "ui:outputCheckbox";
		}else if(type=="REFERENCE"){
			componentName = "lightning:formattedURL";
			var relatedRecordNameField = component.get("v.fieldName").replace("__c","__r").replace("Id","")+".Name";

			componentAttrs.label = component.getReference("v.record."+relatedRecordNameField);
			componentAttrs.value = component.getReference("v.linkValue");
		}else if(type=="ADDRESS"){
		    componentName = "lightning:formattedAddress";
		    this.setAddressAttributes(component,componentAttrs);
        }else if(type=="MULTIPICKLIST"){
            componentName = "lightning:formattedText";
        }
		
		if(componentName){
			this.buildComponent(componentName, componentAttrs, component, "outputField");
		}
	},

	setAddressAttributes: function(component, componentAttrs){

	    componentAttrs.addressLabel = "Address";
        componentAttrs.streetLabel = "Street";
        componentAttrs.cityLabel = "City";
        componentAttrs.countryLabel = "Country";
        componentAttrs.provinceLabel = "State";
        componentAttrs.postalCodeLabel = "Postal Code";

        var fieldValue = component.get("v.fieldValue");
        console.log('Address FieldValue: '+fieldValue);
        componentAttrs.value = null;
	    componentAttrs.city = component.getReference("v.fieldValue.city");
        componentAttrs.street = component.getReference("v.fieldValue.street");
        componentAttrs.country = component.getReference("v.fieldValue.country");
        componentAttrs.province = component.getReference("v.fieldValue.state");
        componentAttrs.postalCode = component.getReference("v.fieldValue.postalCode");
    },

	setFieldValue : function(component, helper) {

		var fieldValue = component.get("v.fieldValue");
		var attrs = component.get("v.attributes");
        var fieldName = component.get("v.fieldName");
		if(!attrs){return;}

		var recordFieldValue = this.getRecordFieldValue(component);


        var type = attrs.type;

		if(JSON.stringify(fieldValue) != JSON.stringify(recordFieldValue)){
            component.set("v.fieldValue", recordFieldValue);
            var linkValue = "";
            if(recordFieldValue != null){
                linkValue = "/" + recordFieldValue;
            }
            component.set("v.linkValue", linkValue);

			var attributes = component.get("v.attributes");
			if(attributes && attributes.htmlFormatted){
				var helperRecord = component.get("v.helperRecord");
				helperRecord.Rich_Text_Field__c = recordFieldValue;
				component.set("v.helperRecord", helperRecord);
			}
		}
		helper.setExceptionValues(component, helper, fieldName, fieldValue);

	},

	setExceptionValues : function(component, helper, fieldName, fieldValue){
	    if (fieldName === "CurrencyIsoCode" && !fieldValue) {
                 let newValue = $A.get("$Locale.currencyCode");
                 component.set("v.fieldValue", newValue);
                 helper.updateRecord(component, fieldName, newValue);
             }
    },

	getRecordFieldValue : function(component) {
        var nameParts = component.get("v.fieldName").split('.');
        var record = component.get("v.record");
        var attrs = component.get("v.attributes");

        if(!record || !attrs){return;}

        for(var i = 0 ; i < nameParts.length-1; i++){
            record = record[nameParts[i]];
        }

        var type = attrs.type;
        var recordFieldValue =  {};
        if(type=="ADDRESS"){
            recordFieldValue.city = record[nameParts[nameParts.length-1].replace("Address","City")];
            recordFieldValue.country = record[nameParts[nameParts.length-1].replace("Address","Country")];
            recordFieldValue.street = record[nameParts[nameParts.length-1].replace("Address","Street")];
            recordFieldValue.postalCode = record[nameParts[nameParts.length-1].replace("Address","PostalCode")];
            recordFieldValue.state = record[nameParts[nameParts.length-1].replace("Address","State")];
         }else{
            recordFieldValue = record[nameParts[nameParts.length-1]];
         }

        return recordFieldValue;
    },

	updateRecord : function(component, fieldName, newValue){
		//var rec = component.get("v.record");
        newValue = newValue ? newValue.toString() : newValue ;
        component.get("v.record")[fieldName] = newValue;
		//rec[fieldName] = newValue;
		//component.set("v.record",rec);

		var componentAction = $A.get("e.c:RecordFieldChange");
	    componentAction.setParams({
	    	'fieldName': fieldName
	    	,'fieldValue' : newValue
			,'id' :  component.get("v.record").Id
		});
	    componentAction.fire();
	},

	buildComponent :  function(componentName, componentAttrs, component, divName) {
		if(componentName){
			$A.createComponent(
				componentName
				,componentAttrs
				,
				function(newComponent, status, errorMessage){
					if (status === "SUCCESS") {

						var container = component.find(divName);
	                    var body = container.get("v.body");
	                    body[0] = newComponent;
	                    //body.unshift(newComponent);
	                    container.set("v.body", body);
	                }
	                else if (status === "INCOMPLETE") {
	                    console.log("No response from server or client is offline.")
	                    // Show offline error
	                }
	                else if (status === "ERROR") {
	                    console.log("Error: " + errorMessage);
	                    // Show error message
	                }

				}
			);
		}
	}
	,getParentRGN:function(component,parentId){
		let action = component.get("c.getParentRGN");
		let isGroupNumberEditable = component.get("v.isGroupNumberEditable");
		let rec = component.get("v.record");
		action.setParams({
			"parentId": parentId
		});

		action.setCallback(this, function(response){

			let state = response.getState();
			if(state=="SUCCESS"){
				let data = response.getReturnValue();
					rec['Relationship_Group_Number__c'] = data.Relationship_Group_Number__c;
					component.set("v.record",rec);
					if(isGroupNumberEditable) {
						this.updateRecord(component, 'Relationship_Group_Number__c', data.Relationship_Group_Number__c);
					}
					if(!data.Relationship_Group_Number__c){
						this.groupNumberWarning();
					}

			}
			else if (state === "ERROR") {
				this.errorMsg('Could not fetch the parent client.');
			}
		})
		$A.enqueueAction(action);
	},
	groupNumberWarning:function () {
		let  resultsToast = $A.get("e.force:showToast");

		resultsToast.setParams({
			"title": "Relation Group Number",
			"message": "This parent does not have a Relationship Group Number.",
			"type" : "warning",
			"mode" : "sticky"
		});
		resultsToast.fire();
	},
	errorMsg:function (msg) {
		let  resultsToast = $A.get("e.force:showToast");

		resultsToast.setParams({
			"title": 'An issue has occurred.',
			"message": msg,
			"type" : "error",
			"mode" : "sticky"
		});
		resultsToast.fire();
	}
})