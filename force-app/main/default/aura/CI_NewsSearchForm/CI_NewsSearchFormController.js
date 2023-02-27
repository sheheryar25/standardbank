({
    init: function(component, event, helper) {
        let recordId = component.get("v.recordId");
        helper.getClientRecordType(component, event, helper);
        if(recordId){
            helper.getCurrentAccount(component, event, helper);
        } else{
            helper.getCurrentUser(component, event, helper);
        }
    },
    myPortfolioChange: function(component, event, helper) {
        component.set('v.isMyPortfolioChanged', true);
    },
    doApply: function(component, event, helper) {
        helper.doApply(component, event, helper);
    },
    showFilters: function(component, event, helper) {
        helper.switchFiltersCard(component, event, helper);
    },

    onControllerFieldChange: function(component, event, helper) {
        helper.updateCountries(component, event, helper);
    },
})