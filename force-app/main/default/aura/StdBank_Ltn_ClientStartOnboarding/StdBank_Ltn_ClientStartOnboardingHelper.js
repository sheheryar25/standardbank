({
    validateRecord: function(component) {
        var isValid = true;

        var picklistKYC = component.get("v.record.KYC_Location__c");
        var picklistRR = component.get("v.record.Relationship_Roles__c");
		        
        if ($A.util.isEmpty(picklistKYC)) {
            isValid = false;
            component.find('KycLoc').set("v.errorMessage", "KYC Location can't be blank");
        } else {
            component.find('KycLoc').set("v.errorMessage", null);
        }

        if ($A.util.isEmpty(picklistRR)) {
            isValid = false;
           component.find('RelRoles').set("v.errorMessage", "Relationship Roles can't be blank");
           return(isValid);
        } else {
            component.find('RelRoles').set("v.errorMessage", null);
        }

        if (picklistKYC.toLowerCase().indexOf("none") >= 0
           && picklistKYC.toLowerCase().indexOf("asia") >= 0) {
            if(picklistRR.toLowerCase() == "potential client") {
                isValid = true;
            } else {
                isValid = false;
                component.find('RelRoles').set("v.errorMessage", "For this KYC Location you can only select Potential Client as a Relationship Role");
            }
        }
        
        return(isValid);
    },
    updateRecord: function(component, helper) {
        component.set("v.errorMessage", null);
        var record = component.get('v.record');
        record.Update_Path__c = true;
        var recordId = component.get('v.recordId');
        record.Id = recordId;

        component.find("recordData").saveRecord(function(saveResult) {
            if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                 helper.showToast('success', 'Update succeed!', 'Record was updated successfully...');
                 $A.get('e.force:refreshView').fire();
                 $A.get("e.force:closeQuickAction").fire();
                 setTimeout(function() {
                     var editRecordEvent = $A.get("e.force:editRecord");
                     editRecordEvent.setParams({
                         "recordId": recordId
                     });
                     editRecordEvent.fire();
                 }, 3000)
            }
        });
    },
    showToast : function(type, title, message) {
        var toastEvent = $A.get("e.force:showToast");

        toastEvent.setParams({
            'key': type,
            'type': type,
            'title': title,
            'message': message
        });

        toastEvent.fire();
    }
})