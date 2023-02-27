({

	/**this function will get entity type picklist values
	 * @param componentP is the component we are updating
	 */
	getEntityTypePicklistValues: function( componentP ){
		//prepare parameter
		let action_params = { objectNameP:'Ecosystem_Entity__c',
			fieldNameP:'Primary_Relationship_Holder__c',
			fieldsToExcludeP:[] };
		//create promise and process results
		this.promiseGetEntityTypePicklist( componentP ,action_params).then(

			//process success
			$A.getCallback( function( result ){ componentP.set( "v.prh_picklist_options", result ); }),

			//process error
			$A.getCallback( function( error ){ console.log( error ); })

		);

	},

	validateInput:function(componentP){

		if(componentP.get('v.isCIBorCommB')){
			let account = componentP.get('v.account');
			if(account){
				componentP.set("v.enableSave", true);
			}
			else {
				componentP.set("v.enableSave", false);
			}
		}
		else {
			if (componentP.get('v.user_input')) {
				componentP.set("v.enableSave", true);
			} else {
				componentP.set("v.enableSave", false);
			}
		}
	},



	/**this function will save record
	 * @param componentP is the component we are updating
	 * @param is_save_and_newP is the event we are processing
	 */
	save: function( componentP, is_save_and_newP ){

		componentP.set( "v.isWaiting", true );

		//create promise and process the results
		this.promiseCreateEcosystemEntity( componentP ).then(

			//process success
			$A.getCallback( function( result ){

				let created_event = componentP.getEvent( "oncreated" );
				created_event.setParam( "record", result );
				created_event.fire();

				//clear appropriate attributes
				componentP.set( "v.account", null );
				componentP.set( "v.type", null );
				componentP.set( "v.isWaiting", false );
				componentP.set( "v.enabledSave", false );

				//check if we have save and new ---> fields will be cleared
				if( is_save_and_newP )
					componentP.find( "object_lookup" ).clearLookupField();
				else
					componentP.getEvent( "oncancel" ).fire();

			}),

			$A.getCallback(function(error){
				componentP.set( "v.isWaiting", false );
			})
		);

	},





	/**this function will request entity type picklist values
	 * @param componentP this is the component that we are updating
	 * @returns {*|Promise<any>} this is the promise thats being created
	 */
	promiseGetEntityTypePicklist: function( componentP ,action_params){


		return this.createPromise( componentP, "c.getPicklistValues", action_params );

	},





	/**this function will create an ecosystem entity
	 * @param componentP this is the component that we are updating
	 * @returns {*|Promise<any>}
	 */
	promiseCreateEcosystemEntity: function( componentP ){

		let account = componentP.get( "v.account" );
		//prepare action parameters
		let action_params = { ecosystemId:componentP.get( "v.recordId" ),
							  accountId: account==null ? null : account.Id,
							  type:componentP.get( "v.type" ),
			                  prh: account==null ? componentP.get('v.primaryRelationshipHolder'):account.Primary_Relationship_Holder__c,
			                  entityName:	account==null ? componentP.get('v.user_input'):account.Name
		};

		return this.createPromise( componentP, "c.createEcosystemEntity", action_params );

	},





	/**this function will create a promise object
	 * @param componentP is the component we are updating
	 * @param action_nameP is the name of the action we are calling from server
	 * @param paramsP is parameters if available
	 */
	createPromise: function( componentP, action_nameP, paramsP ){

		//create new promise
		return new Promise( function( resolve, reject ){

			let action = componentP.get( action_nameP );

			//check if parameters are being passed
			if( paramsP )
				action.setParams( paramsP );

			//set the action callback
			action.setCallback( this, function( response ){

				//check if we have success state
				if( response.getState() === "SUCCESS" )
					resolve( response.getReturnValue() );
				else
					reject( response.getError() );

			});

			$A.enqueueAction( action );             //enqueue the action

		});

	},

});