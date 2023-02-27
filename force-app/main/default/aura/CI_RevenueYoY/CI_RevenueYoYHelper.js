({
    forceNavigateToComponent : function(component, cmpName) {
        var navService = component.find("navService");
        var pageReference = {
            type: 'standard__component',
            attributes: {
               componentName: 'c__'+cmpName,
            }
        };
        navService.navigate(pageReference);
    },
});