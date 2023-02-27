({
    doApprove : function(component, keep){
        component.set('v.isLoading', true);
        var getData = component.get('c.runApproval');
        getData.setParams({ "cdc" : component.get('v.record'),
                            "isKeep" : keep});

        getData.setCallback(self, function(result) {
            if (component.isValid()) {
                let res = result.getReturnValue();
                if(!res){
                    component.set("v.errorMessage", 'Unexpected Error: please contact your administrator');
                }
                else if(res.isSuccess){
                    //$A.get("e.force:refreshView").fire();
                    var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                          "recordId": res.recordId
                        });
                        navEvt.fire();
                    $A.get("e.force:closeQuickAction").fire();
                }
                else if(!res.isSuccess){
                    component.set("v.errorMessage", res.errorMessage);
                }
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(getData);
    }
})