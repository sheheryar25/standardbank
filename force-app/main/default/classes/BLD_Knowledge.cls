/**
 * Builder class for Knowledge__kav SObject
 *
 * @author      Wojciech Kowalczyk (wkowalczyk@deloittece.com)
 * @date        March 2020
 */
@IsTest
public with sharing class BLD_Knowledge extends ABS_ObjectBuilderBase {
    public static final String DEF_TITLE = 'Test article';
    public static final String DEF_INTRODUCTION = 'Test introduction';
    public static final String DEF_URL = 'Test url';
    public static final String DEF_URL_NAME = 'Testname';
	public static final String DEF_OPERATING_COUNTRY = 'Angola;South Africa';
    public static final String DEF_PERSONA = 'Staff;Client';
    
    public BLD_Knowledge() {
        this(getNewUnitOfWorkWithKnowledge());
    }

    public BLD_Knowledge(fflib_SObjectUnitOfWork uow) {
        super(Knowledge__kav.SObjectType, uow);
    }

    public BLD_Knowledge(Knowledge__kav knowledge, fflib_SObjectUnitOfWork uow) {
        super(knowledge, uow);
    }

    public BLD_Knowledge setOSBData() {
        return (BLD_Knowledge) setField(Knowledge__kav.Title,  DEF_TITLE)
                .setField(Knowledge__kav.Introduction__c,  DEF_INTRODUCTION)
                .setField(Knowledge__kav.URL__c, DEF_URL)
                .setField(Knowledge__kav.UrlName, DEF_URL_NAME)
            	.setField(Knowledge__kav.OSB_Persona__c, DEF_PERSONA)
            	.setField(Knowledge__kav.OSB_Country__c , DEF_OPERATING_COUNTRY);
    }

    public BLD_Knowledge url(String url) {
        return (BLD_Knowledge) setField(Knowledge__kav.URL__c, url);
    }

    public BLD_Knowledge urlName(String urlName) {
        return (BLD_Knowledge) setField(Knowledge__kav.UrlName, urlName);
    }

    public BLD_Knowledge isComingSoon(Boolean isComingSoon) {
        return (BLD_Knowledge) setField(Knowledge__kav.Is_coming_soon__c, isComingSoon);
    }

    public BLD_Knowledge useInsightArticle() {
        return (BLD_Knowledge) setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_INSIGHT));
    }

    public BLD_Knowledge useApiProduct() {
        return (BLD_Knowledge) setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_API));
    }

    public BLD_Knowledge useSolution() {
        return (BLD_Knowledge) setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_SOLUTION));
    }
    public BLD_Knowledge useFAQ() {
        return (BLD_Knowledge) setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_FAQCUSTOM));
    }
    public BLD_Knowledge useSuccessStory() {
        return (BLD_Knowledge) setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_SUCESSSTORIES));
    }
}