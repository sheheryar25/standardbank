({
	getInitData: function (cmp) {
		var helper = this;
        var action = cmp.get("c.getInitData");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {      
				var wrapper =  response.getReturnValue();      
				cmp.set('v.filteredConversation', wrapper.conversations);
				cmp.set('v.allConversation', wrapper.conversations);
				cmp.set('v.options', wrapper.filterValues);
				cmp.set('v.filteredBy', wrapper.filterValues.map(function(x){return x.value;}));
            }
            else if (state === "INCOMPLETE") {
                // do something 
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
			cmp.set('v.isLoading', false);

        });
		cmp.set('v.isLoading', true);
        $A.enqueueAction(action);
	
	},
	filterData : function (component) {
		var allRecords = component.get('v.allConversation');
		var selectedFilter = component.get('v.filteredBy');
		var searchPhase  = component.get('v.searchPhase');
		component.set('v.filteredConversation' ,allRecords.filter(function(x){
			return selectedFilter.includes(x.Category__c) && ( $A.util.isEmpty(searchPhase) || x.Subcategory__c.toLowerCase().indexOf(searchPhase.toLowerCase()) != -1);
		}));
	},
	showCurrentPage : function (component){
		component.set('v.conversations', component.get('v.filteredConversationPaginated')[component.get('v.currentPage')]);
	},
	sliceToPages : function (data, itemsPerPage){
		let separatedData = [];
        for(let i = 0; i*itemsPerPage < data.length; i++){
            separatedData[i] = data.slice(i*itemsPerPage, (i+1) * itemsPerPage);
        }
        return separatedData;
	},
	paginate : function (component){
		component.set('v.filteredConversationPaginated', this.sliceToPages(component.get('v.filteredConversation'),component.get('v.rowPerPage')));
	},
    sortBy: function(component, field) {
         var sortAsc = component.get("v.isAsc"),
             sortField = component.get("v.sortField"),
             records = component.get("v.conversations");
         sortAsc = field == sortField? !sortAsc: true;
         records.sort(function(a,b){
             var t1 = a.field == b.field,
                 t2 = a.field > b.field;
             return t1? 0: (sortAsc?-1:1)*(t2?-1:1);
         });
         component.set("v.isAsc", sortAsc);
         component.set("v.conversations", records);
         component.set("v.sortField", field);
    }
})