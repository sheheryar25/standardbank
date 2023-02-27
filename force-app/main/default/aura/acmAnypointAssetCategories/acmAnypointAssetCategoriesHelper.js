({
    fetchAnypointAssetCategories : function(component) {
        var recordId = component.get( "v.recordId" );
        if(recordId){
            var action = component.get("c.getAnypointAssetCategories"); 
            action.setParams({ "apiId" : recordId });
            action.setCallback(this, function(response) { 
                var state = response.getState();
                if (state === "SUCCESS") {                    
					var result= response.getReturnValue();
					var categoryMap = [];
					component.set("v.anypointAssetCategories", response.getReturnValue());
					for(var i=0; i<result.length; i++){
						let categoryKey = result[i].acm_pkg__Category__c.split(':')[0];
						let categoryValue = result[i].acm_pkg__Category__c.split(':')[1];
						categoryMap.push({key:categoryKey, value:categoryValue});
					}
					component.set("v.anypointAssetCategoriesMap", categoryMap);
                }else if (state === "ERROR") {
                    var errors = response.getError();
                }
            }); 
            $A.enqueueAction(action);
        }		
    },
    
    fetchAnypointAssets : function(component) {
        var recordId = component.get( "v.recordId" );
        if(recordId){
            var action = component.get("c.getAnypointAssets"); 
            action.setParams({ "apiId" : recordId });
            action.setCallback(this, function(response) { 
                var state = response.getState();
                if (state === "SUCCESS") {            
                    component.set("v.anypointAssets", response.getReturnValue()); 
                }else if (state === "ERROR") {
                    var errors = response.getError();
                }
            }); 
            $A.enqueueAction(action);
        }		
    }    
})