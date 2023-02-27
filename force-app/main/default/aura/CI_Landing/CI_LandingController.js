({
    toggleSection: function (component, event, helper) { 
        helper.toggleSection(component, event);
    },

    doInit : function (component, event, helper){

        var querySettings = {
            filteringOnIBC : component.get("v.filteringOnIBC"),
            filteringOnDivisions : component.get("v.filteringOnDivisions"),
            filteringOnRecordType : component.get("v.filteringOnRecordType")
        };
        component.set("v.querySettings", querySettings);
    },

})