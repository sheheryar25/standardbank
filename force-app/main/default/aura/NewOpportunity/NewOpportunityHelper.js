({
    doInit : function(component, event, helper) {
        helper.getOpportunityData(component, event, helper);
		component.set("v.isLoading", false);
    },

    getOpportunityData : function(component, event, helper) {

	    var getOppData = component.get("c.getOpportunityData");
	    getOppData.setParams({
            sObjectName : component.get("v.sObjectName") ? component.get("v.sObjectName") : 'Opportunity',
            recordId : component.get("v.recordId")
        });

		getOppData.setCallback(this, function(response){
			if(component.isValid()){
				var state = response.getState();
				if (state === "SUCCESS"){
				    var returnValue = response.getReturnValue();
				    var oppRecord = returnValue.oppRecord;
				    oppRecord.sobjectType = 'Opportunity';
					component.set("v.oppRecord", oppRecord);
					component.set("v.isCommBUser", returnValue.isCommBUser);
					component.set("v.stages", returnValue.stages);
                    helper.createAdditionalSection(component, returnValue.additionalFields);
				}
				else if (state === "ERROR") {
				    component.set("v.errorMessage",  UTL.getErrorMessage(response.getError()));
                }

                var oppRecord = component.get("v.oppRecord");
                oppRecord.Lead_Source__c = 'Cross Sell';
                oppRecord.Probability = 10;
                var stages = component.get("v.stages");
                if(stages.length>0){
                    oppRecord.StageName = stages[0].value;
                }
                component.set("v.oppRecord", oppRecord);
			}
		})
		$A.enqueueAction(getOppData);
    },

    populateFields : function(component) {
        var oppRecord = component.get("v.oppRecord");
        var fieldsToPopulate = component.get("v.fieldsToPopulate");
        for (var key in fieldsToPopulate) {
            var fieldsToQuery = component.get("v.fieldsToQuery");
            if (! fieldsToQuery.includes(key)) {
                fieldsToQuery.push(key);
                component.set("v.fieldsToQuery", fieldsToQuery);
            }
            oppRecord[key] = fieldsToPopulate[key];
        }
        component.set("v.oppRecord", oppRecord);
    },

    createAdditionalSection : function(component, additionalFields) {
        if (!additionalFields || additionalFields.length === 0 || additionalFields.filter(this.isUndefined).length === 0) {
            return
        };
        component.set("v.showAdditionalInformation", true);

        $A.createComponent(
            "c:FieldSet",
            {
                fieldsToDisplay : additionalFields,
                columns : "2",
                record : component.getReference("v.oppRecord"),
                sObjectName : "Opportunity",
                showBorder : false,
                editMode : "true"
            },
            function(fieldSet, status, errorMessage) {
                if (status === "SUCCESS") {
                    var additionalSection = component.find("additionalSection");
                    additionalSection.set("v.body", fieldSet);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },

    isUndefined : function(value) {
        return value;
    },

	isValidForm : function(component) {
	    component.set("v.errorMessage", null);
        var requiredFields = component.get("v.isCommBUser") ? component.get("v.commBRequiredFields") : component.get("v.requiredFields");
        var oppRecord = component.get("v.oppRecord");
        var fieldName2FieldLabel = new Map();
        fieldName2FieldLabel.set('Name', 'Name');
        fieldName2FieldLabel.set('AccountId', 'Client Name');
        fieldName2FieldLabel.set('Lead_Source__c', 'Lead Source');
        fieldName2FieldLabel.set('Description', 'Detailed Description');
        fieldName2FieldLabel.set('StageName', 'Stage');
        fieldName2FieldLabel.set('Start_Date__c', 'Start Date');
        fieldName2FieldLabel.set('Probability', 'Probability (%)');
        fieldName2FieldLabel.set('CloseDate', 'Estimated Close Date');
        var missingFields = [];
        requiredFields.forEach(function(field) {
           var recordField = Array.isArray(component.find(field)) ? component.find(field)[0] : component.find(field);
           if (!oppRecord[field]) {
               missingFields.push(fieldName2FieldLabel.get(field));
               if (recordField) {
                   recordField.set("v.errorMessage", 'Complete this field');
                   recordField.set("v.hasError", true);
               }
           }
           else {
               if (recordField) {
                   recordField.set("v.errorMessage", null);
                   recordField.set("v.hasError", false);
               }
           }
        });
        var validForm = !(missingFields.length > 0);

        if (!validForm) {
            var errorMessage = 'These required fields must be completed: ' + missingFields.join(', ');
            component.set("v.errorMessage", errorMessage);
        }

        return validForm;
	}
})