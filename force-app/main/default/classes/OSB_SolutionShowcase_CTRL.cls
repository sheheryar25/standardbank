/**
* OSB_SolutionShowcase_CTRL class for Subscribed Solution records
*
* @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
* @date October 2020
**/

public without sharing class OSB_SolutionShowcase_CTRL {
    
    /**
* Returns a list of knowledge articles for the available Solutions
*
* @param userId String of user ID
* 
* @return List of Knowledge_kav
**/
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getSolutionShowcase(Id userId) {
        List<Knowledge__kav> articles;
        try {
            Contact con = SEL_Contacts.newInstance().selectByUserId(new Set<Id>{userId})[0];
            Set<Id> exceptionArticleIds = new Set<Id>();
            Set<Id> registeredKnowledgeIds = (new Map<Id,SObject>(getRegisteredApplication(userId))).keySet();
            for(Knowledge_Entitlement_Exception__c entitlementException : SEL_KnowledgeExceptions.newInstance().selectByContactIdWoSharing(new Set<Id>{con.Id})) {
                exceptionArticleIds.add(entitlementException.OSB_Knowledge_Article__c);
            }
            articles = SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdPersonaSolutionWoSharing(
                new Set<String>{DMN_Knowledge.PUBLISH_STATUS_ONLINE},
                new Set<Id>{UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_SOLUTION)},
                new Set<Id>(registeredKnowledgeIds),
                con.OSB_Persona__c,
                con.OSB_Operating_Country__c,
                exceptionArticleIds
            );
        } catch(Exception e) {
            System.debug(e.getMessage());
        }
        return articles;
    }
    
    /**
* Gets a list of solutions that a user is subscribed to
*
* @param userId String of user Id
* 
* @return List<Knowledge__kav> register applications
**/
    @AuraEnabled(Cacheable=false)
    public static List<Knowledge__kav> getRegisteredApplication(String userId) {
        return SEL_KnowledgeArticleVersions.newInstance().selectBySubscribedSolutionForUserWoSharing(
            new Set<Id>{userId}
        );
    }
    
    /**
* Returns a list of knowledge articles based on Search criteria for Solutions
*
* @author Rajesh Yandrathi
* @date March 2021
* @param userId String of user ID
* @param searchKeyword String to Search
* @return List of Knowledge_kav
**/
    @AuraEnabled(Cacheable=true)
    public static List<Knowledge__kav> getSolutionSearchResults(Id userId,String searchKeyword) {
        List<Knowledge__kav> articles;
        Map<String,Object> knowledgeArticlesMap = new Map<String,Object>{};
            try {
                Contact con = SEL_Contacts.newInstance().selectByUserId(new Set<Id>{userId})[0];
                Set<Id> exceptionArticleIds = new Set<Id>();
                String searchString = '*' + searchKeyword + '*';
                List<List<Knowledge__kav>> knowledgeSearch = [Find :searchString IN ALL FIELDS RETURNING  Knowledge__kav(Title,Introduction__c)];
                Knowledge__kav [] knowledgeSearchList = ((List<Knowledge__kav>)knowledgeSearch[0]);
                Set<Id> knowledgeSearchResults = (new Map<Id,SObject>(knowledgeSearchList)).keySet();
                for(Knowledge_Entitlement_Exception__c entitlementException : SEL_KnowledgeExceptions.newInstance().selectByContactIdWoSharing(new Set<Id>{con.Id})) {
                    exceptionArticleIds.add(entitlementException.OSB_Knowledge_Article__c);
                }
                Set<String> publishStatuses = new Set<String>{DMN_Knowledge.PUBLISH_STATUS_ONLINE};
                    Set<Id> recordTypeIds = new Set<Id>{UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_SOLUTION)};
                        knowledgeArticlesMap.put('publishStatuses',publishStatuses);
                knowledgeArticlesMap.put('recordTypeIds',recordTypeIds);
                knowledgeArticlesMap.put('knowledgeIds',knowledgeSearchResults);
                knowledgeArticlesMap.put('persona',con.OSB_Persona__c);
                knowledgeArticlesMap.put('operatingCountries',con.OSB_Operating_Country__c);
                knowledgeArticlesMap.put('exceptionArticleIds',exceptionArticleIds);
                
                articles = SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypewithSearchIDsWoSharing(
                    knowledgeArticlesMap
                );
            } catch(Exception e) {
                e.getMessage();
            }
        return articles;
    }
}