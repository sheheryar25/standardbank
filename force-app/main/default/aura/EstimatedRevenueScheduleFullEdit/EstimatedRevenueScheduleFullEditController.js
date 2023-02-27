({
    initEditRecords : function(component, event, helper) {
        // call the apex class method and fetch estimated revenue schedule list  
        var fetchScheduleaction = component.get("c.fetchSchedule");
        fetchScheduleaction.setParams({
            recordId : component.get("v.recordId")
        });
        fetchScheduleaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                if(storeResponse.length > 0 && storeResponse[0].RecordType.DeveloperName === 'Insurance') {
                    component.set('v.isAdvisoryRt', false);
                    component.set('v.isNirRt', false);
                    component.set('v.isNiiRt', false);
                    component.set('v.showSaveCancelBtn', false);
                    component.set('v.isInsurance', true);
                    component.set("v.Columns", [
                                {label: 'Estimated Revenue Date', fieldName: 'Estimated_Revenue_Date__c', type: 'date', sortable: true},
                                {label: 'Commission Amount', fieldName: 'Commission_Amount__c', type: 'number', typeAttributes: {maximumFractionDigits : 2}, cellAttributes: { alignment: 'left'}},
                                {label: 'Fee Amount', fieldName: 'Fee_Amount__c', type: 'number', typeAttributes: {maximumFractionDigits : 2}, cellAttributes: { alignment: 'left'}},
                                {label: 'Estimated Revenue', fieldName: 'Estimated_Revenue__c', type: 'number', typeAttributes: {maximumFractionDigits : 2}, cellAttributes: { alignment: 'left'}}
                            ]);
                    component.set('v.insuranceERSList', storeResponse);

                }else {
                    component.set("v.ScheduleList", storeResponse);

                    var isAdvisory = storeResponse.length > 0 && storeResponse[0].RecordType.DeveloperName == 'Estimated_Revenue_Schedule_Advisory';
                    var isNir = storeResponse.length > 0 && storeResponse[0].RecordType.DeveloperName == 'Estimated_Revenue_Schedule_Fees';
                    var isNiiAndNir = storeResponse.length > 0 && storeResponse[0].RecordType.DeveloperName == 'Estimated_Revenue_Schedule_Fees_and_Margin';
                    component.set('v.isAdvisoryRt', isAdvisory);
                    component.set('v.isNirRt', isNir);
                    component.set('v.isNiiRt', isNiiAndNir);
                }
            }
        });
        
        var CurrentYearFeesaction  = component.get("c.getCurrentYearFees");
        CurrentYearFeesaction.setParams({
            recordId : component.get("v.recordId")
        });
        CurrentYearFeesaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                component.set("v.currentYearRevenue", storeResponse);
            }
        });
        
        var totalFeesaction  = component.get("c.getTotalFees");
        totalFeesaction.setParams({
            recordId : component.get("v.recordId")
        });
        totalFeesaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                component.set("v.totalFees", storeResponse);
            }
        });
        
        var Riskaction  = component.get("c.getRiskWeightedValue");
        Riskaction.setParams({
            recordId : component.get("v.recordId")
        });
        Riskaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                component.set("v.riskWeightedValue", storeResponse);
            }
        });
        
        var URLaction  = component.get("c.getProductURL");
        URLaction.setParams({
            recordId : component.get("v.recordId")
        });
        URLaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                component.set("v.productURL", storeResponse);
            }
        });
        
        var Nameaction  = component.get("c.getProductName");
        Nameaction.setParams({
            recordId : component.get("v.recordId")
        });
        Nameaction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // set ScheduleList list with return value from server.
                component.set("v.productName", storeResponse);
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
                // set ScheduleList list with return value from server.
                component.set("v.recCount", storeResponse);
            }
        });

        var productData = component.get("c.getProduct");
        productData.setParams({
            recordId : component.get("v.recordId")
        });
        productData.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var productInfo = response.getReturnValue();
                productInfo.URL = '/' + productInfo['Id'];
                component.set('v.productData', productInfo);
            }
        });
        
        $A.enqueueAction(fetchScheduleaction);
        $A.enqueueAction(CurrentYearFeesaction);
        $A.enqueueAction(totalFeesaction);
        $A.enqueueAction(Riskaction);
        $A.enqueueAction(URLaction);
        $A.enqueueAction(Nameaction);
        $A.enqueueAction(Countaction);
        $A.enqueueAction(productData);
        
    },
    
    Save: function(component, event, helper) {
        // Check required fields(Date) first in helper method which is return true/false
        if (helper.requiredFieldValidation(component, event)){
            // call the saveSchedule apex method for update inline edit fields update 
            var action = component.get("c.saveSchedule");
            action.setParams({
                'lstSchedule': component.get("v.ScheduleList")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    // set ScheduleList list with return value from server.
                    component.set("v.ScheduleList", storeResponse);
                    // Hide the save and cancel buttons by setting the 'showSaveCancelBtn' false 
                    component.set("v.showSaveCancelBtn",false);
                    //alert('Updated...');
                }
            });
            
            // call update Est Rev Sched checkbox
            var updaction = component.get("c.updateSchedule");
            updaction.setParams({
                recordId : component.get("v.recordId")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    //var storeResponse = response.getReturnValue();
                    // set ScheduleList list with return value from server.
                    //component.set("v.ScheduleList", storeResponse);
                    // Hide the save and cancel buttons by setting the 'showSaveCancelBtn' false 
                    component.set("v.showSaveCancelBtn",false);
                    //alert('Updated...');
                }
            });
            
            $A.enqueueAction(action);
            $A.enqueueAction(updaction);
        } 
    },
    
    cancel : function(component,event,helper){
        // on cancel refresh the view (This event is handled by the one.app container. It’s supported in Lightning Experience, the Salesforce app, and Lightning communities. ) 
        $A.get('e.force:refreshView').fire(); 
    }
    
})