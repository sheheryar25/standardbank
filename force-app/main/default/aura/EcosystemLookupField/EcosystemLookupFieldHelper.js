/**
 * Created by Chibuye Kunda on 2019/07/12.
 */

({

    /**this function will get suggestions
     * @param componentP is the component we are updating
     * @param target_valueP is the value we are searching for
     * @return none
     */
    getSuggestions: function( componentP, target_valueP ){

        //execute the promise
        this.promiseGetSuggestions( componentP, target_valueP ).then(

            //process the success result
            $A.getCallback( function( result ){

                //check if array length is zero
                if( result.length === 0 )
                    componentP.set( "v.server_message", "No Results Found..." );
                else
                    componentP.set( "v.server_message", "" );

                componentP.set( "v.record_list", result );

            }),

            //process the failure
            $A.getCallback( function( error ){
                console.log( error );
            })

        );

    },





    /**this will create promise to request suggestions
     * @param componentP is the component we are updating
     * @param target_valueP is the target value that we searching for
     * @return {*|Promise<any>}
     */
    promiseGetSuggestions: function( componentP, target_valueP ) {

        let promise;

        //check if we have banked client ---> make request for banked client
        if ( componentP.get("v.is_banked") )
            promise = this.createPromise( componentP,
                               "c.findMatchingBankedAccounts",
                                  { cifORnameP:target_valueP, ecosystemIdP:componentP.get( "v.ecosystem_id" ) } );
        else
            promise = this.createPromise( componentP,
                               "c.findMatchingUnbankedAccounts",
                                  { nameP:target_valueP, ecosystemIdP:componentP.get( "v.ecosystem_idP" ) } );

        return promise;

    },





    /**this function will create a promise
     * @param componentP is the component we are updating
     * @param action_nameP is the name of the server action
     * @param paramP is the parameters we will add to action( can be null )
     * @return {Promise<any>}
     */
    createPromise: function( componentP, action_nameP, paramsP ){

        //create a new Promise
        return new Promise( function( resolve, reject ){

            let action = componentP.get( action_nameP );

            //check if we have parameters
            if( paramsP )
                action.setParams( paramsP );

            //set the callback action
            action.setCallback( this, function( response ){

                //check if we have success state
                if( response.getState() === "SUCCESS" )
                    resolve( response.getReturnValue() );
                else
                    reject( response.getError() );

            });

            $A.enqueueAction( action );

        });

    },




    /**this function will clear the selected record and adjust CSS
     * @param componentP is the component we are updating
     */
    clearCSS: function( componentP ){

        //update styling for the lookup pill
        $A.util.addClass( componentP.find( "lookup_pill" ), "slds-hide" );
        $A.util.removeClass( componentP.find( "lookup_pill" ), "slds-show" );

        //update styling for the lookup field
        $A.util.addClass( componentP.find( "lookup_field" ), 'slds-show');
        $A.util.removeClass( componentP.find( "lookup_field" ), 'slds-hide');

        componentP.set( "v.target_record",null );           //clear the target account
        componentP.set( "v.record_list", null );
        componentP.set("v.selected_record", null );

    }

});