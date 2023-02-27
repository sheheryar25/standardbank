({
	doInit: function (component, event, helper) {
		helper.getInitData(component);
	},
	handleRefresh: function (component, event, helper) {
		helper.getInitData(component);
	},
	handleToggleFilters :  function (component, event, helper) {
		let showFilters = component.get('v.showFilters');
		showFilters = !showFilters;
		component.set('v.showFilters', showFilters);
		
		if(showFilters){
			component.find('filterRadio').focus();
		}
	},
	filterChanged : function (component, event, helper){
		helper.filterData(component);
	},
	handlePrev : function (component){
		let currPage = component.get('v.currentPage');
		if(currPage > 0){ 
			component.set('v.currentPage',--currPage);
		}
	},
	handleNext : function (component){
		let filtered = component.get('v.filteredConversationPaginated');
		let currPage = component.get('v.currentPage');
		if(filtered.length > currPage + 1){
			component.set('v.currentPage',++currPage);
		}
	},
	pageChanged : function(component, event, helper){
		helper.showCurrentPage(component);
	},
	handleResultChange : function (component, event, helper){
		component.set('v.currentPage',0);
		helper.paginate(component);
		helper.showCurrentPage(component);
	},
	handleRowPerPageChange : function (component,event, helper){
		component.set('v.currentPage',0);
		helper.paginate(component);
		helper.showCurrentPage(component);
	},
	changePage : function (component, event){
		component.set('v.currentPage', event.getSource().get('v.label') - 1);
	},
	sortName: function(component, event, helper) {
        var field = "Client__r.Name"
         var sortAsc = component.get("v.isAsc"),
             sortField = component.get("v.sortField"),
             records = component.get("v.conversations");
         sortAsc = field == sortField? !sortAsc: true;
         records.sort(function(a,b){
             var t1 = a.Client__r.Name == b.Client__r.Name,
                 t2 = a.Client__r.Name > b.Client__r.Name;
             return t1? 0: (sortAsc?-1:1)*(t2?-1:1);
         });
         component.set("v.isAsc", sortAsc);
         component.set("v.conversations", records);
         component.set("v.sortField", field);
    },
   	sortProduct: function(component, event, helper) {
        var field = "Subcategory__c"
         var sortAsc = component.get("v.isAsc"),
             sortField = component.get("v.sortField"),
             records = component.get("v.conversations");
         sortAsc = field == sortField? !sortAsc: true;
         records.sort(function(a,b){
             var t1 = a.Subcategory__c == b.Subcategory__c,
                 t2 = a.Subcategory__c > b.Subcategory__c;
             return t1? 0: (sortAsc?-1:1)*(t2?-1:1);
         });
         component.set("v.isAsc", sortAsc);
         component.set("v.conversations", records);
         component.set("v.sortField", field);
     },
    sortExpectedOI: function(component, event, helper) {
        var field = "Expected_OI__c"
         var sortAsc = component.get("v.isAsc"),
             sortField = component.get("v.sortField"),
             records = component.get("v.conversations");
         sortAsc = field == sortField? !sortAsc: true;
         records.sort(function(a,b){
             var t1 = a.Expected_OI__c == b.Expected_OI__c,
                 t2 = a.Expected_OI__c > b.Expected_OI__c;
             return t1? 0: (sortAsc?-1:1)*(t2?-1:1);
         });
         component.set("v.isAsc", sortAsc);
         component.set("v.conversations", records);
         component.set("v.sortField", field);
    }
})