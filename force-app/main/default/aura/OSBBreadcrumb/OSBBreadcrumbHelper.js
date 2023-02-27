({
    dispatchTabEvent : function(tabName) {
        var tabEvent = $A.get("e.c:OSBChangeTabEvent");
        tabEvent.setParams({
            "tabName" : tabName
        });
        tabEvent.fire(); 
    },

    selectTab : function(component, selectedTab) {
        var elements = component.find("breadcrumbTab");
        elements.forEach(function(element) {
            if(element.getElement().dataset.tabName == selectedTab) {
               $A.util.addClass(element.getElement(), "breadcrumbs__main-item__selected");
            } else {
               $A.util.removeClass(element.getElement(), "breadcrumbs__main-item__selected");
            }
        });
    },

    redirectOnMarketplace : function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home",
            },
            state : {
                "section" : "MarketPlace"
            }
        };
        
        navService.navigate(pageReference);
    },

    redirectOnDashboard : function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home",
            },
            state : {
                "section" : "Dashboard"
            }
        };
        
        navService.navigate(pageReference);
    },

    hideBreadcrumb : function(){
        let element = document.getElementById("breadCrumbs");
        $A.util.addClass(element, "hideOnOverview");
    }
});