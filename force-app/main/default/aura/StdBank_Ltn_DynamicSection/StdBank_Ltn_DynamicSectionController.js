({
	doInit : function(component, event, helper) {
		let compList = [];
		var recId = component.get("v.recordId");

		if(component.get("v.comp1Name")){
			var compName1 = "c:"+component.get("v.comp1Name");
			compList.push(compName1);
		}
		if(component.get("v.comp2Name")){
			var compName2 = "c:"+component.get("v.comp2Name");
			compList.push(compName2);
		}
		if(component.get("v.comp3Name")){
			var compName3 = "c:"+component.get("v.comp3Name");
			compList.push(compName3);
		}

		if(component.get("v.comp4Name")){
			var compName4 = "c:"+component.get("v.comp4Name");
			compList.push(compName4);
		}

		for(let i = 0 ; i < compList.length; i++){
			
			helper.loadAndPleaceComponent("comp_container_main", compList.length, component, compList[i], recId,i);
		}
	}
})