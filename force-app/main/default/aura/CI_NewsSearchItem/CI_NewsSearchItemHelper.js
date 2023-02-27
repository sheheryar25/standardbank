({
    forceNavigateToComponent : function(cmpName, cmpData) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:" + cmpName,
            componentAttributes: cmpData
        });
        evt.fire();
    },
    showToast : function (message,title,type,mode,duration) {
        var toastEvent = $A.get("e.force:showToast");
        if(!toastEvent){return;}
        if(title){toastEvent.setParam('title',title);}
        if(mode){toastEvent.setParam('mode',mode);}
        if(message){toastEvent.setParam('message',message);}
        if(type){toastEvent.setParam('type',type);}
        if(duration){toastEvent.setParam('duration',duration);}
        toastEvent.fire();
    },
    doGetAllSavedStatuses : function (component, event, helper) {
        let newsService = component.find("newsService");
        let articleId = component.get("v.OneNew.An__c");
        let rating;
        let saved;
        let isSavedArticles = component.get("v.isSavedArticles");
        if(isSavedArticles){
             isSavedArticles.forEach(function(oneArt){
                 if(oneArt == articleId){
                     component.set("v.isSaved", true);
                 }
             })
        }
    },
    doGetArticleFeedback : function (component, event, helper) {
        let newsService = component.find("newsService");
        let articleId = component.get("v.OneNew.An__c");
        let rating;
        let saved;
        let feedbackArticles = component.get("v.feedbackArticles");
        if(feedbackArticles){
             feedbackArticles.forEach(function(oneArt){
                 if(oneArt.Factiva_Article_Id__c == articleId){
                     let rating = oneArt.Rating__c
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
             })
        }
    },
})