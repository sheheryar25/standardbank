/**
 * Created by zwalczewska on 25.10.2019.
 */

({
    getRecords: function (component, event, helper) {
        var action = component.get("c.fetchAccounts");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
				if(!$A.util.isEmpty(response.getReturnValue())){
				    response.getReturnValue().forEach(
						function(x){
							x.cURL = '/'+x.acc.Id;
							x.Name=x.acc.Name;
							x.BPID=x.acc.BPID__c;
							if(!$A.util.isEmpty(x.rev)){
								x.YTD_Operating_Income=x.rev.YTD_Operating_Income__c;
								x.YTD_Net_Interest_Income=x.rev.YTD_Net_Interest_Income__c;
								x.YTD_Non_Interest_Revenue=x.rev.YTD_Non_Interest_Revenue__c;
							}
						});
					response.getReturnValue().sort(function(a,b){
						return b.YTD_Operating_Income - a.YTD_Operating_Income ;
					});
					component.set("v.allAccounts", response.getReturnValue());
				}
				component.set('v.isLoading', false);
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
        });
        component.set('v.isLoading', true);
        $A.enqueueAction(action);
    },
    getPagePercentage: function (component, percentage) {
		var noOfPages = component.get('v.allAccountsPaginated').length;
		return Math.floor(noOfPages * (percentage/100));
    },
	showCurrentPage : function (component){
		component.set('v.accounts', component.get('v.allAccountsPaginated')[component.get('v.currentPage')]);
	},
	sliceToPages : function (data, itemsPerPage){
		let separatedData = [];
        for(let i = 0; i*itemsPerPage < data.length; i++){
            separatedData[i] = data.slice(i*itemsPerPage, (i+1) * itemsPerPage);
        }
        return separatedData;
	},
	paginate : function (component){
		component.set('v.allAccountsPaginated', this.sliceToPages(component.get('v.allAccounts'),component.get('v.rowPerPage')));
	},
	sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.allAccounts");
        if(fieldName == 'cURL'){
            var key = function(a){ return a['Name']};
        }
        else{
            var key = function(a) { return a[fieldName]; }
        }
        var reverse = sortDirection == 'asc' ? 1: -1;

        if(fieldName == 'cURL'){
            data.sort(function(a,b){
                var a = key(a) ? key(a).toLowerCase() : '';//To handle null values , uppercase records during sorting
                var b = key(b) ? key(b).toLowerCase() : '';
                return reverse * ((a>b) - (b>a));
            });
        }
        else if(fieldName == 'BPID'){
            data.sort(function(a,b){
                var a = parseInt(key(a));
                var b = parseInt(key(b));
                return reverse * ((a>b) - (b>a));
            });
        }
        else{// to handel currency type fields
            data.sort(function(a,b){
                var a = key(a) ? key(a) : '';
                var b = key(b) ? key(b) : '';
                return reverse * ((a>b) - (b>a));
            });
        }
        component.set("v.allAccounts",data);
        }
});