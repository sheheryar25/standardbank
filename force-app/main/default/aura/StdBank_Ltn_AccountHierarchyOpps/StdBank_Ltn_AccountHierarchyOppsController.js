({
	doInit : function(component, event, helper) {
		helper.fetchOptions(component);
        helper.fetchOpps(component);   
	},

    sortData : function(component, event){

        var selectedItem = event.currentTarget;
        var property = selectedItem.dataset.record;

        var data = component.get("v.opportunities");
        var sortOrder = component.get("v.sortOrder");

        data.sort(function(a,b){

            p = property.split('.');
            for (var i = 0, len = p.length; i <= len - 1; i++){
                a = a[p[i]];
                b = b[p[i]]; 
            }

            if(a == null || a == 'undefined'){ a = '-'; }

            if(b == null || b == 'undefined'){ b = '-'; }

            var result = (a < b) ? -1 : (a > b) ? 1 : 0; 

            return result * sortOrder; 
        }); 

		component.set("v.opportunities", null);
        component.set("v.opportunities", data); 
        component.set("v.sortOrder", sortOrder * -1); 
        component.set("v.sortCollumn", property); 
    }
})