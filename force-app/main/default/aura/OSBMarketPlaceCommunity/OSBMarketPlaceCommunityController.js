({
    init : function(component, event, helper) {
        var urlSearchString = window.location.search;
        if(urlSearchString != null && urlSearchString != ''){

            var urlParams = String(urlSearchString).split('?');
            var sUrlVarList = urlParams[1].split('&');
            
            sUrlVarList.forEach(function(urlVar, index) {
                let item = urlVar.split('=');
                if(item[0] === 'activeTab'){
                    if(item[1] !== '' && item[1] !== undefined){
                        component.set("v.selectedNavItem", item[1]);
                    }
                }
            });
            
        }
    },

    handleNavItemChange: function(component, event, helper) {
        var elements = document.getElementsByClassName("marketplace__navigation-item__selected");
        $A.util.removeClass(elements[0], 'marketplace__navigation-item__selected');
        component.set("v.selectedNavItem", event.currentTarget.dataset.tabName);
        $A.util.addClass(event.currentTarget, 'marketplace__navigation-item__selected');
        helper.notifyAnalytics(event.currentTarget.dataset.tabName);
    },

    handleOptionChanged : function(component, event, helper) {
        let tabName = event.getParam("marketplaceTab");
        helper.setTab(component, tabName);

        var elements = document.getElementsByClassName("marketplace__navigation-item__selected");
        $A.util.removeClass(elements[0], 'marketplace__navigation-item__selected');
        component.set("v.selectedNavItem", tabName);
        $A.util.addClass(event.currentTarget, 'marketplace__navigation-item__selected');

        helper.notifyAnalytics(tabName);
    },

    handleMenuToggled : function(component, event, helper) {
        let isToggled = event.getParam("menuOpened");
        helper.toggleMobileMenu(component, isToggled);
    },
});