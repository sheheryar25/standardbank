/**
 * Created by zwalczewska on 25.10.2019.
 */

({
    doInit: function (component, event, helper) {
        component.set('v.columns', [
           {label: 'Client Name', fieldName: 'cURL', type: 'url', sortable : true, initialWidth : 400,
                typeAttributes: {label: {fieldName: 'Name'},title: 'Click to View Details', target:'self'}},
           {label: 'BPID', fieldName: 'BPID',sortable : true, type: 'text'},
           {label: 'Operating Income', fieldName: 'YTD_Operating_Income', type: 'number', sortable : true, cellAttributes: { alignment: 'left' } },
           {label: 'Net Interest Income', fieldName: 'YTD_Net_Interest_Income', type: 'number', sortable : true, cellAttributes: { alignment: 'left' } },
           {label: 'Non Interest Revenue', fieldName: 'YTD_Non_Interest_Revenue', type: 'number', sortable : true, cellAttributes: { alignment: 'left' } }
        ]);
        helper.getRecords(component, event, helper);
    },

    handleGoTo : function (component, event, helper) {
		var number = event.getSource().get('v.name');
		component.set("v.sortBy",'YTD_Operating_Income');
        component.set("v.sortDirection", 'dsc'); 
		helper.sortData(component,'YTD_Operating_Income','dsc');
		component.set('v.currentPage', helper.getPagePercentage(component, number));
    },


	handlePrev : function (component){
		let currPage = component.get('v.currentPage');
		if(currPage > 0){ 
			component.set('v.currentPage',--currPage);
		}
	},
	handleNext : function (component){
		let filtered = component.get('v.allAccountsPaginated');
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
	handleSort : function(component,event,helper){
        var sortBy = event.getParam("fieldName");
        var sortDirection = event.getParam("sortDirection");
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        helper.sortData(component,sortBy,sortDirection);
    }
});