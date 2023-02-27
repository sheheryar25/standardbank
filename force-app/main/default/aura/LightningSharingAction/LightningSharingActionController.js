({
	componentActionHandler : function(component, event, helper) {

		if(component 
			&& event.getParam('data')
			&& event.getParam('data').name){
			var actionName = event.getParam('data').name;

			if(actionName=='done'){
				
				var dismissActionPanel = $A.get("e.force:closeQuickAction");
	        	dismissActionPanel.fire();

			}
		} 
	}
})