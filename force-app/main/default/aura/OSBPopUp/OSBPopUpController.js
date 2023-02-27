({
    onRender : function(component, event, helper) {
        if(component.get("v.isDoneRendering") === false) {
            component.set("v.isDoneRendering", true);
            helper.changePosition(component, window);
        }
    },

    handleClose : function(component, event, helper) {
        helper.handleClose(component, event.currentTarget.outerText);
    },

    handlePrevious : function(component, event, helper) {
        let currentPage = component.get("v.pageNumber");
        component.set("v.pageNumber", currentPage - 1);
    },

    handleNext : function(component, event, helper) {
        let currentPage = component.get("v.pageNumber");
        let maxPages = component.get("v.maxPages");
        if(currentPage == maxPages) {
            helper.handleClose(component, event.currentTarget.outerText);
        } else {
            component.set("v.pageNumber", currentPage + 1);
        }
    },

    handleChangePage : function(component, event, helper) {
        let oldValue = event.getParam("oldValue");
        let newValue = event.getParam("value");
        let isNext = oldValue < newValue;
        let maxPages = component.get("v.maxPages");
        if(newValue == maxPages) {
            component.set("v.message", "Yes, got it");
        } else if (newValue == 1) {
            component.set("v.message", "Yes, let's go");
        }
    },

    handleChangePosition : function(component, event, helper) {
        if(component.find("popUpBox") && component.find("popUpBox").getElement()) {
            helper.changePosition(component, window);
        } else {
            component.set("v.isDoneRendering", false);
        }
    }
})