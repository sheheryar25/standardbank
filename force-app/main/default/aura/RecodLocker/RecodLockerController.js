({
	handleComponentAction : function(component, event, helper) {
		if(component
			&& event.getParam('data')
			&& event.getParam('data').name){

			var actionName = event.getParam('data').name;

			if(actionName=='lock'){
				helper.doLock(component);
				$A.util.removeClass(component.find("outputMessage"), "slds-hide");
			}else if(actionName=='cancel'){
				helper.doUnlock(component);
				$A.util.removeClass(component.find("outputMessage"), "slds-hide");
			}else if(actionName=='save') {
			    $A.util.addClass(component.find("outputMessage"), "slds-hide");
            }
		}
	},

	handleRecordUpdated: function(component, event, helper) {
		var changeType = event.getParams().changeType;
		if(changeType=="CHANGED"){
			component.find("forceRecord").reloadRecord();
		}else if(changeType=="LOADED"){
			var userId = component.get("v.userId");
			if(userId){
				if(component.get("v.inProgress")){
					component.set("v.inProgress", false);
				}else{
					helper.doUnlock(component);
				}
			}else{
				helper.doInit(component);
			}
		}
	}
})