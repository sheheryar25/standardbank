/**
 * Created by Chibuye Kunda on 2019/04/29.
 * US-3812: Quick Links Page enhancement
 */
({


    /** this is the function that will show dashboard heading
     * @param componentP this is the component we are updating
     */
    showDashboardHeading: function( componentP ){

        let action = componentP.get( "c.shouldShowDashboard" );                 //get the action

        //set our call back function
        action.setCallback( this, function( response ){

            //check if we have success response
            if( response.getState() === "SUCCESS" )
                componentP.set( "v.show_dashboard", response.getReturnValue() );                //get the return value

        });

        $A.enqueueAction( action );             //execute action

    },//end of function definition





    /** this function will generate quicklinks for homepage
     *  @param componentP is the component we are updating
     *  @param response_map this is the response map we are using
     */
    generateHomepageQuickLinks: function( componentP, response_mapP ){

        //set the attributes
        componentP.set( "v.links_list_column1", response_mapP[ "1" ] );
        componentP.set( "v.links_list_column2", response_mapP[ "2" ] );

    },//end of function definition




    /** this function will generate quicklinks
     * @param componentP is the component we are updating
     * @param response_mapP this is the response map that is returned by server
     */
    generateQuickLinkTiles: function( componentP, response_mapP ){

        //set the attributes
        componentP.set( "v.links_list_column1", response_mapP[ "1" ] );
        componentP.set( "v.links_list_column2", response_mapP[ "2" ] );
        componentP.set( "v.links_list_column3", response_mapP[ "3" ] );

    },//end of function definition

});