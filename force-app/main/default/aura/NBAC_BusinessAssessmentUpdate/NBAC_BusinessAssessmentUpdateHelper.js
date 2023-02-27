/**
 * Created by pmalicki on 17.08.2018.
 */
({

    updateBAssessment : function(component) {
        var updateAction = component.get("c.updateBusinessAssessment");
        updateAction.setParams({
            "bAssessmentId" : component.get("v.recordId")
        });

        updateAction.setCallback(this, function(response) {
            let state = response.getState();

            if(state === "SUCCESS") {

                let isUpdated = response.getReturnValue();
                var componentAction = $A.get("e.c:ComponentAction");
                componentAction.setParams({'data':{'name' : 'refresh'}});
                componentAction.fire();
                let message = isUpdated ? component.get("v.successMessage") : component.get("v.accessDeniedMessage");
                this.showToast(message, isUpdated);

            } else {
                this.getErrorMessage(response.getError());
            }
            component.set("v.isLoading", false);
            this.closeWindow();
        });
        $A.enqueueAction(updateAction);
    },

    showToast : function(message, isUpdated) {

        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            message : message,
            type : isUpdated ? 'success' : 'error'
        });

        toastEvent.fire();

    },

    closeWindow : function() {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },

    getErrorMessage : function(errors) {
        var message;
        if (errors && errors[0]) {
            if (errors[0].message) {
                message = errors[0].message;
            }
            else if (Object.values(errors[0].fieldErrors).length > 0) {
                message = Object.values(errors[0].fieldErrors)[0][0].message;
            }
            else if (errors[0].pageErrors.length > 0) {
                message = errors[0].pageErrors[0].message;
            }
        }
        if (! message) {
            message = 'Unknown error occured.';
        }

        this.showToast(message);
    }

})