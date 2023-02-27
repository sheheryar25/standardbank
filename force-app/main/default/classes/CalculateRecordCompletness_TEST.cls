@isTest
public with sharing class CalculateRecordCompletness_TEST {
    
    public static final String 
        TEST_ACCOUNT_NAME = 'Test Account Name',
        COMMERCIAL_AFRICA_TYPE  = 'Commercial_Banking_Africa_Regions';

    public static List<Account> accounts;

    private static void getAccounts() {
        String query = 'Select RecordType.Name ';
        for(Schema.SObjectField fld: Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().values()){
            query = query + ', ' + fld.getDescribe().getName() + ' ';
        }
        query = query + 'from Account';
        accounts  = Database.query(query);
    }

    @testSetup
    private static void setup(){
    
        TEST_DataFactory.generateConfiguration();
        fflib_SObjectUnitOfWork uow;
        uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        ABS_ObjectBuilderBase accBld = new BLD_Account(uow)
            .name(TEST_ACCOUNT_NAME)
            .useCommB()
            .useGroupParent()
            .addContact(new BLD_Contact(uow)
                .useClientContact()
            )
            .commitWork();
    }

    @isTest
	public static void testAccountRecCompleteness() {
		getAccounts();
        Map<Id, Account> accountMap =  new Map<Id,Account>(accounts);
        accounts.get(0).RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get(COMMERCIAL_AFRICA_TYPE).getRecordTypeId();
		Test.startTest();
        CalculateRecordCompleteness.updateRecordCompletenessScore(accounts.get(0), Record_Completeness_RR_Helper.getRelatedRecord(accountMap.keySet(), accountMap).get(accounts.get(0)));
        Test.stopTest();
    }
	
	@isTest
	public static void testRecCompletnessBatch() {
		getAccounts();
        Test.startTest();
        accounts.get(0).RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get(COMMERCIAL_AFRICA_TYPE).getRecordTypeId();
		update accounts;
		Id jobid = Database.executeBatch(new BCH_ClientRecordCompletenessBatch(), 200);
        Test.stopTest();
	}}