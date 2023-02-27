({



	/** this function will be called on save
	 * @param componentP is the component we are updating
	 */
	save: function( componentP ){

		componentP.set( "v.isWaiting", true );				//enable spinner

		//execute the promise
		this.promiseCreateAccount( componentP, componentP.get( "v.account" ) ).then(

			//prepare callback
			$A.getCallback( function( result ){

				componentP.set( "v.isWaiting", false );				//disable spinner

				//check if the result is a string ---> will indicate we have an error message
				if( typeof( result ) === "string" ){

					componentP.set( "v.hasError", true );
					componentP.set( "v.errorMessage", result );

				}
				else{

					componentP.set( "v.account", result );

					let created = componentP.getEvent( "oncreated" );
					created.setParam( "record", result );
					created.fire();

					componentP.getEvent( "oncancel" ).fire();

				}

			}),//end of the callback defintion

			//process error messages
			$A.getCallback( function( errors ){

				componentP.set("v.isWaiting", false);
				componentP.set("v.hasError", true);
				componentP.set("v.errorMessage", helperP.getErrorMessage( errors ));

			})

		);

	},





	/** this function will get the ecosystem record ID
	 * @param componentP is the component we are updating
	 * @returns {*|Promise<any>}
	 */
	promiseGetEcosystemRecordTypeId: function( componentP ) {

		return this.createPromise( componentP, "c.getEcosystemRecordTypeId" );

	},





	/** this function will get the prospect record type
	 * @param componentP is the component that we are updating
	 * @returns {*|Promise<any>}
	 */
	promiseGetProspectRecordTypeId: function( componentP ){

		return this.createPromise( componentP, "c.getProspectRecordTypeId" );

	},





	/** this function will get current user ID
	 * @param componentP is the component we are updating
	 * @returns {*|Promise<any>}
	 */
	promiseGetCurrentUserId: function( componentP ){

		return this.createPromise( componentP, "c.getCurrentUserId" );

	},





	/** this function will get the account options
	 * @param componentP is the component we are updating
	 * @returns {*|Promise<any>}
	 */
	promiseGetAccountOptions: function( componentP ) {

		return this.createPromise(componentP, "c.getAccountOptions");

	},





	/** this function will create a new account object
	 * @param componentP is the component that we are updating
	 * @param accountP
	 * @returns {*|Promise<any>}
	 */
	promiseCreateAccount: function( componentP, accountP ){

		return this.createPromise( componentP, "c.createAccount", {"acc": accountP});

	},





	/** this function will create our promise
     * @param componentP is the component we are updating
     * @param nameP is the action name
     * @param paramsP is the params we are passing to promise
     * @returns {Promise<any>}
     */
	createPromise: function( componentP, nameP, paramsP ){

	    //create a return new promise
		return new Promise(function( resolveP, rejectP ){

			let action = componentP.get( nameP );

            //check if params are defined
			if( paramsP )
			    action.setParams( paramsP );

			//prepare our callback function
			action.setCallback( this, function( response ){

				//check if we have success
				if( componentP.isValid() && response.getState() === "SUCCESS")
					resolveP( response.getReturnValue() );
				else
					rejectP( response.getError() );

			});//end of callback definition

			$A.enqueueAction( action );

		});

	},


	setPrh: function(componentP){
		let new_account = componentP.get( "v.account" );
		new_account.Primary_Relationship_Holder__c = componentP.find( "select-type" ).get( "v.value" );
		componentP.set( "v.account", new_account );
		return new_account;
	},


	/** this function will enable or disable the save button
	 * @param componentP is the component we are updating
	 * @param accountP is the account we are checking
	 */
	setEnableSave: function( componentP, accountP ){

		let required_fields;

		//check if we have banked client
		if( componentP.get( "v.banked" ) )
			required_fields = [ accountP.Name, accountP.CIF__c, accountP.Primary_Relationship_Holder__c ];
		else
			required_fields = [ accountP.Name, accountP.Primary_Relationship_Holder__c, accountP.Client_Co_ordinator__c ];

		//check if the save should be enabled
		let enable_save = required_fields.map( this.hasValue ).reduce( function( acc, value ){
			return acc && value;
		}, true );

		componentP.set( "v.enableSave", enable_save );

	},





	/** this function will check if the value is valid
	 * @param valueP is the value we are checking
	 * @returns true will be returned is value is valid
	 */
	hasValue: function( valueP ){

		//check if value is valid
		if( valueP )
			return valueP.trim().length > 0;				//check if we have length greater than zero

	},





	/** this function will return the error message
	 * @param errorsP is the list of error messages
	 * @returns will return string of errors
	 */
	getErrorMessage: function( errorsP ){

		let message = 'Unknown error occured';

		//check if we have error messages
		if( errorsP && errorsP[0] ){

			//check if we have error message
			if( errorsP[0].message )
				message = errorsP[0].message;
			//check if we have field error
			else if( Array.isArray(errorsP[0].fieldErrors) )
				message = errorsP[0].fieldErrors[0].message;
			//check if we have page error
			else if( Array.isArray(errorsP[0].pageErrors) )
				message = errorsP[0].pageErrors[0].message;

		}

		return message;

	}

});