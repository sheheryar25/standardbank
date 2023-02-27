({
    notifyAnalytics : function(tabName) {
        let appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },
    setTab : function(component, tabName){
        component.set('v.selectedNavItem', tabName);
    }
});