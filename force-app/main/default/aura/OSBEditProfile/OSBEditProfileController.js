({ 
    init : function(component, event, helper) {
        component.set("v.loading", true);
       	helper.getIndustry(component);
        helper.getCountryCode(component);
        var action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var isLoggedIn = response.getReturnValue();
                if(isLoggedIn) {
                    var action = component.get("c.getUserDetails");
                    action.setCallback(this, function(response) {
                        var stateDetails = response.getState();
                        if (stateDetails === "SUCCESS") {
                            component.set("v.loading", false);
                            component.set("v.userMap",response.getReturnValue().userDetailMap);
                            component.set("v.userProfilePicBase64",response.getReturnValue().ProfilePicInfo.ProfilePic);
                            component.set("v.pingReturnedData",true);
                        } else if (stateDetails === "ERROR") {
                            component.set("v.loading", false);  
                        }
                    })
                    $A.enqueueAction(action);
                }
            } 
        });
        $A.enqueueAction(action);
    },
    cancel: function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navService.navigate(pageReference);
    },
    handleReload : function(component, event, helper){
        var reload = component.get("c.init");
        $A.enqueueAction(reload);
    },
    updateUser : function(component, event, helper){
        helper.updateProfile(component);
    },
    updateProfilePicture : function(component, event, helper){
        component.set("v.loading", true);
        helper.updateProfilePic(component);
    },
    closeTimedToast : function(component, event, helper){
        if(component.get("v.showMessageToast")){
            setTimeout(function(){
                component.set("v.showMessageToast", false);
            }, 10000);
        }
    },
    closeToast : function(component, event, helper){
        component.set("v.showMessageToast", false);
    },
    onChangePicture: function (component, event, helper) {
        if (document.getElementById("upload").files && document.getElementById("upload").files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                component.set("v.userProfilePicBase64",e.target.result);
                var urlArray = String(e.target.result).split("base64,");
                component.set("v.userProfilePic", urlArray[1]);
                component.set("v.userProfilePicType",document.getElementById("upload").value.split('.')[1]);
            }
            
            reader.readAsDataURL(document.getElementById("upload").files[0]);
        }
    }
})