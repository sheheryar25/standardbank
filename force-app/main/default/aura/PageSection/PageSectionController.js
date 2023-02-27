({
	doInit : function(component, event, helper) {
		var fieldsetsV = component.get("v.fieldsets");
		var noOfColumnsV = component.get("v.noOfColumns");
		if(fieldsetsV){
			var fieldsetArray = fieldsetsV.split(";");
			for(let i = 0 ; i < fieldsetArray.length; i++){
				helper.placeFieldSets(component, fieldsetArray[i],i);
			}
		}
	}
})