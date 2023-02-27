({
    notifyAnalytics : function(tabName) {
        var appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },

    setTab : function(component, tabName){
        component.set('v.selectedNavItem', tabName);
    },

    toggleMobileMenu : function(component, isToggled) {
        component.set("v.mobileMenuToggled", isToggled);
    }
});