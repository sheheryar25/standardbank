({
	show : function(component, event, helper) {
        var toggleText = component.find("popover");
		$A.util.removeClass(toggleText, 'slds-hide');

    },
    hide : function(component, event, helper) {
		var toggleText = component.find("popover");
		$A.util.addClass(toggleText, 'slds-hide');
    }
})