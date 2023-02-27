({
    getNewsForClient: function (component, event, helper) {
        var action = component.get("c.getClientNews");
        var params = event.getParam("arguments");
        var sortingArticles = true;

        action.setParams({ clientId: params.clientId, numberOfArticlesPerType: params.numberOfArticlesPerType, publicationDate: params.publicationDate, probability: params.probability, isGettingClientSectorNews: params.isGettingClientSectorNews, sortingArticles: params.sortingArticles });
        action.setStorable();
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
            helper.finishLongTermAction(component);
        });
        helper.enqueueActionAsLongTerm(component,action);
    },
    getSavedNews : function (component, event, helper) {
        var action = component.get("c.getSavedNewsAction");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
            helper.finishLongTermAction(component);
        });
        helper.enqueueActionAsLongTerm(component,action);
    },
    doSaveNews : function (component, event, helper) {
        var action = component.get("c.saveNews");
        var params = event.getParam("arguments");
        action.setParams(
            {
            an: params.an,
            groupSectors: params.groupSectors,
            subSectors: params.subSectors,
            hClients: params.hClients,
            mClients: params.mClients,
            lClients: params.lClients,
            title: params.title,
            snippet: params.snippet,
            publicationDate: params.publicationDate,
            publisherName: params.publisherName,
            regions: params.regions,
            index: params.index,
            pred: params.pred
            });
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    getNewsArticle: function (component, event, helper) {
        var action = component.get("c.getNewsArticleById");
        var params = event.getParam("arguments");

        action.setParams({ articleId: params.articleId });
        action.setStorable();
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
            helper.finishLongTermAction(component);
        });
        helper.enqueueActionAsLongTerm(component,action);
    },
    getNews : function(component, event, helper) {
        var action = component.get("c.getClientNews");
        var params = event.getParam("arguments");
        var sortingArticles = false;

        action.setParams({ numberOfArticlesPerType: params.numberOfArticlesPerType, publicationDate: params.publicationDate, numberOfLastViewClients : params.numberOfLastViewClients, probability: params.probability, isGettingClientSectorNews: params.isGettingClientSectorNews, sortingArticles });
        action.setStorable();
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
            helper.finishLongTermAction(component);
        });
        helper.enqueueActionAsLongTerm(component,action);
    },
    setArticleFeedback : function(component, event, helper) {
        var action = component.get("c.setArticleFeedbackAction");
        var params = event.getParam("arguments");

        action.setParams({ articleId: params.articleId, rating: params.rating });
        action.setStorable();
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    /*getAllArticlesStatus : function(component, event, helper) {
        var getAllArticlesStatusAction = component.get("c.getAllArticlesStatusAction");
        var params = event.getParam("arguments");
        getAllArticlesStatusAction.setParams({allNews : params.allNews});
        getAllArticlesStatusAction.setCallback(this, function(response){
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(getAllArticlesStatusAction);

    },*/
     getArticleStatus : function(component, event, helper) {
         var action = component.get("c.getArticleStatusAction");
         var params = event.getParam("arguments");
         action.setParams({ articleId: params.articleId });
         //action.setStorable();
         action.setCallback(this, function (response) {
             helper.serviceResponseCallback(response, params.callback);
         });
         $A.enqueueAction(action);
     }
})