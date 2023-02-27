({
    doInit: function (component, event, helper) {
        helper.getAllNews(component);
        helper.getSaved(component);
    },
    articleSavedHandler : function (component, event, helper){
        //Reload saved articles
        helper.getSaved(component);
        helper.setStatusMsg(component);
    },
    showSaved : function (component, event, helper){
        helper.showSaved(component);
        helper.scrollCarouselLeft(component);
    },
    showAll : function (component, event, helper){
        helper.showAll(component);
        helper.scrollCarouselLeft(component);
    },
    navigateToAdvancedBrowsing: function(component, event, helper) {
        helper.handleNavigationToAdvancedBrowsing(component);
    }
})