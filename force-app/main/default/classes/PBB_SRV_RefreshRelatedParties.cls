public with sharing class PBB_SRV_RefreshRelatedParties {
	private static final PBB_SRV_GatewayAPI_RelatedParties.IService RELATED_PARTIES_SERVICE = PBB_SRV_GatewayAPI_RelatedParties.newInstance();
	private static final SRV_Logger LOGGER = (SRV_Logger) SRV_Logger.newInstance();

	@AuraEnabled
	public static void upsertRelatedParties(Id clientId) {
		Account[] records = SEL_Accounts.newInstance().selectGuidById(new Set<Id> { clientId });
		PBB_SRV_GatewayAPI_RelatedParties.Response resp = RELATED_PARTIES_SERVICE.getRelatedParties(clientId);
		if (
		    resp == null || resp.relationshipInformation == null
		    || resp.relationshipInformation.relationship == null
		    || resp.relationshipInformation.relationship.isEmpty()
		) { return; }
		Map<String, Individual> individuals = new Map<String, Individual> ();
		Map<String, Contact> contacts = new Map<String, Contact> ();
		for (PBB_SRV_GatewayAPI_RelatedParties.Relationship singleParty : resp.relationshipInformation.relationship) {
			if (singleParty.RelatedCustomerClassification != PBB_SRV_GatewayAPI_RelatedParties.RelatedCustomerClassification.INDIVIDUAL) { continue; }
			Individual individualRecord;
			if (!contacts.containsKey(singleParty.relatedCustomerGuid)) {
				individualRecord = new Individual(
				                                  Guid__c = singleParty.relatedCustomerGuid,
				                                  FirstName = singleParty.firstName,
				                                  LastName = singleParty.lastName
				);
				individuals.put(singleParty.relatedCustomerGuid, individualRecord);
			}
			String contactExtId = String.format('{0}-{1}', new List<String> { records[0].GUID__c, singleParty.relatedCustomerGuid });
			Contact contactRecord;
			if (!contacts.containsKey(contactExtId)) {
				contactRecord = new Contact(
				                            PBB_External_ID__c = contactExtId,
				                            FirstName = singleParty.firstName,
				                            LastName = singleParty.lastName,
				                            AccountId = clientId,
				                            Group_Parent_CIF_Number__c = records[0].GUID__c,
				                            Individual = new Individual(
				                                                        Guid__c = singleParty.relatedCustomerGuid
				)
				);
				contacts.put(contactExtId, contactRecord);
			} else {
				contactRecord = contacts.get(contactExtId);
			}
			contactRecord.Email = singleParty.email;
			contactRecord.Phone = singleParty.telephone;
			contactRecord.MobilePhone = singleParty.mobile;
			if (String.isBlank(contactRecord.Title)) {
				contactRecord.Title = UTL_String.capitalizeWords(singleParty.relationshipType);
			} else if (!contactRecord.Title.containsIgnoreCase(singleParty.relationshipType)) {
				contactRecord.Title += ', ' + UTL_String.capitalizeWords(singleParty.relationshipType);
			}
		}

		LOGGER.log(Database.upsert(individuals.values(), Individual.Guid__c, false), PBB_SRV_RefreshRelatedParties.class.getName(), DMN_Log.AREA_PBB_GATEWAY);
		LOGGER.log(Database.upsert(contacts.values(), Contact.PBB_External_ID__c, false), PBB_SRV_RefreshRelatedParties.class.getName(), DMN_Log.AREA_PBB_GATEWAY);
	}
}