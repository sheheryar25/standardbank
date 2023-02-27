({
    redirectToKnowledge : function(component, event, helper) {
        var sobjectId=component.get("v.id");
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "API_Details__c"
            },
            state : {
                "apiId" : sobjectId
            }
        };
        
        navService.navigate(pageReference);
    },
    createModalWindow : function(component, event, helper){
        component.set("v.isOpen", true);
        document.body.style.overflow = "hidden";
	}
})