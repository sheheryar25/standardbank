({
     
    init : function(component, event, helper) {
        
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        if(userId){
            component.set("v.isUserLoggedIn",true);
        } 
       
    },
    
    onClick : function(component, event, helper) {
        let id = event.target.dataset.menuItemId;
        let label = event.target.dataset.text;
       
        if (id) {
            component.getSuper().navigate(id);
        }
        
        if(label){
            //Adobe Analytics Event
            document.dispatchEvent(new CustomEvent('triggerInteraction', {
                'detail': {
                    eventName: 'globalVirtualPageView',
                    pageName: label,
                    pageSubSection1 : label,
                    userLoginSuccess: true,
                    loginStatus: "logged in"
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
    
     profileItemClick : function(component, event, helper) {
        let value = event.target.dataset.menuItemId;
        if(value == 'logout'){
            var logout =  $A.get("e.force:logout");
            logout.fire();   
        }else if(value == 'myProfile'){
            component.set("v.popupHeading", "My Profile");
            component.set("v.showMyProfile", true);
            component.set("v.isModalOpen", true);
        }else if(value == 'changePassword'){
            component.set("v.showMyProfile", false);
            component.set("v.popupHeading", "Change Password");
            component.set("v.isModalOpen", true);
        }
        
    },
      
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
    },
    
    navigateToDashboard : function(component, event, helper) {  
        let navService = component.find( "navService" );  
        let pageReference = {  
            type: "comm__namedPage",  
            attributes: {  
                name: "dashboard__c"  
            } 
        };  
        navService.navigate(pageReference);  
    },
    
   onRender : function(component, event, helper) {
       
       let menuItems = component.get("v.menuItems");
       let adobeEventFired = component.get("v.adobeEventfired");
       if(menuItems && adobeEventFired == false){
          
           for(let item of menuItems){
               if(item.active){
                    
                   let labelName = item.label;
                   if(item.label == 'Home'){
                       labelName = 'Dashboard';
                   }
                   
                   //Fire Adobe Analytics Page view event on load
                   document.dispatchEvent(new CustomEvent('triggerInteraction', {
                       'detail': {
                           eventName: 'globalVirtualPageView',
                           pageName: labelName,
                           pageSubSection1 : labelName,
                           userLoginSuccess: true,
                           loginStatus: "logged in",
                           siteCountry : "South Africa",	
                           websiteName : "Partner Connect",	
                           siteBusinessUnit: "Group",	
                           websiteNameCode : "PC",	
                           siteLanguage : "English",
                           pageCategory: "Personal"
                       }
                   }));
                   
                   component.set("v.adobeEventfired",true);
               }
           }
       }
        
    },
})