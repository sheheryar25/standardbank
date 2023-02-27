({
	// Your renderer method overrides go here
    afterRender: function (component) {
        this.superAfterRender();
        var mrktPlaceElement = document.getElementById("marketplaceBreadCrumbDiv");
        var dshbrdElement = document.getElementById("dashboardBreadCrumbDiv");
        if(component.get("v.currentTab") == "Market"){
            if(!mrktPlaceElement.classList.contains("breadcrumbs__main-item__selected")){
                mrktPlaceElement.classList.add("breadcrumbs__main-item__selected");
                if(dshbrdElement.classList.contains("breadcrumbs__main-item__selected")){
                    dshbrdElement.classList.remove("breadcrumbs__main-item__selected");
                }
            }
        }
    }
})