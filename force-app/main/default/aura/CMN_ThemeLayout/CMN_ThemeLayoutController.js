({
	init : function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        if(userId){
            component.set("v.isUserLoggedIn",true);
        }
    },
})