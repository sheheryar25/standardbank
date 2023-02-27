({ 
    init: function(component, event, helper) {
        var action = component.get("c.getAccounts");
        var agmColumnVisible = component.get("c.agmColumnStatusVisible");
        action.setParam("accountId", component.get("v.recordId"));

        $A.enqueueAction(agmColumnVisible);

        agmColumnVisible.setCallback(this, function(response) {
            if(component.isValid() && response.getState() === "SUCCESS") {
                result = response.getReturnValue();
                component.set("v.agmColumnVisible", result);
            } else {
                alert(response.getError());
            }
        });

        action.setCallback(this, function(response) { 
            var records = {}, results;
            if(component.isValid() && response.getState() === "SUCCESS") {
                results = response.getReturnValue();
                console.log('results ' + JSON.stringify(results));
                records[undefined] = { Name: "Root", record: {}, items: [] };
                results.forEach(function(v){  
                    v.Actual_CY_Revenue__c = v.Actual_CY_Revenue__c.toLocaleString('en-US', {minimumFractionDigits: 2});
                    records[v.Id] = { Name: v.Name, record: v, items: []}; 
                }); 

                results.forEach(function(v) {
                    records[v.ParentId].items.push(records[v.Id]);
                });
                console.log('\n\n records ' + JSON.stringify(records));
                component.set("v.nodes", records[undefined].items);
            } else {
                alert(response.getError());
            }
        });
        $A.enqueueAction(action);  
    }
})