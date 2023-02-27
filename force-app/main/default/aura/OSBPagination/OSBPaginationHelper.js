({
    changePage : function(component, helper) {
        let displayedData = [];
        let currentPage = component.get("v.currentPage");
        let pageSize = component.get("v.pageSize");
        let data = component.get("v.data"); 
        let x = (currentPage-1)*pageSize;
        for(; x<(currentPage)*pageSize; x++){
            if(data[x]){
                displayedData.push(data[x]);
            }
        }
        component.set("v.displayedData", displayedData);
        helper.styleButtons(component, helper);
    },

    generatePageList : function(component, pageNumber) {
        pageNumber = parseInt(pageNumber);
        let pageList = [];
        let totalPages = component.get("v.totalPages");
        if(totalPages > 1){
            if(totalPages <= 10){
                let counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                }
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        component.set("v.pageList", pageList);
    },

    styleButtons : function(component, helper) {
        if(component.get("v.pages").length > 1){
            helper.styleNavButtons(component, helper);
            helper.stylePageButtons(component, helper);
        }
    },

    styleNavButtons : function(component) {
        let currentPage = component.get("v.currentPage");
        let pagesTotal = component.get("v.pagesTotal");
        let navButtons = component.find("navButton");
        navButtons.forEach(function (button) {
            if(button.getElement()){
                if(currentPage == 1 && button.getElement().dataset.type === 'left' ||
                   currentPage == pagesTotal && button.getElement().dataset.type === 'right') {
                    $A.util.addClass(button.getElement(), 'navigation-element__chevron-disabled skipBtn');
                    button.getElement().dataset.disabled = 'true';
                } else {
                    $A.util.removeClass(button.getElement(), 'navigation-element__chevron-disabled skipBtn');
                    $A.util.removeClass(button.getElement(), 'skipBtn');
                    button.getElement().dataset.disabled = 'false';
                }
            }
        });
    },

    stylePageButtons : function(component) {
        let pageButtons = component.find("pageButton");
        let currentPage = component.get("v.currentPage");
        pageButtons.forEach(function (button) {
            if(button.getElement()){
                if(button.getElement().name == currentPage) {
                    $A.util.addClass(button.getElement(), "navigation-pageButton_selected");
                } else {
                    $A.util.removeClass(button.getElement(), "navigation-pageButton_selected");
                }
            }
        });
    }
})