({
	fetchContacts : function(component) {

		var getContacts = component.get("c.getContacts");
        getContacts.setParam("accountId", component.get("v.accountId"));
        getContacts.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());
                console.log('fetchContacts ' + JSON.stringify(component.get("v.contactRoles")));
            }
            else {
                
            }
        });

        $A.enqueueAction(getContacts);
	},
    
    fetchOptions : function(component){
        var getOptions = component.get("c.getContactRoles");
        getOptions.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.contactRoles", response.getReturnValue());
                console.log('fetchOptions ' + JSON.stringify(component.get("v.contactRoles")));
            }
            else {
                
            }
        });

        $A.enqueueAction(getOptions);
    }
})