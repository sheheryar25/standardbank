({
	showToast : function(title, message) {
		var showToast = $A.get("e.force:showToast");
		if (showToast) {
			showToast.setParams({
				title: title,
				message: message,
				type: "error",
				mode: "sticky"
			});
			showToast.fire();
		}
	},

	validateRecord : function(component, helper) {
		var recordId = component.get("v.recordId");
		var record = component.get("v.record");
		var contacts = component.get("v.contacts");
		var currentUserId = component.get("v.currentUserId");
		var fieldErrors = [];
		var contactError = true;

        var faisMappingNeeded = record.Primary_Relationship_Holder__c == "Corporate and Investment Banking" &&
                            record.Relationship_Roles__c == "Client" && record.KYC_Location__c.startsWith("SBSA") &&
                            (record.Client_Relationship_Hierarchy__c == "Group Parent" ||
							record.Client_Relationship_Hierarchy__c == "Immediate Parent" ||
							record.Client_Relationship_Hierarchy__c == "Child");

		if (record.RecordType.Name === "Potential (Goldtier)") {
			// Fields that needs to be filled: 
			// - Regualtory Code
			// - Registration Number
			// - Registered Address
			// - Proposed Client Coordinator
			// - Client Relationship Hierarchy
			// - Client Sector
			// - Client Sub Sector
			// - Client Type
			// - Business Classification
			// - Relevant Regulator or Approved Regulated
			// - Professional or Non Professional Client
			// - Source of Wealth
			// - Expected Income
			// - Source of Funds
			// - Nature of Relationship
			// - Business/Relationship Inconsistent
			// - ServicesProducts Expected or currently
			// - Anticipated Level Volume of Activity
			// - Nature of Business Activity
			// - Relationship Roles
			// - KYC Contact
			// - Source of Funds Type
			// - High Risk Business
            if (!record.Regulatory_Code__c && record.KYC_Location__c.toLowerCase().indexOf("none") < 0) {
				fieldErrors.push("Regulatory Code");
			}
			if(component.get("v.isCIB") == false) {
			     if (!record.Registration_Number__c) {
                    fieldErrors.push("Registration Number");
                 }
            }

			if (!record.BillingStreet) {
				fieldErrors.push("Registered Address");
			}
			if (!record.Client_Co_ordinator__c) {
				fieldErrors.push("Proposed Client Coordinator");
			}
			if (!record.Client_Relationship_Hierarchy__c) {
				fieldErrors.push("Client Relationship Hierarchy");
			}
			if (!record.Client_Sector__c) {
				fieldErrors.push("Client Sector");
			}
			if (!record.Client_Sub_Sector__c) {
				fieldErrors.push("Client Sub-Sector");
			}
            if (!record.Client_Type_OnBoard__c) {
				fieldErrors.push("Client Type");
			}
             if (!record.Business_Classification__c) {
				fieldErrors.push("Business Classification");
			}  
			if (!record.Relevant_Regulator_or_Approved_Regulated__c) {
				fieldErrors.push("Relevant Regulator of Approved Regulated");
			}
			if (!record.Professional_or_Non_Professional_Client__c && faisMappingNeeded) {
				fieldErrors.push("Professional or Non Professional Client");
			}
			if (!record.Source_of_Wealth__c) {
				fieldErrors.push("Source of Wealth");
			}
			if (!record.Expected_Income__c && record.KYC_Location__c.startsWith("SBSA")) {
				fieldErrors.push("Expected Income");
			}
			if (!record.Source_of_Funds__c) {
				fieldErrors.push("Source of Funds");
			}
			if (!record.Nature_of_Relationship__c) {
				fieldErrors.push("Nature of Relationship");
			}
            if (!record.Business_Relationship_Inconsistent__c) {
				fieldErrors.push("Business/Relationship Inconsistent");
			}
			if (!record.Services_Products_Expected_or_currently__c) {
				fieldErrors.push("Services/Products Expected or currently");
			}
			if (!record.Anticipated_Level_Volume_of_Activity__c) {
				fieldErrors.push("Anticipated Level / Volume of Activity")
			}
			if (!record.Nature_of_business_activity__c ) {
				fieldErrors.push("Nature Of Business Activity");
			}
            if (!record.Relationship_Roles__c) {
				fieldErrors.push("Relationship Roles");
			}
            if (!record.Client_contacted_in_person__c) {
                fieldErrors.push("Met Client in Person");
            }
            if (!record.Entity_Actively_Trade__c) {
                fieldErrors.push("Does Entity Actively Trade");
            }
            if (!record.Source_of_Funds_Type__c) {
                fieldErrors.push("Source of Funds Type");
            }
            if (!record.High_Risk_Business__c) {
                fieldErrors.push("High Risk Business");
            }
            //check if we have commB
            if(component.get("v.isCommB") == true){
                if (!record.BEE_Code__c) {
                   fieldErrors.push("BEE Code");
                }
                if (!record.BEE_Level__c) {
                    fieldErrors.push("BEE Level");
                 }
                if( !record.High_Risk_Business__c ){
                    fieldErrors.push("High Risk Business");
                }
            }
            if(component.get("v.isCommB") == false){ 
                if (!record.Business_Support_and_Recovery__c) {
                    fieldErrors.push("Business Support and Recovery");
                }
                if (!record.Country_of_Revenue__c) {
                    fieldErrors.push("Country of Revenue");
                }
              
            }
		}
		else if (record.RecordType.Name === 'Potential (CIF)') {
			// Feilds that needs to be filled:
			// - Percentage Holding
			// - Registration Number
			// - Registered Address
			// - SWIFT Code
			// - Regulatory Code
			// - Client Sector
			// - Client Sub Sector
			// - Proposed Client Coordinator
			// - KYC Complete
			// - Relationship Roles
			// - KYC Contact
			if(component.get("v.isCIB") == false){
			    if (!record.Registration_Number__c) {
                	fieldErrors.push("Registration Number");
                }
                if (!record.SWIFT_Code__c) {
                	fieldErrors.push("SWIFT Code");
                }
            }
			if (!record.Percentage_Holding_Onboarding__c) {
				fieldErrors.push("Percentage Holding");
			}
			if (!record.BillingStreet) {
				fieldErrors.push("Regitered Address");
			}
			if (!record.Regulatory_Code__c && record.KYC_Location__c.toLowerCase().indexOf("none") < 0) {
				fieldErrors.push("Regulatory Code");
			}
			if (!record.Client_Sector__c) {
				fieldErrors.push("Client Sector");
			}
			if (!record.Client_Sub_Sector__c) {
				fieldErrors.push("Client Sub-Sector");
			}
			if (!record.Client_Co_ordinator__c) {
				fieldErrors.push("Proposed Client Coordinator");
			}
			if (!record.KYC_Complete__c) {
				fieldErrors.push("KYC Complete");
			}
            if (!record.Relationship_Roles__c) {
				fieldErrors.push("Relationship Roles");
			}
		}

		var approvalNeeded = record.Client_Co_ordinator__c !== currentUserId && record.Status__c !== "Approved";
        var AumOrNavNeeded = faisMappingNeeded && record.Professional_or_Non_Professional_Client__c == "Professional" && !record.NAV__c && !record.AUM__c;
        var errorMessage = "";

        if (contacts.length === 0 && !record.KYC_Contact__c) {
            errorMessage += "\n* There must be at least one Contact linked to this Client. Either select an existing KYC Contact, or create a new Contact on this Client.";
        }

        if (fieldErrors.length > 0) {
            errorMessage += "\n\n* Please complete following fields: \n";
            fieldErrors.forEach(item => {errorMessage += "      " + item + "\n"});
         }

        if (approvalNeeded) {
            errorMessage += "\n* Account must be approved by Proposed Client Coordinator.\n";
        }

        if (AumOrNavNeeded) {
            errorMessage += "\n* As this is a Professional Client (Merchant Bank Exempted) please provide either Net Asset Value (NAV) or Assets Under Management (AUM) information.\n";
        }

		if (errorMessage){
			helper.showToast(
				"Cannot Submit for Onboarding", 
				errorMessage
			);
			$A.get("e.force:closeQuickAction").fire();
		}
		else if (faisMappingNeeded){
		    helper.populateFaisAndProceed(component, helper, record);
		} else {
		    helper.proceed(component);
        }
	},

	populateFaisAndProceed : function(component, helper, record) {

        var updateFais = component.get("c.populateFaisField");
        var newFais = record.Professional_or_Non_Professional_Client__c == "Professional" ? "Merchant Bank Exempted" : "FAIS Impacted";
        updateFais.setParams({
            recordId : component.get("v.recordId"),
            faisValue : newFais
        });

        updateFais.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                var message  =  response.getReturnValue();
                if (message != "SUCCESS") {
                    console.log("ERROR Submit for Onboarindg: " + message);
                    helper.showToast("Error Submitting for Onboarding", "Please contact your administrator");
                    $A.get("e.force:closeQuickAction").fire();
                } else {
                    helper.proceed(component);
                }
            }
            else if(state === "ERROR") {
                console.log("ERROR Submit for Onboarindg: " + response.getError());
                helper.showToast("Error Submitting for Onboarding", "Please contact your administrator");
                $A.get("e.force:closeQuickAction").fire();
            }
        });
        $A.enqueueAction(updateFais);
    },

    proceed : function(component) {
        var event = $A.get("e.force:navigateToURL");
        event.setParams({
            url: '/apex/Send_for_Onboarding?id=' + component.get("v.recordId")
        });
        event.fire();
    }
})