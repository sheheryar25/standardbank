({
    doInit : function(component) {

        if (!component.get("v.recordId")) { // if there is no recordId, the FieldSet must be for an action of type New
            return;
        }
        var getFields = component.get("c.getFields");
        getFields.setParams({
			"recordId" : component.get("v.recordId"),
			"fieldSetName" : component.get("v.fieldSet")
        });

        getFields.setCallback(this, function(response){
            if(component.isValid()){
                var state = response.getState();
                if(state === "SUCCESS"){

					var results  =  response.getReturnValue();
					if(results.fieldsToDisplay){
						component.set("v.fieldsToDisplay",results.fieldsToDisplay);
					}

					if(results.fieldsToQuery){
					    let fields = results.fieldsToQuery;
					    if (component.get("v.fieldExternal"))
					        fields.push(component.get("v.fieldExternal"));

					    fields.push('RecordTypeId');
						component.set("v.fields",fields);
					}
					if (results.isLocked) {
					    component.set("v.readOnly", true);
                    }
                }
                else if(state === "ERROR") {
                    console.log("ERROR: " + response.getError());
                }
            }
        });

        $A.enqueueAction(getFields);

    },

    doReload : function(component) {
        if(component.get("v.recordId")) {
            component.find("forceRecord").reloadRecord();
        }
    },
})