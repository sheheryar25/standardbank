({
    doInit: function (component, event, helper) {
        var newsService = component.find("newsService");

        newsService.getNewsArticle(component.get("v.articleId"), $A.getCallback(function (error, newsArticleData) {
            if (!error) {
                try {
                    //newsArticleData = newsArticleData.replace(/\n/g, " ");
                    newsArticleData = JSON.parse(newsArticleData);
                    helper.formatArticle(component, newsArticleData);

                    component.set("v.newsArticle", newsArticleData);

                    var cmpData = {
                        id: newsArticleData.id,
                        title: newsArticleData.title,
                        publisherName: newsArticleData.publisherName,
                        publicationDate: newsArticleData.publicationDate,
                        isLead: component.get("v.isLead"),
                        articleBody: newsArticleData.body,
                        isFullArticle: true,
                        clientId: component.get("v.clientId"),
                        showingSaved: component.get("v.showingSaved")
                    };

                    $A.createComponent(
                        "c:CI_NewsCard",
                        cmpData,
                        function (newCmp) {
                            if (newCmp.isValid()) {
                                var newscardContainer = component.find("newscard_container");
                                newscardContainer.set("v.body", newCmp);
                            }
                        }
                    );
                } catch (error) {
                    component.set("v.errorMsg", "There was an error while formatting the article (" + error + ")");
                }

            } else {
                component.set("v.errorMsg", error);
            }
        }));
    },
    handleClose: function(component, event, helper){
        window.history.back();
    }
})