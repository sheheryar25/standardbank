({    
    navigateToHomePage : function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navService.navigate(pageReference);
	}
})