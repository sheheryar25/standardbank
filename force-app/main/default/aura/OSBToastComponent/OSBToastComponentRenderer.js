({
	// Your renderer method overrides go here
	afterRender: function (component, helper) {
        this.superAfterRender();
        setTimeout(function() {
            component.set("v.closePopup", false);
        }, 10000);
    }
})