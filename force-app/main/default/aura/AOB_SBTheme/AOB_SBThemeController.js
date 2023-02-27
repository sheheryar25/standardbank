({
    handleShowBackButton: function (component, event) {
        var showBackButton = event.getParam("showBackButton");
        component.set("v.showBackButton", showBackButton);
    },
    handleBackClicked: function(component){
        component.set("v.showCloseModal", true);
    },
    handleModalClose: function(component){
        component.set("v.showCloseModal", false);
    }
})