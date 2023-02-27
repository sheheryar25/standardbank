/**

@ Author        : Youssef Ibrahim
@ Date          : 09/09/2019
@ Feature       : C-00002931
@ Description   : Lightning Component JS Helper

*/
({
    navigateToURL: function(event, url){
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
           "url": url,
           "isredirect": true
         });
         urlEvent.fire();
    }
})