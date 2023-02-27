({
    doInit : function(component, event, helper){
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        if(userId===undefined){
            component.set("v.notLoggedIn",true);
        }
        else{
            helper.navigateToHomePage(component);
        }
        document.body.style.backgroundImage = "url('/sfsites/c/resource/OSB_BackgroundImage')";
        document.body.style.backgroundSize = "cover";
    },
    
    returnToHomePage : function(component, event, helper) {
        helper.navigateToHomePage(component);
    }
})