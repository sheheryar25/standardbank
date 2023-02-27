({
    openFile: function(component, event, helper) {

        let pageReference = component.get("v.pageReference");
        let fileId = pageReference.state.c__recId;
        component.set("v.fileId", fileId);

        let openAction = $A.get('e.lightning:openFiles');
        openAction.setParams({
           'recordIds': [fileId],
           'selectedRecordId': fileId
        });

        openAction.fire();
    }
})