/**
 * Created by pmalicki on 17.08.2018.
 */
({

    clickContinue : function(component, event, helper) {
        component.set("v.isLoading", true);
        helper.updateBAssessment(component);

    },

    clickCancel : function(component, event, helper) {
        helper.closeWindow();
    }

})