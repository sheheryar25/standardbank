/**
 * Builder class for Subscribed solutions 
 *
 * @author      Wayde Fagan (Wayde.fagan@tetrad.co.za)
 * @date        March 2021
 */
@isTest
public without sharing class BLD_Subscribed_Solutions extends ABS_ObjectBuilderBase{
	public static final String DEF_TITLE = 'Test article';
    public static final String DEF_INTRODUCTION = 'Test introduction';
    public static final String DEF_URL = 'Test url';
    public static final String DEF_URL_NAME = 'Test name';
    private static final String TEST_URL_NAME = 'TestURL';
    
    public BLD_Subscribed_Solutions() { 
		this(getNewUnitOfWork());        
	}
    
    public BLD_Subscribed_Solutions(fflib_SObjectUnitOfWork uow) {
        super(Subscribed_Solutions__c.SObjectType, uow);
    }

    public BLD_Subscribed_Solutions(Subscribed_Solutions__c sol, fflib_SObjectUnitOfWork uow) {
        super(sol, uow);
    }
    
    public BLD_Subscribed_Solutions setOSBData() {
        
        Knowledge__kav article = (Knowledge__kav) new BLD_Knowledge()
                .setOSBData()
                .isComingSoon(false)
                .setField(Knowledge__kav.UrlName, TEST_URL_NAME)
                .setField(Knowledge__kav.RecordtypeId, UTL_RecordType.getRecordTypeId(DMN_Knowledge.OBJ_NAME, DMN_Knowledge.RT_API))
                .commitWork().getRecord();

        return (BLD_Subscribed_Solutions) 
                setField(Subscribed_Solutions__c.Solution__c, article.Id);
    }
}