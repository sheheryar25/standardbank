({
    init : function(component, event, helper) {

        var action = component.get("c.logPageEntry");
        var currentPageUrl = decodeURIComponent(window.location.search.substring(1));
        action.setParams({
        	pageURL : currentPageUrl
        });
        
        $A.enqueueAction(action); 
    }
})