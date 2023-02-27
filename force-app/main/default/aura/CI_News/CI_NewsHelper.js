({
    getAllNews: function (component) {
        var helper = this;
        var newsService = component.find("newsService");
        var numberOfArticlesPerType = 100;
        var publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() - 30);
        var probability = 'medium';
        var isGettingClientSectorNews;
        var sortingArticles = true;

        var clientId = component.get("v.recordId");

        if (clientId) {
            isGettingClientSectorNews = false;
        } else {
            isGettingClientSectorNews = true;
        }

        newsService.getNewsForClient(component.get("v.recordId"), numberOfArticlesPerType, publicationDate, probability, isGettingClientSectorNews, sortingArticles, $A.getCallback(function (error, response) {
            if (!error) {
                if(sortingArticles){
                var allNews = response.allNews;
                }
                else{
                    var allNews = response.newsByClientSector;
                }

                if(allNews.length > 50){
                    allNews.length = 50;
                 }

                allNews.forEach(newsArticle => {
                    helper.formatArticle(newsArticle);
                });
                component.set("v.allArticles", allNews);
                helper.getAllArticlesStatus(component);



                //Default is to show all
                helper.showAll(component);
            } else {
                component.set("v.errorMsg", error);
            }
        }));
    },
    getSaved: function (component) {
        var newsService = component.find("newsService");
        var helper = this;
        newsService.getSavedNews(component.get("v.recordId"), $A.getCallback(function (error, response) {
            if (!error) {
                var articles = response.map(bookmark => bookmark.ArticleNews__r);

                articles.forEach(
                    savedArticle => {
                        helper.formatArticle(savedArticle);
                    }
                );
                component.set("v.savedArticles", articles);
            }
        }));
    },
    formatArticle: function (newsArticle) {
        var helper = this;
        var maxTitleLength = 120;

        newsArticle.formattedPublicationDate = newsArticle.Publication_Date__c ? helper.dateFormatter(helper.dateParser(newsArticle.Publication_Date__c)) : "No Date";
        newsArticle.formattedTitle = newsArticle.Title__c ? helper.truncate(newsArticle.Title__c, maxTitleLength) : "";
    },
    setStatusMsg: function (component) {
        if (component.get("v.newsArticles").length == 0) {
            let statusMsg = component.get("v.showingSaved") ? "No articles saved" : "No relevant news found";
            component.set("v.statusMsg", statusMsg);
            $A.util.removeClass(component.find('status_msg'), 'slds-hide');
            $A.util.addClass(component.find('news_section'), 'slds-hide');
        } else {
            $A.util.addClass(component.find('status_msg'), 'slds-hide');
            $A.util.removeClass(component.find('news_section'), 'slds-hide');
        }
    },
    showAll: function (component) {
        var helper = this;
        component.set("v.newsArticles", component.get("v.allArticles"));
        component.set("v.showingSaved", false);
        helper.setStatusMsg(component);
    },
    showSaved: function (component) {
        var helper = this;
        component.set("v.newsArticles", component.get("v.savedArticles"));
        component.set("v.showingSaved", true);
        helper.setStatusMsg(component);
    },
    scrollCarouselLeft: function (component) {
        var newsCarousel = component.find("news_carousel");
        if (newsCarousel)
            newsCarousel.scrollAllLeft();
    },
    getAllArticlesStatus: function (component) {
        var action = component.get("c.getAllArticlesStatusAction");
        action.setParams({ articlesObjects: component.get("v.allArticles") });
          //action.setStorable();
        action.setCallback(this, function (response) {
            // helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    handleNavigationToAdvancedBrowsing: function(component, event, helper) {
    let evt = $A.get("e.force:navigateToComponent");
    evt.setParams({
        componentDef : "c:CI_NewsPageContainer",
        componentAttributes: {
                    recordId : component.get("v.recordId")
                },
    });
    evt.fire();
    }

})