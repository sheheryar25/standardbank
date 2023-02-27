({
    init : function(component) {
        let urlSearchString = window.location.search;
        let urlDocName = window.document.title;
        if(urlDocName == 'MySupportPage' ){
            component.set("v.PageName", urlDocName);
            component.set("v.productName", 'Dashboard');
        }
        if(urlDocName == 'KnowledgePage'){
            component.set("v.PageName", urlDocName);
            component.set("v.productName", 'MarketPlace');
        }
        if(urlSearchString){
            let urlParams = String(urlSearchString).split('?');
            let sUrlVarList = urlParams[1].split('&');

            sUrlVarList.forEach(function(urlVar, index) {
                let item = urlVar.split('=');
                if(item[0] === 'section'){
                    if(item[1] !== '' && item[1] !== undefined){
                        component.set("v.productName", item[1]);
                    }
                }
            });
        }    
    },
    

	switchTabs : function(component, event, helper) {
        let selectedTab = event.target.id;
        helper.selectTab(component, selectedTab);
        helper.dispatchTabEvent(selectedTab); 
	},
    
    handleBreadcrumbEvent : function(component, event) {
        let productName = event.getParam("productName");
        component.set("v.productName", productName);
        document.title = productName;
    },

    handleMenuToggled : function(component, event, helper) {
        helper.toggleMenu(component, event);
    },

    clickMarketplaceFromProd : function(component, event, helper) {
        helper.redirectOnMarketplace(component);
    },

    clickDashboardFromProd : function(component, event, helper) {
        helper.redirectOnDashboard(component);
    }
})