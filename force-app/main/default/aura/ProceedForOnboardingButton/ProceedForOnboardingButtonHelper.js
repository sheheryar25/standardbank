({

    /** this function will evaluate that fields are filled in at given stage
     * @param component is the component we are checking for validity
     * @return will return true on success
     */
    checkFieldsValid : function( component ){

        var recordDataComponent = component.get("v.recordDataComponent");       //get our injected component
        var empty_field_string = "";                //this will hold empty string
        var field_labels_array;                     //this will hold field labels
        var fields_to_validate_array;               //this will hold fields we want to validate
        var current_field = recordDataComponent.get( "v.simpleRecord.Expected_Income__c" );                          //this will hold the current field( get expected income )

        //check if we have blank current field
        if( !( $A.util.isUndefinedOrNull( current_field ) ) && isNaN( current_field ) )
            return "Please input a numerical value in the Expected Income field";                    //return the error message

        //check if we are currently in "Create Prospect"
        if( recordDataComponent.get( "v.simpleRecord.Path_Steps__c" ) === "Create Prospect" ) {

            //set fields we will validate
            fields_to_validate_array = [ "Registered_Suburb__c", "BillingStreet", "Client_Co_ordinator__c",
                                         "Client_Type_OnBoard__c" ];

            //set the field labels
            field_labels_array = [ "Registered Suburb", "Registered Street", "Proposed Client Coordinator", "Client Type" ];

            fields_to_validate_array.push( "Business_Classification__c" );
            field_labels_array.push( "Business Classification" );
            //check if the registration number should be manadatory
            if( ( recordDataComponent.get( "v.simpleRecord.Business_Classification__c" ) !== "Joint Venture" ) &&
                ( recordDataComponent.get( "v.simpleRecord.Business_Classification__c" ) !== "Informal Body" ) &&
                ( recordDataComponent.get( "v.simpleRecord.Business_Classification__c" ) !== "Sole Proprietor" ) &&
                ( recordDataComponent.get( "v.simpleRecord.Business_Classification__c" ) !== "Partnership" ) ) {

                fields_to_validate_array.push("Registration_Number__c");                //add the registration number
                field_labels_array.push("Registration Number");                         //add field label

            }//end of if-block

        }
        //check if we are currently in "Develop Prospect"
        else if( recordDataComponent.get( "v.simpleRecord.Path_Steps__c" ) === "Develop Prospect" ) {

            //set fields we will validate
            fields_to_validate_array = [ "Client_Sector__c", "Client_Sub_Sector__c",
                                         "Client_Relationship_Hierarchy__c", "KYC_Location__c", "KYC_Contact__c",
                                         "Relationship_Roles__c", "Industry_Code__c", "Market_Segments__c" ];

            //set the field labels
            field_labels_array = [ "Client Sector", "Client Sub-Sector", "Client Relationship Hierarchy",
                                   "KYC Location", "KYC Contact", "Relationship Roles", "ISIC Code", "Market Segment" ];

        }
        //check if we are currently in "Submit for On-Boarding"
        else if( recordDataComponent.get( "v.simpleRecord.Path_Steps__c" ) === "Submit for On-Boarding" ) {

            //check if we have GT record
            if( component.get( "v.is_gt_record" ) === "true" ){
            
                //set the fields we will validate
                fields_to_validate_array = [ "Source_of_Funds_Type__c", "Source_of_Funds__c",
                                             "Expected_Income__c", "Client_contacted_in_person__c", "High_Risk_Business__c",
                                             "Entity_Actively_Trade__c", "Relevant_Regulator_or_Approved_Regulated__c",
                                             "Professional_or_Non_Professional_Client__c", "Source_of_Wealth__c", "Nature_of_Relationship__c",
                                             "Services_Products_Expected_or_currently__c", "Anticipated_Level_Volume_of_Activity__c",
                                             "Nature_of_business_activity__c", "Business_Classification__c" ];
    
                //set the field labels
                field_labels_array = [ "Source of Funds Type", "Source of Funds", "Expected Income", "Met Client in Person", "High Risk Business",
                                       "Does Entity Actively Trade", "Relevant Regulator or Approved Regulator",
                                       "Professional or Non-Professional Client", "Source of Wealth", "Nature of Relationship",
                                       "Services/Products Expected or Currently", "Anticipated Level/Volume of Activity",
                                       "Nature Of Business Activity", "Business Classification" ];
                
            }
            else{

                //no field validations when record is not GT record ---> create empty arrays
                fields_to_validate_array = [];
                field_labels_array = [];
                
            }//end of if-else block



            //setup validations for the Billing info
            fields_to_validate_array.push( "BillingStreet" );
            field_labels_array.push( "Registered Street" );
            fields_to_validate_array.push( "BillingCity" );
            field_labels_array.push( "Registered City" );
            fields_to_validate_array.push( "BillingCountry" );
            field_labels_array.push( "Registered Country" );
            fields_to_validate_array.push( "BillingState" );
            field_labels_array.push( "Registered State/Province" );
            fields_to_validate_array.push( "BillingPostalCode" );
            field_labels_array.push( "Registered Zip/Postal Code" );
            fields_to_validate_array.push( "Registered_Suburb__c" );
            field_labels_array.push( "Registered Suburb" );

        }//end of if-else block

        //loop through and evaluate the fields
        for( var i=0; i<fields_to_validate_array.length; ++i ) {

            current_field = recordDataComponent.get("v.simpleRecord." + fields_to_validate_array[i]);

            //check if we have null or undifined
            if( $A.util.isUndefinedOrNull( current_field ) || current_field.length === 0 ){

                empty_field_string = empty_field_string + field_labels_array[i] + ", ";      //append the field

            }//end of if-block

        }//end of for-block

        //check if we have none empty string
        if( empty_field_string !== "" )
            empty_field_string = empty_field_string.substring( 0, empty_field_string.length - 2 );          //trim the

        return empty_field_string;                        //return true on success

    },//end of function definition





    /** this function will update the client record record type
     *  @param componentP is the component we are updating
     *  @return will return true on success
     */
    changeAccountRecordType : function( componentP ){

        console.log( "changeAccountRecordType" );

        var record_data_component = componentP.get( "v.recordDataComponent" );              //get our record data component
        var record_type_change_action = componentP.get( "c.changeRecordType" );             //get the change record type server function

        //setup our parameters
        record_type_change_action.setParams({
            account_idP:record_data_component.get( "v.recordId" ),
            record_type_nameP:componentP.get( "v.record_type_name" )
        });

        console.log( "Record ID: " + record_data_component.get( "v.recordId" ) );
        console.log( "Record Type Name: " + componentP.get( "v.record_type_name" ) );

        record_type_change_action.setCallback( this, function( response ){

            //check if we have success state
            if( response.getState() === "SUCCESS" ){

                var server_response = response.getReturnValue();                //get the return value from the server

                //check if an error had occured
                if( server_response.is_error ){

                    this.showToastMessage( "error", "Error Has Occured", server_response.result_message );
                    return;

                }//end of if-block

                componentP.set( "v.record_type_name", "NA" );               //clear the record type name
                $A.get( "e.force:refreshView" ).fire();                     //refresh the page

            }
            else
                console.log( "Unknown Failure" );

        });

        $A.enqueueAction( record_type_change_action );

    },//end of function definition




    /** this function will send user record for approval where required
     *  @param component
     *  @return none
     */
    submitRecordForApproval: function( component ){

        console.debug( "In submit for approval" );

        var recordDataComponent = component.get("v.recordDataComponent");       //get our injected component
        var approval_action = component.get( "c.sendForApproval" );             //we want to send the record for approval

        approval_action.setParams( { record_idP:recordDataComponent.get("v.simpleRecord.Id"),
                                     cc_user_idP:recordDataComponent.get("v.simpleRecord.Client_Co_ordinator__c")} );
        approval_action.setCallback( this, function( response ){

            var state = response.getState();				//get the state of operation

            //check if we have success
            if( state === "SUCCESS" ){

                var server_response = response.getReturnValue();		//get returned value

                //check if we have an error
                if( server_response.is_error ){

                    this.showToastMessage( "error", "Error Occurred", server_response.result_message );           //show user m
                    return server_response;             //terminate function

                }//end of if-block

                //check if we have NA
                if( server_response.result_message !== "NA" )
                    this.showToastMessage( "info", "Approval", "Record has Been Submitted for Approval" );          //show the error message

            }
            //check if we have a server error
            else if( state === "ERROR" ) {

               // this.processServerErrors(response.getError());               //get the returned server errors
                return null;            //return null

            }//end of if-else block

        });//end of callback function

        $A.enqueueAction( approval_action );            //execute the action

    },





    /** this function will check if user needs to submit record again
     *  @param component
     */
    needApproval: function( component ){

        var record_data_component = component.get("v.recordDataComponent");       //get our injected component

        //check if user doesnt needed to submit for approval and status is not rejected or needs approval again
        var needs_approval = ( record_data_component.get( "v.simpleRecord.Status__c" ) === "Rejected" ) ||
                             ( record_data_component.get( "v.simpleRecord.Status__c" ) === "Need Approval Again" ) ||
                             ( record_data_component.get( "v.simpleRecord.Status__c" ) === "Prospect" );

        var is_develop_prospect = ( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Develop Prospect" );           //check if we are at develop prospect stage


        return component.get( "v.user_is_cib" ) && component.get( "v.need_approval" ) &&
               needs_approval && is_develop_prospect;            //check if approval is needed

    },//end of function definition





    /** this function will process server errors that are returned
     *  @param errors_listP is the list of errors that are returned
     */
    processServerErrors: function( errors_listP ){

        //check if we have errors in list
        if( errors_listP ){

            let error_string = "";              //this will hold all errors listed

            //loop through the errors list
            for( let i=0; i < errors_listP.length; ++i ) {

                //check that the current error is valid
                if (errors_listP[i] && errors_listP[i].pageErrors)
                    error_string = error_string + "-" + errors_listP[i].pageErrors + "\n";             //append to error string

            }//end of for-block

            //check that the error messages have been added
            if( error_string !== "" ) {

                this.showToastMessage("error", "Server Error", "Following Server Errors Occured:\n" + error_string);      //show errors
                return;

            }//end of if-block

        }//end of if-block

        this.showToastMessage( "Error", "Server Error", "Unknown Server Error has Occured" );   //unknown error occured

    },//end of function definition
    


    
    
    /** this function will check if the record is GT or not
     *  @param componentP is the component we are using
     *  @param record_data_componentP is our injected component
     */
    isGoldtier : function( componentP, record_data_componentP ){

        const is_gt_action = componentP.get("c.isGoldtierRecord");			//get the gt action
        is_gt_action.setParams({recordP:record_data_componentP.get( "v.simpleRecord" )} );		//set function params
        
        //setup our calback function
        is_gt_action.setCallback( this, function( response ){
            
            //check if we have success
            if( response.getState() === "SUCCESS" ){
                
                var server_response = response.getReturnValue();		//get our return value
                
                //check if we have error
                if( server_response.is_error ){
                    
                    this.showToastMessage( "error", "Error Occured", server_response.result_message );		//show our toast message
                    return;				//terminate the function
                    
                }//end of if-block
                
                console.log( "IS GT: " + server_response.result_message );
                componentP.set( "v.is_gt_record", server_response.result_message );			//set the flag

                //check if fields are populated
                if( this.checkFieldsValid( componentP ) === "" )
                    componentP.set( "v.saved_before_onboard", true );

            }
            //check if we have a server error
            else if( response.getState() === "ERROR" ) {

                this.processServerErrors( response.getError() );               //get the returned server errors
                return null;            //return null

            }//end of if-else block
            
        });//end of callback function
        
        $A.enqueueAction( is_gt_action );
		        
    },//end of function of definition





    /** this function will create a new client team
     *  @param componentP is the component
     *  @param record_data_componentP is our injected component
     */
    createNewClientTeam : function( componentP, record_data_componentP ){

        var create_action = componentP.get( "c.createClientTeam" );             //creare client team action
        create_action.setParams({recordP:record_data_componentP.get( "v.simpleRecord" )} );		//set function params

        //this will perform callback
        create_action.setCallback( this, function( response ){

            //check if we have success
            if( response.getState() === "SUCCESS" ){

                var server_response = response.getReturnValue();		//get our return value

                //check if we have error
                if( server_response.is_error ){

                    this.showToastMessage( "error", "Error Occured", server_response.result_message );		//show our toast message
                    return;				//terminate the function

                }//end of if-block

                console.log( "Created Client Team" );

            }
            //check if we have a server error
            else if( response.getState() === "ERROR" )
                this.processServerErrors( response.getError() );               //get the returned server errors

        });//end of function definition

        $A.enqueueAction( create_action );          //execute calllout

    },//end of function definition





    /** this function will auto-populate the KYC location
     *  @param componentP is the component we are updated
     *  @return none
     *  @userStory US-3537
     */
    populateKYCLocation : function( componentP ){

        var record_data_component = componentP.get( "v.recordDataComponent" );      //get the record data component
        record_data_component.set( "v.simpleRecord.KYC_Location__c", componentP.get( "v.default_kyc_location" ) );     //set the KYC location

    },//end of function definition





    /** this function will show toast message
     *  @param typeP is the toast message type
     *  @param titleP is the title of the toast
     *  @param messageP is the message for the toast message
     */
    showToastMessage : function( typeP, titleP, messageP ){

        var toast_event = $A.get( "e.force:showToast" );            //we want to show a toast message

        //setup function parameters
        toast_event.setParams( {
            title : titleP,
            message: messageP,
            duration: "5000",
            key: "info_alt",
            type: typeP,
            mode: "sticky"
        });

        toast_event.fire();        //execute the toast event

    },//end of function definition

});