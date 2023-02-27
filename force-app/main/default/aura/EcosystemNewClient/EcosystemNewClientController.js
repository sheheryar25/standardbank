({


	/** this function will be called on lightning initialisation
	 * @param componentP is the component that we are updating
	 * @param eventP is the event that we are processing
	 * @param helperP is the helper object
	 */
	doInit: function( componentP, eventP, helperP ){
		/** execute all promises
		 */
		Promise.all([
			helperP.promiseGetEcosystemRecordTypeId( componentP ),
			helperP.promiseGetCurrentUserId( componentP ),
			helperP.promiseGetAccountOptions( componentP ) ] ).then(

				//success callback function
				$A.getCallback( function( result ){
					componentP.set( "v.account",{
						"sobjectType": "Account",
						"RecordTypeId": result[0],
						"Name": componentP.get("v.accountName")
					});
					//setup the return components
					componentP.set("v.recordTypeId", result[0]);
					componentP.set("v.currentUserId", result[1]);
					componentP.set("v.options", result[2]);
					componentP.set("v.isLoading", false);
					componentP.find("account-name").focus();
					helperP.setPrh(componentP);
				}),

				//error callback function
				$A.getCallback( function( error ){
					componentP.set("v.isLoading", false);
				})

			);

	},





	/** this function will be called when the name field value is changed
	 * @param componentP is the component we are updating
	 * @param eventP is the event that we are processing
	 * @param helperP is the helper object
	 */
	onNameChange: function( componentP, eventP, helperP ){

		let new_account = componentP.get( "v.account" );
		new_account.Name = componentP.find( "account-name" ).get( "v.value" );
		componentP.set( "v.account", new_account );
		helperP.setEnableSave( componentP, new_account );

	},





	/** this function will be called when the CIF input changes
	 * @param componentP is the component that we are updating
	 * @param eventP is the event we are processing
	 * @param helperP is the helper object that we are working with
	 */
	onCifChange: function( componentP, eventP, helperP ){

		let new_account = componentP.get( "v.account" );
		new_account.CIF__c = componentP.find( "account-cif" ).get( "v.value" );

		componentP.set( "v.account", new_account );
		helperP.setEnableSave( componentP, new_account );			//check if save button should be enabled

	},





    /** this function will be called when Proposed Client Coordinator is changed
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
	onPCCChange: function( componentP, eventP, helperP ){

		let new_account = componentP.get( "v.account" );
		new_account.Client_Co_ordinator__c = componentP.get( "v.client_coordinator" );

		helperP.setEnableSave( componentP, new_account );

	},





	/** this function will be called when select option is changed
	 * @param componentP is the component that we are updating
	 * @param eventP is the event that we are processing
	 * @param helperP is the helper object that we working with
	 */
	onSelectChange: function( componentP, eventP, helperP ){

		let new_account = helperP.setPrh(componentP);
		helperP.setEnableSave( componentP, new_account );

	},





    /** this function will be call fire cancel event
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
	onCancel: function( componentP, eventP, helperP ){

	    componentP.getEvent("oncancel").fire();

	},





    /** this function will be called when save button is pushed
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
	onSave: function( componentP, eventP, helperP ){

		helperP.save( componentP );

	}

});