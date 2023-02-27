({
    requiredFieldValidation : function(component,event) {
        // get all schedules.. 	
        var allRecords = component.get("v.ScheduleList");
        var isValid = true;
        // play a for loop on all schedule list and check that schedule name is not null,   
        for(var i = 0; i < allRecords.length;i++){
            if(allRecords[i].Estimated_Revenue_Date__c == null || allRecords[i].Estimated_Revenue_Date__c == ''){
                alert('Complete this field : Row No ' + (i+1) + ' Estimated Revenue Date is null' );
                isValid = false;
            }  
        }
        return isValid;
    },
})