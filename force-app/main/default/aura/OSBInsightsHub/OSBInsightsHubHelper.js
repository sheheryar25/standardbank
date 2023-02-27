({
    loadArticles : function(component) {        
        var action = component.get("c.getInsights");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                component.set("v.isLoading", false);
                var urlValue = response.getReturnValue()["WebUrl"];
                component.set("v.InsightUrl",urlValue); 
                component.set("v.articles", response.getReturnValue()["KnowledgeList"]);
            }    
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    } 
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    openProduct: function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Insights_Hub_OPTL__c"
            }
        };
        navService.navigate(pageReference);
    }
})