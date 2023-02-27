({
    doInit : function(component) {
        var userId = $A.get( "$SObjectType.CurrentUser.Id" );
        component.set("v.userId", userId);
    }
});