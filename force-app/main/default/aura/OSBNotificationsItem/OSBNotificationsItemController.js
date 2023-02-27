({
	toggle : function(component, event, helper) {
        var value = component.get("v.isHidden");
        component.set("v.isHidden", !value);
        let isUnread = component.get("v.isUnread");
        if(isUnread) {
            component.set("v.isUnread", false);
            helper.dispatchNotificationEvent(component.get("v.id"));
        }
	},

	doInit : function(component, event, helper) {
	    var index = component.get("v.index");
	    var chosenIndex = component.get("v.chosenIndex");
	    if(index == chosenIndex) {
	        component.set("v.expanded", true);
        }
    }
})