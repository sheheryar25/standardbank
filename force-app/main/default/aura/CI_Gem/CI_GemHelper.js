({
    newsLeadInit: function (component) {
        var gem = component.get("v.gem");
        gem.typeText = "New Article Lead -";

        var gemClient = gem.Client__r;
        if (gemClient)
            gem.variableText = gemClient.Name;
        else {
            //No client associated with gem, set article title as variableText
            var gemData = JSON.parse(gem.Data__c);
            gem.variableText = gemData.articleTitle;
        }
    },
    handleNewsLeadClick: function (gem) {
        var gemData = JSON.parse(gem.Data__c);
        var articleId = gemData.articleId;
        var isLead = true;
        var clientId = gem.Client__c;

        var helper = this;
        helper.forceNavigateToComponent("CI_NewsViewer",
            {
                articleId: articleId,
                isLead: isLead,
                clientId: clientId
            });
    }
})