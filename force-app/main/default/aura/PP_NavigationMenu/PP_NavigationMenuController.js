({ 
    onClick : function(component, event, helper) {
        let id = event.target.dataset.menuItemId;
        let label = event.target.dataset.text;
        
        if(id == 'Login into PartnerConnect'){
            helper.navigateToLogin(component,event,helper);
        }else{
            component.getSuper().navigate(id);
        }
        
        if(label){
            //Adobe Analytics Event
            document.dispatchEvent(new CustomEvent('triggerInteraction', {
                'detail': {
                    eventName: 'globalVirtualPageView',
                    pageName: label,
                    pageSubSection1 : label
                }
            }));
        }
    },    
    handleMobileMenuClick : function(component, event, helper) {
        
        let mobileNavFlag =  component.get("v.expandMobileMenu");
        
        if(!mobileNavFlag) {
            component.set("v.mobileLinksCss","dynamicDisplayBlock");
            component.set('v.expandMobileMenu',true);
        } else {
            component.set("v.mobileLinksCss","dynamicDisplayNone");
            component.set('v.expandMobileMenu',false);
        }
    },
    
    navigateToHome : function(component, event, helper) {  
        let navService = component.find( "navService" );  
        let pageReference = {  
            type: "comm__namedPage",  
            attributes: {  
                name: "Home"  
            } 
        };  
        navService.navigate(pageReference);  
    },
    
})