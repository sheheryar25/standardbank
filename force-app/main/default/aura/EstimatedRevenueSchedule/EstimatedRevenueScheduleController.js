({
    initRecords : function(component, event, helper) {
        // call the apex class method and fetch estimated revenue schedule list  
        component.set("v.Columns", [
            {label:"Name", fieldName:"Show_Estimated_Revenue_Schedule__c", type:"url", typeAttributes: 
             {label: {fieldName: 'Name'}}},
            {label: 'Estimated Revenue Date', fieldName: 'Estimated_Revenue_Date__c', type: 'date', sortable: true},
            {label: 'Fee Amount', fieldName: 'Fee_Amount__c', type: 'number', typeAttributes: {maximumFractionDigits : 2}}
        ]);
        var action = component.get("c.fetchLimitedSchedule");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log(JSON.stringify(storeResponse));
                // set ScheduleList list with return value from server.
                component.set("v.ScheduleList", storeResponse);
                if(storeResponse.length > 0 && storeResponse[0].RecordType.DeveloperName === 'Insurance') {
                    let columns = component.get("v.Columns");
                    columns.shift();
            		columns.push({
                        label: 'Commission Amount',
                        fieldName: 'Commission_Amount__c',
                        type: 'number',
                        typeAttributes: {maximumFractionDigits : 2}
                    });
            		component.set("v.Columns", columns);
                }
            }
        });
        
         var Countaction  = component.get("c.getEstimatedRevenueScheduleCount");
        Countaction.setParams({
            recordId : component.get("v.recordId")
        });
        Countaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log(JSON.stringify(storeResponse));
                // set ScheduleList list with return value from server.
                component.set("v.recCount", storeResponse);
            }
        });
        
        $A.enqueueAction(action);
        $A.enqueueAction(Countaction);
    },
    
    navigateToShowAll : function(component,event,helper) {
        var evt = $A.get("e.force:navigateToComponent");
        
        evt.setParams({
            componentDef : "c:EstimatedRevenueScheduleFullEdit",
            componentAttributes: {
                recordId : component.get("v.recordId")
            }
        });
        evt.fire();
        
    }
    
})