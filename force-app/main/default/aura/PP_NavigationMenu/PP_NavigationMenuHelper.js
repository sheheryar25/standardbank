({
     
    navigateToLogin : function(component, event, helper) {  
        let navService = component.find( "navService" );  
        let pageReference = {  
            type: "comm__loginPage",  
            attributes: {  
                actionName: "login"  
            } 
        };  
        navService.navigate(pageReference);  
    }
	
})