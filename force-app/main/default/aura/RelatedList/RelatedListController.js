({
	doInit : function(component, event, helper) {
		if(component.get("v.records").length * component.get("v.fieldNames").length == 0){
			helper.fetchData(component,helper);
		}		
	},
	handleLabelsChange : function(component, event, helper) {
		helper.overrideLabels(component);
	},
	handleAddAction :  function(component, event, helper) {
		component.set('v.editMode', true);
		var componentAction = $A.get("e.c:ComponentAction");
		    componentAction.setParams({'data':{'name' : 'edit'}});
		    componentAction.fire();
		helper.addRow(component);
	},
	handleSaveAction: function(component, event, helper) {
		helper.saveData(component, helper);
	},
	handleRemoveAction : function(component, event, helper){
		helper.removeRow(component, helper, event.getSource().get("v.name"));
	},
	handleComponentAction : function(component, event, helper){
		if(component 
				&& event.getParam('data')
				&& event.getParam('data').name){

				var actionName = event.getParam('data').name;
				if(actionName=='edit'){
					component.set('v.editMode', true);
				} else if ( actionName == 'save' && component.get('v.edit')){
					helper.saveData(component, helper);
				}
				if (actionName == 'cancel'){
					component.set('v.editMode', false);
					helper.fetchData(component,helper);
				}
			}
	},
	modalconfirmremoval : function(component, event, helper){
		helper.removeActionConfirmed(component, helper);
		helper.hideModal(component);
	},
	modalabortremoval : function(component, event, helper){
		component.set('v.removeAtIndex',null);
		helper.hideModal(component);
	}
})