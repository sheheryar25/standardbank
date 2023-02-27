({
      doInit: function(component, event, helper) {
           var action = component.get("c.getAllArticlesStatusAction");
           action.setParams({ articlesObjects: component.get("v.allArticles") });
           action.setCallback(this, function (response) {
           });
           $A.enqueueAction(action);
      },
})