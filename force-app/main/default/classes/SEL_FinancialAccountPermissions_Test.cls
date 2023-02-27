@isTest
public class SEL_FinancialAccountPermissions_Test
{
	@testSetup
    public static void testSetup()
    {
        fflib_SObjectUnitOfWork uow =  ABS_ObjectBuilderBase.getNewUnitOfWorkWithKnowledge();
        fflib_SObjectUnitOfWork uowc = ABS_ObjectBuilderBase.getNewUnitOfWork(new List<Schema.sObjectType>
		{
            Schema.getGlobalDescribe().get('Financial_Account__c'),
            Schema.getGlobalDescribe().get('Financial_Account_Permission__c'),
            Schema.getGlobalDescribe().get('Permissions__c')
        });
        
        Account a = (Account) new BLD_Account(uow)
        	.name('Amazing testing account')
            .getRecord();
		
        uow.commitWork();
        
        Financial_Account__c fa = (Financial_Account__c) new BLD_FinancialAccount(uowc)
        	.clientId(a.Id)
        	.externalId('123321123312')
            .getRecord();
        
        Contact c = (Contact) new BLD_Contact(uow)
        	.lastName('AmazingLastName')
            .getRecord();
        
        Permissions__c perm1 = (Permissions__c) new BLD_Permissions(uowc)
        	.name('Payment tracking')
            .getRecord();
        
        Permissions__c perm2 = (Permissions__c) new BLD_Permissions(uowc)
        	.name('Email statement')
            .getRecord();
        
        Permissions__c perm3 = (Permissions__c) new BLD_Permissions(uowc)
            .name('Balance inquiry')
            .getRecord();
        
        uow.commitWork();
        uowc.commitWork();
        
        Financial_Account_Permission__c fap1 = (Financial_Account_Permission__c) new BLD_FinancialAccountPermission(uowc)
        	.authorizedPersonId(c.Id)
        	.financialAccountId(fa.Id)
            .permissionId(perm1.Id)
            .active(true)
            .getRecord();
        
        Financial_Account_Permission__c fap2 = (Financial_Account_Permission__c) new BLD_FinancialAccountPermission(uowc)
        	.authorizedPersonId(c.Id)
        	.financialAccountId(fa.Id)
            .permissionId(perm2.Id)
            .active(true)
            .getRecord();
        
        Financial_Account_Permission__c fap3 = (Financial_Account_Permission__c) new BLD_FinancialAccountPermission(uowc)
        	.authorizedPersonId(c.Id)
        	.financialAccountId(fa.Id)
            .permissionId(perm3.Id)
            .active(true)
            .getRecord();
        
        uowc.commitWork();
    }
    
    @isTest
    public static void testFinancialAccountsAndNoIds()
    {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        
        Financial_Account__c finAcc = [SELECT Id FROM Financial_Account__c WHERE External_Id__c = '123321123312' LIMIT 1];
            
        List<Financial_Account_Permission__c> lstFaps = [SELECT Id FROM Financial_Account_Permission__c WHERE Financial_Account__c = :finAcc.Id];
        List<Id> fapIds = new List<Id>();
        
        for(Financial_Account_Permission__c fap : lstFaps)
        {
            fapIds.add(fap.Id);
        }
        
        List<Financial_Account_Permission__c> lstRetFaps = selector.selectFAPs(new List<Id>{finAcc.Id}, fapIds);
        
        System.assertEquals(0, lstRetFaps.size());
    }
    
    @isTest
    public static void testActivePersonAccNum()
    {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        
        Contact con = [SELECT Id FROM Contact WHERE LastName = 'AmazingLastName' LIMIT 1];
        
        List<Financial_Account_Permission__c> lstRetFaps = selector.selectActiveByAuthorizedPersonsWithClientNameAndAccountNumber(new Set<Id>{con.Id}, 'Email statement');
        
        System.assertEquals(1, lstRetFaps.size());
    }
    
    @isTest
    public static void testActivePersonPerm()
    {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        
        Contact con = [SELECT Id FROM Contact WHERE LastName = 'AmazingLastName' LIMIT 1];
        
        List<Financial_Account_Permission__c> lstRetFaps = selector.selectActiveByAuthorizedPersonsWithClientName(new Set<Id>{con.Id}, 'Email statement');
        
        System.assertEquals(1, lstRetFaps.size());
    }
    
    @isTest
    public static void testActivePerson()
    {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        
        Financial_Account__c finAcc = [SELECT Id, External_Id__c FROM Financial_Account__c WHERE External_Id__c = '123321123312' LIMIT 1];
        Contact con = [SELECT Id FROM Contact WHERE LastName = 'AmazingLastName' LIMIT 1];
        
        List<Financial_Account_Permission__c> lstRetFaps = selector.selectActiveByAuthorizedPersonsAndAccountNumbersAndServiceType(new Set<Id>{con.Id}, new Set<String>{finAcc.External_Id__c}, 'Payment tracking');
        
        System.assertEquals(1, lstRetFaps.size());
    }
    
    @isTest
    public static void testAccNum()
    {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        
        Financial_Account__c finAcc = [SELECT Id, External_Id__c FROM Financial_Account__c WHERE External_Id__c = '123321123312' LIMIT 1];
        
        List<Financial_Account_Permission__c> lstRetFaps = selector.selectByActiveByAccountNumbersAndServiceType(new Set<String>{finAcc.External_Id__c}, 'Payment tracking');
        
        System.assertEquals(1, lstRetFaps.size());
    }
}