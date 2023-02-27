({
    doInit : function(component, helper) {
        var unwantedValues = ['Unknown Sub-Sector','Unknown - Financial Institutions', 'Unknown - Industrials', 'Unknown - Mining and Metals' , 'Unknown - Oil and Gas',
                                'Unknown - Power and Infrastructure', 'Unknown - Real Estate', 'Unknown - Sovereign / Public Sector', 'Unknown - Telecoms and Media', 'Unknown Sector'];
        component.set('v.unwantedPickListValues', unwantedValues); 
        let getComponentAttributes = component.get("c.getComponentAttributes");
        getComponentAttributes.setCallback(this, function(response) {
            if (component.isValid()) {
                let state = response.getState();
                if (state === 'SUCCESS') {
                    let results = response.getReturnValue();
                    component.set("v.fieldsToQuery", results.fieldsToQuery);
                    component.set("v.potentialRTId", results.potentialClientRecordTypeId);
                    component.set("v.is_commB", results.is_comm_b );

                }
                else if (state === 'ERROR') {
                    helper.showNotification(component, UTL.getErrorMessage(response.getError()));
                    component.set('v.isWaiting', false);
                }
            }
        });
        $A.enqueueAction(getComponentAttributes);
    },

    showNotification : function(component, message, header, variant) {
        component.find("notifLibrary").showNotice({
            variant: $A.util.isEmpty(variant) ? "error" : variant,
            header: $A.util.isEmpty(header) ? "Review the errors on this page." : header,
            message: message
        });
    },

    isValidForm : function(component, helper) {
        let requiredFields = component.get("v.requiredFields");
        let account = component.get("v.account");
        let fieldName2FieldLabel = new Map();
        fieldName2FieldLabel.set('Primary_Relationship_Holder__c', 'Primary Relationship Holder');
        fieldName2FieldLabel.set('Name', 'Name');
        fieldName2FieldLabel.set('Client_Sector__c', 'Client Sector');
        fieldName2FieldLabel.set('Client_Sub_Sector__c', 'Client Sub-Sector');
        fieldName2FieldLabel.set('Client_Co_ordinator__c', 'Client Co-ordinator');
        fieldName2FieldLabel.set('Client_Relationship_Hierarchy__c', 'Client Relationship Hierarchy');
        fieldName2FieldLabel.set('ISIC_C_ode__c', 'ISIC Code');
        let missingFields = [];
        requiredFields.forEach(function(field) {
            let recordField = component.find(field);
            if (!account[field]) {
                missingFields.push(fieldName2FieldLabel.get(field));
                if (recordField && recordField.isInstanceOf('c:recordField')) {
                    recordField.set("v.errorMessage", 'Complete this field');
                    recordField.set("v.hasError", true);
                }
            }
           else {
               if (recordField && recordField.isInstanceOf('c:recordField')) {
                   recordField.set("v.errorMessage", null);
                   recordField.set("v.hasError", false);
               }
           }
        });
        let validForm = !(missingFields.length > 0);

        if (!validForm) {
            let errorMessage = 'These required fields must be completed: ' + missingFields.join(', ');
            helper.showNotification(component, errorMessage, 'Required fields are missing', 'warning');
        }

        return validForm;
    }
})