({
	doInit : function(component, event, helper) {
		helper.init(component);	
	},

    /** this function will process link click
	 * @param componentP is the component we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	redirectToClient: function( componentP, eventP, helperP ){

		let client_record_id = eventP.getSource().get( "v.name" );					//get the object ID which is stored in name attribute
       	let nav_link = componentP.find( "nav_service" );									 //find the nav link

        //setup the page reference object
        let page_reference = {
            type:"standard__recordPage",
            attributes:{
                actionName:"view",
                objectApiName:'Account',
                recordId:client_record_id
            }
        };//end of page reference definition

        nav_link.navigate( page_reference, true );			//navigate to page and open record page

	},//end of function definition


	onAllChange : function(component, event, helper) {
		var bankedClients = component.get("v.bankedClients");
		bankedClients.forEach(function(element) {
			element.selected = event.target.checked;
		});
		component.set("v.bankedClients", bankedClients);
		component.set("v.enableDelete", event.target.checked);
		component.set("v.allSelected", event.target.checked);
	},

	onItemChange : function(component, event, helper) {
		var elementIndex = helper.getIndex(event);
		var bankedClients = component.get("v.bankedClients");
		bankedClients[elementIndex].selected = event.target.checked;
		var enableDelete = bankedClients.reduce(function(acc, value) {
			return acc || value.selected;
		}, false);
		var allSelected = bankedClients.reduce(function(acc, value) {
			return acc && value.selected;
		}, true);
		component.set("v.bankedClients", bankedClients);
		component.set("v.enableDelete", enableDelete);
		component.set("v.allSelected", allSelected);
	},

	onDelete : function(component, event, helper) {
		component.set("v.confirmDelete", true);
	},

	onDeleteConfirm : function(component, event, helper) {
		component.set("v.confirmDelete", false);
		component.set("v.isWaiting", true);
		var bankedClients = component.get("v.bankedClients");
		var entities = bankedClients
			.filter(function(element) {
				return element.selected === true;
			})
			.map(function(element) {
				return element.entity;
			});

		helper.promiseDeleteEntities(component, entities)
			.then(
				$A.getCallback(function(result) {
					var newBankadClients = bankedClients.filter(function(element) {
						return element.selected !== true;
					});
					component.set("v.bankedClients", newBankadClients);
					component.set("v.isWaiting", false);
					component.set("v.enableDelete", false);
					component.set("v.allSelected", false);

					var event = $A.get("e.c:ecosystemEntityUnbankedChange");
					event.setParams({"type": component.get("v.type")});
					event.fire();
				}),
				$A.getCallback(function(error) {
					component.set("v.isWaiting", false);
				})
			);

	},

	onDeleteClose : function(component, event, helper) {
		component.set("v.confirmDelete", false);
	},

	onNew : function(component, event, helper) {
		component.set("v.newEntity", true);
	},

	onNewCancel : function(component, event, helper) {
		component.set("v.newEntity", false);
	},

	onCreated : function(component, event, helper) {
		var record = event.getParam("record");

		var event = $A.get("e.c:ecosystemEntityUnbankedChange");
		event.setParams({"type": record.Entity_Type__c});
		event.fire();
	},

	onEntityChange : function(component, event, helper) {
		if (event.getParam("type") === component.get("v.type")) {
			helper.init(component);
		}
	},




	/**this function will be called when convert is pushed
	 * @param componentP component that will be updated
	 * @param eventP is the event that is being processed
	 * @param helperP is the helper object
	 */
	onConvertClick : function( componentP, eventP, helperP ){

		let prh = eventP.getSource().get( "v.title" );				//get the button title( this holds Primary Relationship Holder value )

		//check if we have a commercial banking PRH
		if( prh === "Commercial Banking" ){

			helperP.showToast( "Error", "Please onboard using the client onboarding process" );
			return;						//terminate function

		}
		//check if we have CIB PRH value
		else if( prh === "Corporate and Investment Banking" ){

			helperP.showToast( "Error", "Please assign a " + prh + " client coordinator to onboard client" )
			return;				//terminate function

		}

		let btnName = eventP.getSource().get( "v.name" );
		let recId = btnName.split( "-" )[0];

		componentP.set( "v.idToConvert", recId );
		componentP.set( "v.convertToBanked", true );

	},




	onConvertCancel : function(component, event, helper) {
		component.set("v.convertToBanked", false);
	},

	onConvertDone : function(component, event, helper) {
		component.set("v.convertToBanked", false);

		var type = component.get("v.type");

		var penetrationEvent = $A.get("e.c:ecosystemPenetrationChange");
		penetrationEvent.setParams({"type": type});
		penetrationEvent.fire();

		var bankedEvent = $A.get("e.c:ecosystemEntityChange");
		bankedEvent.setParams({"type": type});
		bankedEvent.fire();

		var unbankedEvent = $A.get("e.c:ecosystemEntityUnbankedChange");
		unbankedEvent.setParams({"type": type});
		unbankedEvent.fire();
	}
})