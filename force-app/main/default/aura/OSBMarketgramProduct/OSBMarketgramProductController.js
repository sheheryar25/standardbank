({
    handleOnClickProduct : function(component, event, helper) {
        let onProductSelectEvent = component.getEvent("onSelectProductEvent");
        onProductSelectEvent.setParams({
            "recordId" : component.get("v.product.Id")
        });
        onProductSelectEvent.fire();
    },

    handleOnClickReaction : function(component, event, helper) {
        let eventType = event.target.dataset.type;
        let product = component.get("v.product");

        if((eventType === "LIKE" && product.userLikes)
            || eventType === "DISLIKE" && product.userDislikes) {
            return;
        }
        let action = component.get("c.updateScoring");
        action.setParams({
            "knowledgeId"      : product.KnowledgeArticleId,
            "operationType" : eventType,
            "voteId"        : product.userVoteId
        });
        action.setCallback(this, function(response) {
            helper.handleUpdateScoringCallback(component, response, eventType);
        });
        $A.enqueueAction(action);
    }
});