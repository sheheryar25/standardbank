/**
* This mock class for PbbSmart2ConversionalDel
*
* @author   Unknown
* @date	    April 2021
*/
public without sharing class PBB_Smart2Refresher {
    private static final PBB_SRV_GatewayApi_Conversations.IService CONVERSATION_SERVICE = PBB_SRV_GatewayApi_Conversations.newInstance();
    private static final SRV_Logger LOGGER = (SRV_Logger) SRV_Logger.newInstance();
    private enum Status { DATA_UP_TO_DATE, DATA_FOUND, NO_DATA }

    /**
    * This method is to update Conversation
    * @return   status 
    **/
    @AuraEnabled
    public static String fetchConversationsAndUpdateRecords() {
        try {
            Id userId = UserInfo.getUserId();
            PBB_SRV_GatewayApi_Conversations.Response conversationsResponse = CONVERSATION_SERVICE.getPortfolioConversations(userId);
            List<Conversation__c> conversationsForUpsert = new List<Conversation__c>();
            Set<String> clientBPIDs = new Set<String>();
            if(conversationsResponse != null && conversationsResponse.clientPortfolioConversationList != null) {
                for (PBB_SRV_GatewayApi_Conversations.ClientPortfolioConversationList conversationRecord : conversationsResponse.clientPortfolioConversationList) {
                    clientBPIDs.add(bpidIntegerToValidString(conversationRecord.newCustN));
                }
            }
            for(Account acc : [SELECT Id, BPID__c FROM Account WHERE BPID__c IN :clientBPIDs]) {
                for(PBB_SRV_GatewayApi_Conversations.ClientPortfolioConversationList conversationRecord : conversationsResponse.clientPortfolioConversationList) {
                    if(bpidIntegerToValidString(conversationRecord.newCustN) == acc.BPID__c) {
                        Conversation__c conversation = new Conversation__c(
                                OwnerId = userId
                        );
                        conversation.ExternalId__c = (conversationRecord.conversationId != null ? conversationRecord.conversationId : '');
                        conversation.ExternalIdLeadKey__c = (conversationRecord.leadKey != null ? conversationRecord.leadKey : '');
                        conversation.Subcategory__c = (conversationRecord.subCategory != null ? conversationRecord.subCategory : '');
                        conversation.Category__c = (conversationRecord.category != null ? conversationRecord.category : '');
                        conversation.Name = conversation.Category__c + ' - ' + conversation.Subcategory__c;
                        conversation.Description__c = (conversationRecord.detail != null ? conversationRecord.detail : '');
                        conversation.Comments__c = (conversationRecord.additionalInformation != null ? conversationRecord.additionalInformation : '');
                        conversation.Reason__c = (conversationRecord.reason != null ? conversationRecord.reason : '');
                        conversation.Response__c = (conversationRecord.response != null ? conversationRecord.response : '');
                        conversation.Client__c = acc.Id;
                        conversation.IsActive__c = true;
                        if (conversationRecord.expectedRevenue != null) {
                            conversation.Expected_OI__c = conversationRecord.expectedRevenue;
                        }
                        if (conversationRecord.futureContactDate != null) {
                            conversation.Future_Contact_Date__c = Datetime.newInstance(Long.valueOf(conversationRecord.futureContactDate));
                        }
                        conversationsForUpsert.add(conversation);
                    }
                }
            }
            if(conversationsForUpsert.isEmpty()){
                return Status.NO_DATA.name();
            }
            List<Database.UpsertResult> upsertResults = Database.upsert(conversationsForUpsert, Conversation__c.ExternalId__c, false);
            Set<Id> upsertConversationIds = new Set<Id>();
            for(Database.UpsertResult upsertResult : upsertResults) {
                upsertConversationIds.add(upsertResult.getId());
            }
            upsert(PBB_Lifestyle_Smart2Cleaner.cleanByUser(userId, upsertConversationIds));

            Status returnStatus = Status.DATA_UP_TO_DATE;
            for(Database.UpsertResult upsertResult : upsertResults) {
                if(upsertResult.isSuccess() && upsertResult.isCreated()) {
                    returnStatus = Status.DATA_FOUND;
                    break;
                }
            }
            return returnStatus.name();
        } catch (Exception e) {
            LOGGER.log(e, PBB_Smart2Refresher.class.getName(),DMN_Log.AREA_PBB_GATEWAY);
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static String bpidIntegerToValidString(Integer bpidBeforeFormat) {
        String bpidAfterFormat = String.valueOf(bpidBeforeFormat);
        while(bpidAfterFormat.length() < 10) {
            bpidAfterFormat = '0' + bpidAfterFormat;
        }
        return bpidAfterFormat;
    }
}