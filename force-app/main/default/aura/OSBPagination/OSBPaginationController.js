({
    doInit: function(component, event, helper) {
        let data = component.get("v.data");
        let pageSize = component.get("v.pageSize");
        let pagesTotal = Math.ceil(data.length / pageSize);
        let pages = [];
        for(let page = 1; page <= pagesTotal; page++) {
            pages.push(page);
        }
        component.set("v.pages", pages);
        component.set("v.pagesTotal", pagesTotal);
        let isSearched = component.get("v.isSearched");
        if (isSearched==true){
                component.set("v.currentPage", 1);
                helper.changePage(component, helper);
        }else{
            helper.changePage(component, helper);
        }
    },
   
    onNextPage : function(component, event, helper) {
        if(event.currentTarget.dataset.disabled == 'true') {
            return;
        } else {
            let isSearched = component.get("v.isSearched");
            if (isSearched==true){
                component.set("v.currentPage", 1);
                helper.changePage(component, helper);
            }else{
                let pageNumber = component.get("v.currentPage");
                component.set("v.currentPage", pageNumber+1);
                helper.changePage(component, helper);
            }
        }
    },
    
    onPrevPage : function(component, event, helper) {
        if(event.currentTarget.dataset.disabled == 'true') {
            return;
        } else {
            let isSearched = component.get("v.isSearched");
            if (isSearched==true){
                component.set("v.currentPage", "1");
                helper.changePage(component, helper);
            }else{
                let pageNumber = component.get("v.currentPage");
                component.set("v.currentPage", pageNumber-1);
                helper.changePage(component, helper);
            }
        }
    },
    
    onFirstPage : function(component, event, helper) {
        if(event.currentTarget.dataset.disabled == 'true') {
            return;
        } else {
            component.set("v.currentPage", 1);
            helper.changePage(component, helper);
        }
    },
    
    onLastPage : function(component, event, helper) {
        if(event.currentTarget.dataset.disabled == 'true') {
            return;
        } else {
            component.set("v.currentPage", component.get("v.pagesTotal"));
            helper.changePage(component, helper);
        }
    },
    
    onPageButtonClick : function(component, event, helper){
        component.set("v.currentPage", event.target.name);
        helper.changePage(component, helper);
    },

    dataChange :function(component, event, helper) {
        
        let data = component.get("v.data");
        let pageSize = component.get("v.pageSize");
        let pagesTotal = Math.ceil(data.length / pageSize);
        let pages = [];
        for(let page = 1; page <= pagesTotal; page++) {
            pages.push(page);
        }
        component.set("v.pages", pages);
        component.set("v.pagesTotal", pagesTotal);
        let isSearched = component.get("v.isSearched");
        if (isSearched==true){
                component.set("v.currentPage", 1);
                helper.changePage(component, helper);
            
        }else{
            helper.changePage(component, helper);
        }
        
    }
})