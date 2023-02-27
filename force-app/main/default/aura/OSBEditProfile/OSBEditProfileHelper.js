({
    getIndustry: function(component) {
        var action = component.get("c.getIndustryPicklistValues");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var values = response.getReturnValue();
                component.set("v.industryDict", values);
            }
        });
        $A.enqueueAction(action);
    },
    
    getCountryCode : function(component) {
        var action = component.get("c.getCountryCodes");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var values = response.getReturnValue();
                component.set("v.phoneCodes", values);
            }
        });
        $A.enqueueAction(action);
    },

    updateProfilePic: function(component){
        var action = component.get("c.updateUserProfilePic");
        var userProfilePic = component.get("v.userProfilePic");
        action.setParams({
            "userProfilePicString" : userProfilePic,
            "userId" : $A.get( "$SObjectType.CurrentUser.Id" ),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.loading", false);
                window.scrollTo(0,0);
                component.set("v.toastType", "success");
                component.set("v.toastMessage", "Your profile picture has been saved.");
                component.set("v.showMessageToast", true);
                setTimeout(function(){
                    document.location.reload();
                    component.set("v.showMessageToast", false);
                }, 4000);
                
            }else{
                component.set("v.loading", false);
                window.scrollTo(0,0);
                component.set("v.toastType", "warning");
                component.set("v.toastMessage", "The uploaded file format is not valid or file size is beyond limit.");
                component.set("v.showMessageToast", true);
                setTimeout(function(){
                    component.set("v.showMessageToast", false);
                }, 10000)
            }
        });
        $A.enqueueAction(action);
    },

    updateProfile: function(component){
        var action = component.get("c.updateUserProfile");
        var userMapInfo = component.get("v.userMap");
        action.setParams({
            "userMap": userMapInfo
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.displayToast(component, 'Your changes have been saved successfully.', 'success');
            } else {
                let errors = response.getError();
                this.displayToast(component, errors[0].message, 'error');
            }
        }); 
        $A.enqueueAction(action);
    },

    displayToast : function(component, message, type) {
        window.scrollTo(0,0);
        component.set("v.toastType", type);
        component.set("v.toastMessage", message);
        component.set("v.showMessageToast", true);
        setTimeout(function(){
            component.set("v.showMessageToast", false);
        }, 10000);
    }
})