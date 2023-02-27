({
    doInit : function(component, event, helper) {
        var items = component.get("v.menuItems");
        var highlightAPI = component.get("v.isAPIProduct");
        if(highlightAPI) {
            let apiSection = 'API Products';
            var items = component.get("v.menuItems");
            for(let index in items) {
                let item = items[index];
                if(item.label == apiSection) {
                    item.active = true;
                }
            }
        }
        component.set("v.customMenuItems", items);
    },

	onClick : function(component, event, helper) {
       var id = event.target.dataset.menuItemId;
       if (id) {
           component.getSuper().navigate(id);
        }
    }
})