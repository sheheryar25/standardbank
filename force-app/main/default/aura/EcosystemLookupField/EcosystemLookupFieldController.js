/**
 * Created by Chibuye Kunda on 2019/07/12.
 */

({

    /**This function will be called when component
     * @param componentP is the component that we are updating
     * @param eventP is the event that we are processing
     * @param helperP is the helper object
     */
    onInit: function( componentP, eventP, helperP ){

        //check if we are processing banked client
        if( componentP.get( "v.is_banked" ) )
            componentP.set( "v.help_text", "Search for Clients On Name, CIF or BPID field" );
        else
            componentP.set( "v.help_text", "Search for Clients on Name" );

    },





    /**this function will be called when our lookup gets focus
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
    onFocus: function( componentP, eventP, helperP ){

        $A.util.addClass( componentP.find( "load_spinner" ), "slds-show" );             //show to spinner
        $A.util.addClass( componentP.find( "lookup_result" ), "slds-is-open" );
        $A.util.removeClass( componentP.find( "lookup_result" ), "slds-is-close" );

        //check if user input is not empty
        if( !( $A.util.isUndefinedOrNull( componentP.get( "v.target_record" ) ) ) && ( componentP.get( "v.target_record" ) !== "" ) )
            helperP.getSuggestions( componentP, componentP.get( "v.target_record" ) );

    },





    /**this function will be called when mouse moves from component
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
    onBlur: function( componentP, eventP, helperP ){

        componentP.set( "v.record_list", null );

        $A.util.addClass( componentP.find( "lookup_result" ), "slds-is-close" );
        $A.util.removeClass( componentP.find( "lookup_result" ), "slds-is-open" );

    },





    /**this function will be called when key is pressed
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
    onKeyUp: function( componentP, eventP, helperP ){

        let user_input = componentP.get( "v.target_record" );

        //check if the input is greater than zero
        if( user_input.length > 0 ){

            let timeout_id = componentP.get( "v.timeout_id" );

            //check if we have a none -1 number --> means we are already waiting
            if( timeout_id !== -1 )
                clearInterval(timeout_id);

            $A.util.addClass( componentP.find( "v.lookup_result" ), "slds-is-open" );
            $A.util.removeClass( componentP.find( "v.lookup_result" ), "slds-is-close" );

            //send request for suggests after a second and a half of waiting
            timeout_id = setTimeout(
                $A.getCallback( function(){

                    helperP.getSuggestions( componentP, user_input );
                    componentP.set( "v.timeout_id", -1 );                       //invalidate the existing handler

                }), 1500 );

            componentP.set( "v.timeout_id", timeout_id );           //store the timout handler

        }
        else{

            $A.util.addClass( componentP.find( "v.lookup_result" ), "slds-is-close" );
            $A.util.removeClass( componentP.find( "v.lookup_result" ), "slds-is-open" );

        }

    },





    /**this function will be called when a record is selected
     * @param componentP is the component we are updating
     * @para eventP is the event we are processing
     * @param helperP is the helper object
     */
    onRecordSelect: function( componentP, eventP, helperP ){

        componentP.set( "v.selected_record", componentP.get( "v.record_list" )[ eventP.currentTarget.id ] );

        //update the styling for the lookup pill
        $A.util.addClass( componentP.find( "lookup_pill" ), "slds-show" );
        $A.util.removeClass( componentP.find( "lookup_pill" ), "slds-hide" );

        //update styling for search result
        $A.util.addClass( componentP.find( "search_results" ), "slds-is-closed" );
        $A.util.removeClass( componentP.find( "search_results" ), "slds-is-open" );

        //update styling for lookup field
        $A.util.addClass( componentP.find( "lookup_field" ), "slds-hide" );
        $A.util.removeClass( componentP.find( "lookup_field" ), "slds-show" );

        componentP.set( "v.record_list", null );

        $A.util.addClass( componentP.find( "lookup_result" ), "slds-is-close" );
        $A.util.removeClass( componentP.find( "lookup_result" ), "slds-is-open" );

    },





    /**This function will be called when new client is selected
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
    onNewClientClick: function( componentP, eventP, helperP ){

        componentP.set( "v.input_value", componentP.get( "v.target_record" ) );
        componentP.set( "v.new_client", true );

    },





    /** this function will clear selected list
     *  @param componentP is the component we are updating
     *  @param eventP is the event we are processing
     *  @param helperP is the helper object
     */
    clear: function( componentP, eventP, helperP ){

        componentP.getEvent( "lookup_field_cleared" ).fire();
        helperP.clearCSS( componentP );

    },





    /**this function will be called when component method is called
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     */
    doPopulateRecord: function( componentP, eventP ){

        componentP.set( "v.selected_record", eventP.getParam( "arguments" ).selected_record );

        //update the styling for the lookup pill
        $A.util.addClass( componentP.find( "lookup_pill" ), "slds-show" );
        $A.util.removeClass( componentP.find( "lookup_pill" ), "slds-hide" );

        //update styling for lookup field
        $A.util.addClass( componentP.find( "lookup_field" ), "slds-hide" );
        $A.util.removeClass( componentP.find( "lookup_field" ), "slds-show" );

        componentP.set( "v.record_list", null );

    },





    /**this function will be called when the component method is called
     * @param componentP is the component we are updating
     * @param eventP is the event we are processing
     * @param helperP is the helper object
     */
    doClearRecord: function( componentP, eventP, helperP ){

        helperP.clearCSS( componentP );

    }

});