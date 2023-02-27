({
    saveArticle: function (component, event, helper) {
        var newsService = component.find("newsService");
        newsService.doSaveNews(
            component.get("v.OneNew.An__c"),
            component.get("v.sectors"),
            component.get("v.subSectors"),
            null,
            null,
            null,
            component.get("v.OneNew.Title__c"),
            component.get("v.OneNew.Snippet__c"),
            component.get("v.OneNew.formattedPublicationDate"),
            component.get("v.v.OneNew.Publisher_Name__c"),
            component.get("v.regions"),
            component.get("v.index"),
            component.get("v.OneNew.Pred__c"),
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
                            data: { articleId: component.get("v.OneNew.An__c") }
                        }
                    );
                    saveEvent.fire();
                    console.log('saveEvent.fire()');
                } else {
                    helper.showToast('Error has occured. Please contact system administrator.', 'Error', 'error');
                }
            }));
    },
    doInit: function (component, event, helper) {
        helper.doGetAllSavedStatuses(component, event, helper);
        helper.doGetArticleFeedback(component, event, helper);
    },

    doArticleStatus: function (component, event, helper) {
        helper.doGetAllSavedStatuses(component, event, helper);
    },

    getArticleStatus: function(component){
        helper.doGetAllSavedStatuses(component, event, helper);
    },

    doArticleFeedback: function(component, event, helper){
        helper.doGetArticleFeedback(component, event, helper);
    },

    navToArticle: function (component, event, helper) {
        if (!component.get("v.isFullArticle")) {
            var articleId = component.get("v.OneNew.An__c");
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
        let createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Opportunity",
            "defaultFieldValues": {
                "AccountId": component.get("v.clientId"),
                "Lead_Source__c": "News Article",
                "Description": component.get("v.OneNews.Title"),
                "Factiva_Article_Id__c": component.get("v.OneNews.An")
            }
        });
        createRecordEvent.fire();
    },

    likeArticle: function (component, event, helper) {
        var rating = 1;
        var articleId = component.get("v.OneNew.An__c");
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
        var articleId = component.get("v.OneNew.An__c");
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