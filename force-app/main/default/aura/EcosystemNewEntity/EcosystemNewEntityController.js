({


	/**this function is called on component initialisation
	 * @param componentP is the component we are updating
	 * @param eventP is the event that is being processed
	 * @param helperP is the helper object
	 */
	onInit: function( componentP, eventP, helperP ){

		helperP.getEntityTypePicklistValues( componentP );

	},





	/** this function will be called when there is a change to account
	 *  @param componentP is the component we are updating
	 *  @param eventP is the event we are processing
	 *  @param helperP is the helper object
	 */
	onAccountChange: function( componentP, eventP, helperP ){

		componentP.set( "v.enableSave", Boolean( eventP.getParam( "value" ) ) );
		let account = componentP.get('v.account');
		if(account){
			componentP.set('v.primaryRelationshipHolder',account.Primary_Relationship_Holder__c);
		}
	},

	onClientNameTextChange: function(componentP, eventP, helperP){

		helperP.validateInput(componentP);
	},


	/** this function will be called when select option is changed
	 * @param componentP is the component that we are updating
	 * @param eventP is the event that we are processing
	 * @param helperP is the helper object that we working with
	 */
	onSelectChange: function( componentP, eventP, helperP ){

		componentP.set( "v.primaryRelationshipHolder", componentP.find( "prh_select" ).get( "v.value" ) );
		if(componentP.find( "prh_select" ).get( "v.value" )=='Commercial Banking' ||
			componentP.find( "prh_select" ).get( "v.value" )=='Corporate and Investment Banking'){
			componentP.set("v.isCIBorCommB",true);
		}
		else {
			componentP.set("v.isCIBorCommB",false);
		}

		helperP.validateInput(componentP);
	},




	/**this function will be called when the lookup clear event occurs
	 * @param componentP is the component we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onLookupCleared: function( componentP, eventP, helperP ){

		componentP.set( "v.account.CIF__c", "" );
		componentP.set( "v.account", null );
		componentP.set( "v.enableSave", false );

	},





	/**this function will be called when the cancel button is pushed
	 * @param componentP is the component we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onCancel: function( componentP, eventP, helperP ){

		componentP.getEvent( "oncancel" ).fire();

	},





	/**this function will be called when the save and new button is pushed
	 * @param componentP is the component we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onSaveAndNew: function( componentP, eventP, helperP ){

		helperP.save( componentP, true );			//in this case create multiple records so modal wont be closed

	},





	/**this function will handle the save button being clicked
	 * @param componentP is the component that we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onSave: function( componentP, eventP, helperP ){

		helperP.save( componentP, false );				//in this case creating single record and closing modal on successful creation

	},





	/**this function will be called when the a new client is being created
	 * @param componentP is the component we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onNewClientCancel: function( componentP, eventP, helperP ){

		componentP.set("v.newClient", false);

	},





	/**this function will handle oncreate event
	 * @param componentP is the component that we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object
	 */
	onNewClientCreated: function( componentP, eventP, helperP ) {

		componentP.find( "object_lookup" ).populateRecord( eventP.getParam( "record" ) );
		componentP.set( "v.account", eventP.getParam( "record" ) );
		componentP.set( "v.newClient", false );

	}

});