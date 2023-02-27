({
	// Your renderer method overrides go here
	afterRender: function (component, helper) {
        var itemCount = String(component.get("v.content")).split(" ").length;
        if(itemCount > 25){
            component.set("v.shortContent",component.get("v.content").split(" ").splice(0,25).join(" ") + '...');
        }
        else{
            component.set("v.shortContent",component.get("v.content"));
        }
    }
})