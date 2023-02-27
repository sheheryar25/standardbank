({
	
	handleRecordUpdated : function(component, event, helper) {
		var clone = JSON.parse(JSON.stringify(component.get("v.record")));
        component.set("v.record", clone);
        component.set("v.RecordTypeId", component.get("v.record.RecordTypeId"));
	},

	doInit : function(component, event, helper) {
        helper.doInit(component);
    },

	handleComponentAction: function(component,event, helper){
		if(component 
			&& event.getParam('data')
			&& event.getParam('data').name){

			var actionName = event.getParam('data').name;
			
			if(actionName=='edit'){
				component.set("v.editMode", true);
			}else if(actionName=='cancel'){
				helper.doReload(component);
                component.set("v.editMode", false);
			}else if(actionName=='save'){
                //helper.doReload(component);
                component.set("v.editMode", false);
			}
		}
	}
})