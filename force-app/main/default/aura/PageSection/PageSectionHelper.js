({
	placeFieldSets: function (component, fieldsetElement,i) {
	    console.log('sObjectName  ' + component.get("v.sObjectName"));
		var recordId = component.get("v.recordId");
		var count = component.get("v.noOfColumns");
		var ltnCmpName = "c:FieldSet";
		$A.createComponents(
			[
				[
					'aura:html',
					{
						tag: "div",
                        HTMLAttributes: {"class" : "slds-p-around_xx-small slds-size_1-of-"+(count)	}
					}
				],
				[
					ltnCmpName,
					{
						recordId: recordId,
						fieldSet: fieldsetElement, 
						columns : 1,
						showBorder : component.get("v.showBorder"),
                        textAlign : component.get("v.textAlign"),
                        sObjectName : component.get("v.sObjectName")
					}
				]
			],
			function(components, status, errorMessage){
				if (status === "SUCCESS") {
					var container = components[0];
					var content = components[1];
					container.set("v.body", content);
					var mainContainer = component.find("fieldset_container_root");
					var body = mainContainer.get("v.body");
					body.push(container);
					mainContainer.set("v.body", body);
				}
				else if (status === "INCOMPLETE") {
					console.log("No response from server or client is offline.")
				}
				else if (status === "ERROR") {
					console.log("Error: " + errorMessage);
				}
			}
		);
	}
})