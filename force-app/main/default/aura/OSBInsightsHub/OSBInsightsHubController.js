({
    doInit : function(component, event, helper) {
        helper.loadArticles(component, event, helper);
    },
    
    openProduct: function(component, event, helper) {
        helper.openProduct(component, event, helper);
    },
    
    loadMore : function(component, event, helper) {
        var count = component.get("v.articles").length;
        helper.loadArticles(component, event, helper, count);
    }
})