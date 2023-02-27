/**
 * Created by Chibuye Kunda on 2019/04/29.
 * US-3812: Quick Links Page enhancement
 */
({

    /** this function will be called on component initialisation
     *  @param componentP is the component we are updating
     *  @param eventP is the event we are processing
     *  @param helperP is the helper object
     */
    doInit: function( componentP, eventP, helperP ){

        let action = componentP.get( "c.getQuickLinksMap" );              //this will hold our action

        //check if we are rendering tiles
        if( componentP.get( "v.show_as_tiles" ) ){

            //set the parameters
            action.setParams({
                "componentContextP":componentP.get( "v.link_context" ),
                "columnsP":"",
                "isTileP":"true"
            });

        }
        else{

            //set the parameter
            action.setParams({
                "componentContextP":componentP.get( "v.link_context" ),
                "columnsP":componentP.get( "v.column_id" ),
                "isTileP":"false"
            });

        }//end of if-else block

        //set our callback
        action.setCallback( this, function( response ){

            //check if we have success response
            if( response.getState() === "SUCCESS" ){

                let server_response = response.getReturnValue();            //get the return value

                //check if we must show as tiles
                if( componentP.get( "v.show_as_tiles" ) )
                    helperP.generateQuickLinkTiles( componentP, server_response.quicklinkMap );
                else
                    helperP.generateHomepageQuickLinks( componentP, server_response.quicklinkMap );

            }//end of if-block

        });//end of callback definition


        helperP.showDashboardHeading( componentP );                 //determine if the dashbaord column heading should be show
        $A.enqueueAction( action );

    }//end of function definition

});