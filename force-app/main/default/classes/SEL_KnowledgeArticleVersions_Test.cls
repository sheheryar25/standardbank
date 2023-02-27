/**
 * Test class for SEL_KnowledgeArticleVersions
 *
 * @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
 * @date july 2021
*/
@IsTest
private class SEL_KnowledgeArticleVersions_Test {
    
    private static final String PUBLISH_STATUS = 'Online';
    private static final String PERSONA = 'Client';
    private static final String OPERATING_COUNTRY = 'South Africa';
    private static final String OBJ_NAME = 'Knowledge__kav';
    private static final String RT_API = 'Community_Content_API_Product';
    private static final String RT_SOLUTION = 'Community_Content_Solution';
    private static final String RT_SUCESSSTORIES = 'Community_Content_Success_Stories';
    
	@IsTest
    static void shouldSelectArticleByPublishStatusAndRecordType() {
        SEL_KnowledgeArticleVersions.newInstance().selectArticleByPublishStatusAndRecordType(new Set<String>(),new Set<Id>(),1);
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('PublishStatus IN :publishStatuses AND RecordTypeId IN :recordTypesIds'));
    }
    
    @IsTest
    static void shouldSearchArticles() {
        string pubStatus = '';
        string searchKey = '';
        string artType = '';
        SEL_KnowledgeArticleVersions.newInstance().searchArticles(pubStatus, new list<String>(), searchKey, artType);
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('PublishStatus =:publishStatus'));
    }
    
    @IsTest
    static void shouldselectByPublishStatusAndRecordTypewithSearchIDsWoSharing() {
        Set<String> publishStatuses = new Set<String>{PUBLISH_STATUS};
        Set<Id> recordTypeIds = new Set<Id>{UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_API)};
        Set<Id> knowledgeIds = new Set<Id>{UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_SOLUTION)};
        Set<Id> exceptionArticleIds = new Set<Id>{UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_SUCESSSTORIES)};    
        Map <String,object> knowledgeArticlesMap = new Map <String,object>();
        knowledgeArticlesMap.put('publishStatuses',publishStatuses);
        knowledgeArticlesMap.put('recordTypeIds',recordTypeIds);
        knowledgeArticlesMap.put('knowledgeIds',knowledgeIds);
        knowledgeArticlesMap.put('persona',PERSONA);
        knowledgeArticlesMap.put('operatingCountries',OPERATING_COUNTRY);
        knowledgeArticlesMap.put('exceptionArticleIds',exceptionArticleIds);
        
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypewithSearchIDsWoSharing(knowledgeArticlesMap);
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('RecordTypeId IN :recordTypeIds AND PublishStatus IN :publishStatuses AND Id IN :knowledgeIds'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndRecordTypeIdWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdWoSharing(new Set<String>(),new Set<Id>(),new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('PublishStatus IN :publishStatuses AND RecordTypeId IN :recordTypesIds AND Id NOT IN :knowledgeIds'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndTitleWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndTitleWoSharing(new Set<String>(),new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('PublishStatus IN :publishStatuses AND Title LIKE: knowledgeTitles'));
    }
    
    @IsTest
    static void shouldSelectBySubscribedSolutionForUserWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectBySubscribedSolutionForUserWoSharing(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT Solution__c FROM Subscribed_Solutions__c WHERE User__c IN :userIds)'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusIdAndRecordTypeIdWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusIdAndRecordTypeIdWoSharing(new Set<String>(),new Set<Id>(),new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('PublishStatus IN :publishStatuses AND Id IN :knowledgeIds AND RecordTypeId IN :recordTypesIds'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndRecordTypeIdWithLogoPersonaWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdWithLogoPersonaWoSharing(new Set<String>(),new Set<Id>(),new Set<Id>(),'');
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('((PublishStatus IN :publishStatuses AND RecordTypeId IN :recordTypesIds AND OSB_Persona__c INCLUDES (:persona)) OR Id IN :knowledgeExceptions)'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndRecordTypeIdPersona() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdPersona(new Set<String>(),new Set<Id>(),new Set<Id>(),new Set<Id>(),'');
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('(PublishStatus IN :publishStatuses AND RecordTypeId IN :recordTypesIds AND OSB_Persona__c INCLUDES (:persona) AND Id NOT IN :knowledgeIds) OR Id IN :exceptionRecords'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndRecordTypeIdPersonaApiWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdPersonaApiWoSharing(new Set<String>(),new Set<Id>(),'Client','South Africa',new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('RecordTypeId IN :recordTypeIds AND PublishStatus IN :publishStatuses'));
    }
    
    @IsTest
    static void shouldSelectByPublishStatusAndRecordTypeIdPersonaSolutionWoSharing() {
        SEL_KnowledgeArticleVersions.newInstance().selectByPublishStatusAndRecordTypeIdPersonaSolutionWoSharing(new Set<String>(),new Set<Id>(),new Set<Id>(),'Client','South Africa',new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('RecordTypeId IN :recordTypeIds AND PublishStatus IN :publishStatuses AND Id NOT IN :knowledgeIds'));
    }
}