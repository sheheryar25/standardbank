/**
 * Created by mhabbab on 09/09/2019.
 */
({
    createRecord : function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Case",
            "recordTypeId": "01220000000chAO",
            "defaultFieldValues": {
                'AccountId': component.get("v.recordId"),
                'Type': 'Complaint'
            }
        });
        createRecordEvent.fire();
   }
})