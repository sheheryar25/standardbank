({
	setup : function(component, event, helper) {
        if(component.get("v.icon")){           
            var parts = component.get("v.icon").split("#");;
            component.set("v.iconcategory",parts[0]);
            component.set("v.icontype",parts[1]);
                          
        }
	},

	open : function(component, event, helper){
		var link = component.get("v.link");
		window.open(link, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
	}
})