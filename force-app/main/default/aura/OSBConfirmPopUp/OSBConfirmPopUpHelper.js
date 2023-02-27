({
    handleClose : function(component) {
        component.set("v.displayPopUp", false);
        let currentPage = component.get("v.pageNumber");
        this.dispatchClosePopUpEvent(component, currentPage);
    },
    
    handleRedirect : function(component) {
        component.set("v.displayPopUp", false);
        var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": component.get("v.optl") ? "/" : "/marketplace"
            });
            urlEvent.fire();
    }
})