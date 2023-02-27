({
	helperMethod : function() {
		
	},




	/** this functiion will determine if dashboard column heading
	 *  should be shown
	 *  @param componentP is the component we are updating
	 */
	showDashboardHeading: function( componentP ){

		var action = componentP.get( "c.shouldShowDashboard" );

		action.setCallback( this, function( response ){

			//check if we have success
			if( response.getState() === "SUCCESS" )
				componentP.set( "v.show_dashboard", response.getReturnValue() );					//get the return value

		});//end of function definition

		$A.enqueueAction( action );		//execute the action

	}//end of function definition



})