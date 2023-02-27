/**
 * Created by joracki on 18.09.2018.
 */
({


    /** this function will run when page is initialised
     *  @param component
     *  @param event
     *  @param helper
     */
    doInit : function( component, event, helper ){

        var check_user_action = component.get( "c.isUserCIB" );         //we want to check the user profile

        //define callback function
        check_user_action.setCallback( this, function( response ){

            //check the state returned from the server
            if( response.getState() === "SUCCESS" ){

                var server_response = response.getReturnValue();                //get the return value

                //check if we have an error
                if( server_response.is_error ){

                    helper.showToastMessage( "error", "Error", server_response.result_message );            //get the result message
                    return;                 //exit function

                }//end of if-block

                component.set( "v.user_is_cib", server_response.result_message );               //set attribute

            }
            //check if we have errors
            else if( response.getState() === "ERROR" )
                helper.processServerErrors(response.getError());               //get the returned server errors

        });//end of function definition

        $A.enqueueAction( check_user_action );                  //execute the action

    },//end of function definition





    /** this function will be called when the save and proceed button is pushed
     * @param component
     * @param event
     * @param helper
     */
    saveAndProceed : function( component, event, helper ){

        var record_data_component = component.get("v.recordDataComponent");       //get our injected component
        if(record_data_component.get( "v.simpleRecord.Primary_Relationship_Holder__c" )!='Commercial Banking'){
            helper.showToastMessage( "error", "Error", 'Insufficient access,the client is not owned by commercial banking.' );
            return;                 //exit function
        }

        //check if we have record data component
        if( record_data_component ){

            var save_action = record_data_component.get("c.saveAction");		//get the save action
            var empty_fields_string;                                        //this will hold empty field array

  			//set our call back function
            save_action.setCallback(this, function( response ){

                //check if we have success
                if( response.getState() === "SUCCESS" ){

                    //check if we are at develop prospect stage
                    if( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Develop Prospect" ){

                        //check if the user requires approval
                        if( component.get( "v.need_approval" ) )
                            helper.submitRecordForApproval( component );              //send the record for approval

                        helper.createNewClientTeam( component, record_data_component );     //create a new client team

                    }//end of if-block

                }
                //check if we have a server error
                else if( response.getState() === "ERROR" )
                    helper.processServerErrors(response.getError());               //get the returned server errors

            });//end of callback definition

            empty_fields_string = helper.checkFieldsValid( component );             //check fields

            //check if we have any empty fields
            if( empty_fields_string !== "" ){

                helper.showToastMessage( "error", "Please fill in the Following Fields:", empty_fields_string );
                return;         //terminate the function

            }//end of if-block

            //check if we are in the create prospect stage
            if( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Create Prospect" )
                helper.populateKYCLocation( component );            //auto-populate the KYC team location

            //check if user doesnt needed to submit for approval and status is not rejected or needs approval again
            if( !helper.needApproval( component ) )
                record_data_component.set( "v.simpleRecord.Update_Path__c", true );     //we want our process builder to run

            //check if isic code attribute is not empty
            if( component.get( "v.isic_code" ) !== "" )
                record_data_component.set( "v.simpleRecord.Industry_Code__c", component.get( "v.isic_code" ) );

            console.log( "ISIC Before Save: " + component.get( "v.isic_code" ) );

            //check if we have valid save action
            if( save_action )
            	$A.enqueueAction( save_action );		//execute the action

        }//end of if-block

    },//end of function definition





    /** this will trigger when we enter edit mode
     * @param component
     * @param event
     * @param helper
     */
    handleComponentAction : function(component, event, helper) {

        //check if we have valid conditions from action
        if( component && event.getParam('data') && event.getParam('data').name ){

            var action_name = event.getParam('data').name;          //get the name of the action
            var record_data_component = component.get( "v.recordDataComponent" );           //get the record dta component

            //check if we have an edit event
            if( action_name === "edit" ) {

                //check if we on develop prospect stage
                if( ( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Develop Prospect" ) &&
                    ( ( record_data_component.get( "v.simpleRecord.Status__c" ) === "Rejected" ) || ( record_data_component.get( "v.simpleRecord.Status__c" ) === "Need Approval Again" ) ) ){

                    console.log( "We in approval check again" );

                    var need_approval_action = component.get("c.shouldBeApproved");
                    need_approval_action.setParams({cc_user_idP: record_data_component.get("v.simpleRecord.Client_Co_ordinator__c")});      //set the cc user address

                    //setup the callback function
                    need_approval_action.setCallback( this, function( response ){

                        //check if we have success
                        if( response.getState() === "SUCCESS" ){

                            var server_response = response.getReturnValue();                //get the return value

                            //check if we have error
                            if( server_response.is_error ){

                                helper.showToastMessage( "error", "Error", server_response.result_message );        //show error toast message
                                return;                         //exit function

                            }//end of if-block

                            console.log( "Shoud be approved result: " + server_response.result_message );

                            //check if we will be sending record for approval
                            if( server_response.result_message === "true" )
                                component.set("v.need_approval", server_response.result_message);             //set the response

                        }//end of if-block

                    });//end of callback definition

                    $A.enqueueAction( need_approval_action );
                    component.set("v.label", "Submit for Approval");

                }
                //check if we on submit for on-boarding
                else if( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Submit for On-Boarding" ){

                    console.log( "In submit for on-boarding" );

                    component.set( "v.show_submit", true );						//we want to see submit for onbaording function
                    component.set( "v.show_proceed", false );					//hide proceed button

                    helper.isGoldtier( component, record_data_component );				//check if we have GT bound record

                }//end of if-block

            }
            //check if we have save action
            else if( action_name === "save" )
                //check if we on submit for on-boarding and we have a record type
                if( ( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Submit for On-Boarding" ) &&
                    ( component.get( "v.record_type_name" ) !== "NA" ) )
                    helper.changeAccountRecordType( component );                //change the record type

        }//end of if-block

    },//end of function definition





    /** this function will handle change when PCC field changes
     */
    handleFieldChange : function( component, event, helper ){

        var record_data_component = component.get( "v.recordDataComponent" );           //get the record dta component
        var field_name = event.getParam( "fieldName" );                 //get the field name
        var field_value = event.getParam( "fieldValue" );               //get the field value

        //check if we have change in  industry code
        if( ( field_name === "Industry_Code__c" ) && !( $A.util.isUndefinedOrNull( field_value ) ) ){

            component.set( "v.isic_code", event.getParam( "fieldValue" ) );
            console.log( "ISIC Code In Proceed: " + event.getParam( "fieldValue" ) );

        }//end of function definition


        //check if we have  CIB user
        if( component.get( "v.user_is_cib" ) ){

            var current_field;

            //check if we should change the field label
            if( (record_data_component.get("v.simpleRecord.Path_Steps__c") === "Develop Prospect") ) {

                var field_name = event.getParam( "fieldName" );                 //get the field name
                var need_approval_action = component.get("c.shouldBeApproved");                       //this is our approval action

                //check if we dont have PCC field change
                if( field_name !== "Client_Co_ordinator__c" )
                    return;                 //no further action needed

                current_field = record_data_component.get("v.simpleRecord.Client_Co_ordinator__c" );

                //check if we have null or undifined
                if( $A.util.isUndefinedOrNull( current_field ) )
                    return;

                need_approval_action.setParams({cc_user_idP: record_data_component.get("v.simpleRecord.Client_Co_ordinator__c")});      //set the cc user address

                //setup the callback function
                need_approval_action.setCallback( this, function( response ){

                    //check if we have success
                    if( response.getState() === "SUCCESS" ){

                        var server_response = response.getReturnValue();                //get the return value

                        //check if we have error
                        if( server_response.is_error ){

                            helper.showToastMessage( "error", "Error", server_response.result_message );        //show error toast message
                            return;                         //exit function

                        }//end of if-block

                        console.log( "Shoud be approved result: " + server_response.result_message );

                        //check if we will be sending record for approval
                        if( server_response.result_message === "true" ) {

                            component.set("v.label", "Submit for Approval");
                            component.set("v.need_approval", server_response.result_message);             //set the response

                        }//end of if-block

                    }//end of if-block

                });//end of callback definition

                $A.enqueueAction( need_approval_action );           //check if the user needs approval

            }//end of if-block

        }//end of if-block

        //check if we are on Submit for onbaording stage
        if( record_data_component.get( "v.simpleRecord.Path_Steps__c" ) === "Submit for On-Boarding" ) {

            //check if we have change on relationship roles
            if( ( field_name === "Relationship_Roles__c" ) && !( $A.util.isUndefinedOrNull( field_value ) ) ){

                var type_name = "Potential_CIF";                   //this will indicate that we have a gt record

                //check if we have a goldtier record
                if( (  field_value.includes( "Client" ) || field_value.includes( "Corresponding Bank" ) || field_value.includes( "Managed Fund" ) ) &&
                    !( field_value.includes(  "Potential" ) ) )
                    type_name = "Potential_Goldtier";                            //indicate we have a gold tier record
                //check if have a blank value
                else if( field_value === "" )
                    type_name = "NA";

                component.set( "v.record_type_name", type_name );                        //set the record type name

            }//end of if-block

            component.set("v.saved_before_onboard", false);           //fields have changed at this stage
        }

    },//end of function definition





    /** this function will submit record for onboarding
     *  @param component is the component we are referencing
     *  @param event
     *  @param helper
     */
    onboardRecord : function( component, event, helper ){

        var record_data_component = component.get("v.recordDataComponent");       //get our injected component
        var onboard_action = component.get( "c.submitForOnboarding" );				//get onbaord action
		var empty_fields_string = helper.checkFieldsValid( component );             //check fields

        console.log( "Saved before Onbaord: " + component.get( "v.saved_before_onboard" ) );

        //check if we have any empty fields
        if( empty_fields_string !== "" ){

        	helper.showToastMessage( "error", "Please Fill in the Following Fields:", empty_fields_string );
            return;         //terminate the function

     	}//end of if-block

        //check if record has been committed to the database
        if( !component.get( "v.saved_before_onboard" ) ) {

            helper.showToastMessage("info", "Save Record", "Please save record before submitting for Onboarding");
            return;

        }//end of if-block

        //check if isic code attribute was set
        if( component.get( "v.isic_code" ) !== "" )
            component.set( "v.simpleRecord.Industry_Code__c", component.get( "v.isic_code" ) );

        component.set( "v.onboard_record", record_data_component.get( "v.simpleRecord" ) );
        
        //setup action
        onboard_action.setParams({recordP:record_data_component.get( "v.simpleRecord" )} );		//set params
        onboard_action.setCallback( this, function( response ){

            var state = response.getState();				//get the response state

            //check if we have success
            if( state === "SUCCESS" ){

                component.set( "v.is_loading", false );              //display spinnner
                var server_response = response.getReturnValue();						//get the return value

                //check if we have an error
                if( server_response.is_error ){

                    helper.showToastMessage( "error", "Error has Occured:", server_response.result_message );
                    return;					//terminate the function

                }//end of if-block

                record_data_component = component.get("v.recordDataComponent");       //get our injected component
               	
                var save_action = record_data_component.get("c.saveAction");		//get the save action

                console.log( "Status: " + record_data_component.get( "v.simpleRecord.Status__c" ) );

                record_data_component.set( "v.simpleRecord.Status__c", "Submitted for Onboarding" );      //set as submitted for approval
               	record_data_component.set( "v.simpleRecord.Update_Path__c", true );     //we want our process builder to run

                console.log( "Status: " + record_data_component.get( "v.simpleRecord.Status__c" ) );

            	//check if we have valid save action
            	if( save_action )
            		$A.enqueueAction( save_action );		//execute the action

            }
            else {

                helper.processServerErrors(response.getError());               //get the returned server errors
                component.set("v.is_loading", false);

            }

        });

        component.set( "v.is_loading", true );              //display spinnner
        $A.enqueueAction( onboard_action );				//execute the record type

    },//end of function definition

});