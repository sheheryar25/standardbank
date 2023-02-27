/**
 *
 * Test class for OSB_SRV_BotPaymentTrackingHandler
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date January 2021
 */
@IsTest
public with sharing class OSB_SRV_FinancialAccPermissionHan_Test {

    @TestSetup
    static void setup() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        Contact con = (Contact) new BLD_Contact(uow)
                .name('Name', 'Test1')
                .email('test1@email.com')
                .ownerId(UserInfo.getUserId())
                .communityAccessRole(DMN_Contact.OSB_COMMUNITY_ACCESS_ROLE_AP)
                .account(
                        new BLD_Account(uow)
                )
                .getRecord();
        uow.commitWork();
    }

    @IsTest
    public static void testCheckContactPermissionNoPermission(){
        Contact con = [SELECT Id, AccountId FROM Contact LIMIT 1];
        OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput input = new OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput();
        input.contactId = con.Id;
        input.permissionType = 'Payment Tracking';
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork(new List<SObjectType>{
                Permissions__c.getSObjectType(),
                Financial_Account__c.getSObjectType(), Financial_Account_Permission__c.getSObjectType()
        });
        BLD_Permissions permissionBld = new BLD_Permissions(uow).name('Payment tracking');
        uow.commitWork();
        List<OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput> inputs = new List<OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput>{input};
        Test.startTest();
        List<Boolean> result = OSB_SRV_FinancialAccPermissionHandler.checkPermissions(inputs);
        Test.stopTest();
        System.assertEquals(1, result.size());
        System.assertEquals(false, result.get(0));
    }

    @IsTest
    public static void testCheckContactPermissionOnAccountNoPermission(){
        Contact con = [SELECT Id, AccountId FROM Contact LIMIT 1];
        OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput input = new OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput();
        input.contactId = con.Id;
        input.permissionType = 'Payment Tracking';
        input.accountNumber = '/23131321374';
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork(new List<SObjectType>{
                Permissions__c.getSObjectType(),
                Financial_Account__c.getSObjectType(), Financial_Account_Permission__c.getSObjectType()
        });
        BLD_Permissions permissionBld = new BLD_Permissions(uow).name('Payment tracking');
        BLD_FinancialAccount financialAccountBld = new BLD_FinancialAccount(uow)
                .clientId(con.AccountId)
                .name('John')
                .externalId('/23131321374');
        uow.commitWork();
        List<OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput> inputs = new List<OSB_SRV_FinancialAccPermissionHandler.CheckPermissionsInput>{input};
        Test.startTest();
        List<Boolean> result = OSB_SRV_FinancialAccPermissionHandler.checkPermissions(inputs);
        Test.stopTest();
        System.assertEquals(1, result.size());
        System.assertEquals(false, result.get(0));
    }
}