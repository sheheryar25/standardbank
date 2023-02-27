({
    doInit : function(component, event, helper) {
        if (component.get("v.component") === 'c:NewOpportunity' && !component.get("v.attributes")) {
            var attributes = new Object();
            attributes.recordId = null;
            attributes.sObjectName = 'Opportunity';
            attributes.isQuickAction = false;
            component.set("v.attributes", attributes);
        }
        $A.createComponent(
            component.get("v.component"),
            component.get("v.attributes"),
            function(modalContent, status, errorMessage) {
                if (status === "SUCCESS") {
                    var modalContainer = component.find("modalContainer");
                    modalContainer.set("v.body", modalContent);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    }
})