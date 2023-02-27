({
    doInit: function (component, event, helper) {


        var navService = component.find("navService");
        setTimeout(function(){
            var pageReference = {
            type: 'standard__component',
             attributes: {
                 componentName: 'c__CI_Client',
             },
            state: {
              c__recordId : component.get('v.recordId')
            }
        };
        navService.navigate(pageReference); }, 1000);
        },
})