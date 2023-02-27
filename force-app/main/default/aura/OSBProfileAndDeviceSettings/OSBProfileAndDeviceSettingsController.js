({
    doInit: function(component, event, helper){
        let selectedMenuItem = component.get("v.selectedNavItem");
        let appEvent = $A.get("e.c:OSBProfileAndSettingsEvent");
        appEvent.setParams({
            "selectedNavItem" : selectedMenuItem
        });
        appEvent.fire();
        let urlSearchString = window.location.search;
        if(urlSearchString != null && urlSearchString != ''){
            let pushStateUrl = String(window.location.pathname).split('?');
            let urlParams = String(urlSearchString).split('?');
            let activeTab = String(urlParams[1]).split('=');
            if(String(activeTab[0]) === 'activeTab'){
                if(String(activeTab[1]) === 'EditProfile'){
                    component.set("v.selectedNavItem", 'EditProfile');
                }
                else if(String(activeTab[1]) === 'DeviceManagement'){
                    component.set("v.selectedNavItem", 'DeviceManagement');
                }
                window.history.pushState({}, document.title, pushStateUrl[0]);
            }
        }
    },
    handleNavItemChange: function(component, event, helper) {
        let elements = document.getElementsByClassName("dashboard__navigation-item__selected");
        $A.util.removeClass(elements[0], 'dashboard__navigation-item__selected');
        component.set("v.selectedNavItem", event.currentTarget.dataset.tabName);
        $A.util.addClass(event.currentTarget, 'dashboard__navigation-item__selected');
        helper.notifyAnalytics(event.currentTarget.dataset.tabName);
    },
    goToDeviceManagement: function(component, event, helper) {
        let tabName = event.getParam("selectedNavItem");
        helper.setTab(component, "tabName");
        let elements = document.getElementsByClassName("marketplace__navigation-item__selected");
        $A.util.removeClass(elements[0], 'marketplace__navigation-item__selected');
        component.set("v.selectedNavItem", tabName);
        $A.util.addClass(event.currentTarget, 'marketplace__navigation-item__selected');
    }
});