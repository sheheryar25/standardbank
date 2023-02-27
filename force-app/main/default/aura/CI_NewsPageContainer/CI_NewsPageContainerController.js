({
    doInit: function(component, event, helper) {
        document.body.setAttribute('style', 'overflow: hidden;');
        helper.getAllRecentNews(component, event, helper, true);
        helper.getSaved(component);

    },

    articleSavedHandler : function (component, event, helper){
        helper.getSaved(component);
        helper.setStatusMsg(component);
        helper.getSavedArticlesStatus(component);
    },

    handleRecentNews : function (component, event, helper){
        helper.doRecentNews(component, event, helper);
    },
    clickGetRecords : function (component, event, helper){
        helper.getLikedArticlesStatus(component);
    },

    filter: function(component, event, helper) {
        let all = component.get('v.allArticles');
        let selected = component.get('v.newsArticles');
        let setList = 'v.newsArticles';
        let saved = component.get('v.savedArticles');
        let savedFilterArticles = component.get('v.savedFilterArticles');
        let setListSaved = 'v.savedFilterArticles';
        helper.handleFiltering(all, selected, setList, component, event, helper, false);
        helper.handleFiltering(saved, savedFilterArticles, setListSaved, component, event, helper, false);
        helper.getLikedArticlesStatus(component);
        helper.getSavedArticlesStatus(component);
    },

    expandNewsList: function(component, event, helper) {
        let show = event.getParam('Show');
        var elem = component.find('NewsWrapper');
        if (show) {
            $A.util.removeClass(elem, 'scrollerSizeHidden');
            $A.util.addClass(elem, 'scrollerSizeShown');
        } else {
            $A.util.removeClass(elem, 'scrollerSizeShown');
            $A.util.addClass(elem, 'scrollerSizeHidden');
        }
    }
})