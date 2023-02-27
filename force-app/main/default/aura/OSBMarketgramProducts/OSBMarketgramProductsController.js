({
    doInit : function(component, event, helper) {
        helper.getProducts(component);
        helper.notifyAnalytics(component, null);
    },

    switchTabs : function(component, event, helper) {
        let selectedTab = event.target.id;
        component.set("v.currentTab", selectedTab);
        helper.highlightTab(component, selectedTab);
    },

    showProductFeed : function(component, event, helper) {
        var productId = event.getParam("recordId");

        let highlightedProduct = helper.getProduct(component, productId);
        helper.notifyAnalytics(component, highlightedProduct.Title);
        component.set("v.highlightedProduct", highlightedProduct);
        component.set("v.showProducts", false);
    },

    goBackToProducts : function(component, event, helper) {
        let currentTab = event.getParam("currentSection") == 'Community_Content_Solution' ? 'Solutions' : 'APIProducts';
        component.set("v.currentTab", currentTab);
        component.set("v.showProducts", true);
    },

    handleTabChange : function(component, event, helper) {
        helper.notifyAnalytics(component);
    }
});