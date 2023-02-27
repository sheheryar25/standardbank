/**
 * Test class for OSB_SolutionShowcase_CTRL class
 *
 * @author Wayde Fagan (wayde.fagan@tetrad.co.za)
 * @date October 2020
 */
@IsTest(IsParallel=true)
public class OSB_SolutionShowcase_CTRL_Test {
	private static final String TEST_COMMUNITY_STATUS = 'Approved';
    private static final String TEST_COMMUNITY_ROLE = 'Authorised Person';
    private static final String TEST_SEARCH_KEYWORD = 'Test';

    @IsTest
    static void shouldgetSolutionShowcase() {
        fflib_ApexMocks mocks = new fflib_ApexMocks();
        SEL_Contacts contactsSel = (SEL_Contacts) mocks.mock(SEL_Contacts.class);
        
        Contact managerContact = (Contact) new BLD_Contact().mock(); 
		
        Contact teamContact = (Contact) new BLD_Contact()
            .setOSBDefaultData(TEST_COMMUNITY_ROLE,TEST_COMMUNITY_STATUS)
            .communityAccessManager(managerContact.Id) 
            .useClientContact()
            .mock();
        
        User userMock = (User) new BLD_USER()
            .contactId(managerContact.Id)
            .mock();
        
        SEL_KnowledgeArticleVersions selectorMock = (SEL_KnowledgeArticleVersions) mocks.mock(SEL_KnowledgeArticleVersions.class);
        SEL_KnowledgeExceptions selectorMockException = (SEL_KnowledgeExceptions) mocks.mock(SEL_KnowledgeExceptions.class);

        Knowledge__kav article = (Knowledge__kav) new BLD_Knowledge()
                .setOSBData()
                .isComingSoon(false)
                .useSolution()
                .mock();
        
        Knowledge_Entitlement_Exception__c knowledgeExcep = (Knowledge_Entitlement_Exception__c) new BLD_Knowledge_Entitlement()
            .knowledgeArticle(article.Id)
            .contact(teamContact.Id) 
            .mock();
		
        Formula.recalculateFormulas(new List<SObject> {teamContact});

        mocks.startStubbing();
        mocks.when(contactsSel.sObjectType()).thenReturn(Contact.SObjectType);
        mocks.when(contactsSel.selectByUserId(new Set<Id> {userMock.Id})).thenReturn(new List<Contact> {teamContact});
        mocks.when(selectorMock.sObjectType()).thenReturn(Knowledge__kav.SObjectType);
        mocks.when(selectorMock.selectByPublishStatusAndRecordTypeIdPersonaSolutionWoSharing((Set<String>) fflib_Match.anyObject(), (Set<Id>) fflib_Match.anyObject(), (Set<Id>) fflib_Match.anyObject(),(String) fflib_Match.anyString(),(String) fflib_Match.anyString(), (Set<Id>) fflib_Match.anyObject()))
                .thenReturn(new List<Knowledge__kav> {article});
        mocks.when(selectorMock.selectBySubscribedSolutionForUserWoSharing(new Set<Id> {userMock.Id})).thenReturn(new List<Knowledge__kav> {article});
        mocks.when(selectorMockException.sObjectType()).thenReturn(Knowledge_Entitlement_Exception__c.SObjectType);
        mocks.when(selectorMockException.selectByContactIdWoSharing(new Set<Id> {teamContact.Id})).thenReturn(new List<Knowledge_Entitlement_Exception__c> {knowledgeExcep});
        mocks.stopStubbing();

        ORG_Application.selector.setMock(selectorMock);
        ORG_Application.selector.setMock(selectorMockException);
        ORG_Application.selector.setMock(contactsSel);
        
        Test.startTest();
        List<Knowledge__kav> actualKnowledgeList = OSB_SolutionShowcase_CTRL.getSolutionShowcase((String) userMock.Id);
        List<Knowledge__kav> actualKnowledgeSolutionList = OSB_SolutionShowcase_CTRL.getSolutionSearchResults((String) userMock.Id,TEST_SEARCH_KEYWORD);
        Test.stopTest();
        System.assertEquals(UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_SOLUTION), actualKnowledgeList[0].RecordTypeId);
    }
}