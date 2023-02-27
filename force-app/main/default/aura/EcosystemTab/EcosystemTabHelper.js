({
	processEcosystem : function(component) {
        return $A.getCallback(function(result) {
            component.set("v.ecosystem", result)
            component.set("v.groupNumber", result.Relationship_Group_Number__c);
            component.set("v.isLoading", false);
            component.set("v.isPermitted", result.Relationship_Group_Number__c ? true : false);
        });
	},
    getEcosystemById:function (component) {
        let recordId = component.get("v.recordId");
        UTL.promise(component.get("c.getEcosystemById"), {"ecosystemId": recordId})
            .then(
                this.processEcosystem(component),
                $A.getCallback(function(error) {
                    console.log("Failed with error: " + error);
                })
            );
    }
})