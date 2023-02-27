({	
	loadAndPleaceComponent: function (mainContainerID, count, component, ltnCmpName, recId,i){
		
		$A.createComponents(
			[
				[
					'aura:html',
					{
						tag: "div",
						HTMLAttributes: {"class" : "slds-p-horizontal_xx-small slds-size_1-of-"+(count) 	}
					}
				],
				[
					ltnCmpName,
					{
						recordId: recId
					}
				]
			],
			function(components, status, errorMessage){
				if (status === "SUCCESS") {
					var container = components[0];
					var content = components[1];
					container.set("v.body", content);
					var mainContainer = component.find(mainContainerID);
					var body = mainContainer.get("v.body");
					body[i] = (container);
					mainContainer.set("v.body", body);
				}
				else if (status === "INCOMPLETE") {
					console.log("No response from server or client is offline")
				}
				else if (status === "ERROR") {
					console.log("Error: " + errorMessage);
				}
			}
		);
	}
})