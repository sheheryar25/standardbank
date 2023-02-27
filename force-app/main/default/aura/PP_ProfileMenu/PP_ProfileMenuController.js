({
    onClick : function(component, event, helper) {
        let value =  event.getParam("value");
        if(value == 'logout'){
            var logout =  $A.get("e.force:logout");
            logout.fire();   
        }else if(value == 'profile'){
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
    
})