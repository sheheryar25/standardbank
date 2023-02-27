({
    generateLinks: function(component) {
        var action = component.get("c.getLinks");
        action.setCallback(this, function(response) {
            var links = JSON.parse(response.getReturnValue());
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('links', links);
                component.set("v.quickCreateLinks", links["quickCreateLinks"]);
                component.set("v.quickOpenLinks", links["quickOpenLinks"]);
            }
        });
        $A.enqueueAction(action);
    }
})