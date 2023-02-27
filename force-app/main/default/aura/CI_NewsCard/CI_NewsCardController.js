({
    saveArticle: function (component, event, helper) {
        var newsService = component.find("newsService");
        let isLead = !component.get("v.isLead") ? false : component.get("v.isLead");
        component.set("v.isLead",isLead);
        newsService.doSaveNews(
            component.get("v.id"),
            component.get("v.sectors"),
            component.get("v.subSectors"),
            null,
            null,
            null,
            component.get("v.title"),
            component.get("v.snippet"),
            component.get("v.publicationDate"),
            component.get("v.publisherName"),
            component.get("v.regions"),
            component.get("v.index"),
            component.get("v.isLead"),
            $A.getCallback(function (error, response) {
                if (!error) {
                    var message = "Article has been saved.";
                    if (typeof response === 'string') {
                        message = response;
                    }
                    helper.showToast(message, 'Success', 'success');

                    component.set("v.isSaved", true);

                    var saveEvent = component.getEvent("articleSavedEvent");
                    saveEvent.setParams(
                        {
                            data: { articleId: component.get("v.id") }
                        }
                    );
                    saveEvent.fire();
                } else {
                    helper.showToast('Error has occured. Please contact system administrator.', 'Error', 'error');
                }
            }));
    },
    saveNewsArticle: function (component, id, title, publisherName, publicationDate, isLead) {

    },
    doInit: function (component, event, helper) {
        if (!component.get("v.isFullArticle")) {
            $A.util.addClass(component.find("article_card"), "card_with_shadow");
            $A.util.addClass(component.find("article_upper"), "clickable");
            if (!component.get("v.moreNewsPage")) {
                component.set("v.title", helper.truncate(component.get("v.title"), 50));
            }
            component.set("v.snippet", helper.truncate(component.get("v.snippet"), 250));
        } else {
            $A.util.addClass(component.find("article_card"), "full_article");
            $A.util.addClass(component.find("snippet"), "bold");
            $A.util.removeClass(component.find("title"), "bold");
        }
        $A.enqueueAction(component.get('c.getArticleStatus'));
        },

    getArticleStatus: function(component){
        var newsService = component.find("newsService");
        var articleId = component.get("v.id");
        var rating;
        newsService.getArticleStatus(articleId, $A.getCallback(function (error, response) {
                    if (!error) {
                     rating = response.rating;
                     saved = response.saved;
                         if(rating == -1){
                             component.set("v.isLiked", false);
                             component.set("v.isDisliked", true);
                              }
                          else if(rating == 1){
                              component.set("v.isLiked", true);
                              component.set("v.isDisliked", false);
                              }
                          if(saved == 1){
                              component.set("v.isSaved", true);
                          }
                       }
                }));
    },

    navToArticle: function (component, event, helper) {
        if (!component.get("v.isFullArticle")) {
            var articleId = component.get("v.id");
            var isLead = component.get("v.isLead");
            var clientId = component.get("v.clientId");
            var showingSaved = component.get("v.showingSaved");

            helper.forceNavigateToComponent("CI_NewsViewer",
                {
                    articleId: articleId,
                    isLead: isLead,
                    clientId: clientId,
                    showingSaved: showingSaved
                });
        }
    },

    createOpportunity: function (component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
            evt.setParams({
                componentDef: "c:Modal"
            });
        evt.fire();
    },

    likeArticle: function (component, event, helper) {
        var rating = 1;
        var articleId = component.get("v.id");
        var newsService = component.find("newsService");

        newsService.setArticleFeedback(articleId, rating, $A.getCallback(function (error, response) {
            if (!error) {
                var message = "Thank you for your feedback";
                helper.showToast(message, 'Success', 'success');
                component.set("v.isLiked", true);
                component.set("v.isDisliked", false);
            } else {
                helper.showToast('Error has occured. Please contact system administrator.', 'Error', 'error');
            }
        }));
    },

    dislikeArticle: function (component, event, helper) {
            var rating = -1;
            var articleId = component.get("v.id");
            var newsService = component.find("newsService");

            newsService.setArticleFeedback(articleId, rating, $A.getCallback(function (error, response) {
                if (!error) {
                    var message = "Thank you for your feedback";
                    helper.showToast(message, 'Success', 'success');
                    component.set("v.isLiked", false);
                    component.set("v.isDisliked", true);
                } else {
                    helper.showToast('Error has occured. Please contact system administrator.', 'Error', 'error');
                }
            }));
        },
})