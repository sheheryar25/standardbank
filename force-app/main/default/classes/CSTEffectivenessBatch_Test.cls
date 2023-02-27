/****************************************************************************\
    @ Author        : Petr Roubal
    @ Date          : 30 Jun 2015
    @ Test File     : NA
    Function        : Contains all testing for the class CSTEffectivenessBatch
    @description Test class for CST EffectivenessBatch
******************************************************************************/
@isTest(SeeAllData=false)
private class CSTEffectivenessBatch_Test {
    
	@TestSetup
    static void testSetup(){
        
        insert TEST_DataFactory.getEnvironmentVariable();

        BLD_Account bankAccBld = new BLD_Account(TEST_DataFactory.stdBankEmpAcc, ABS_ObjectBuilderBase.getNewUnitOfWork());

        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

        for (Integer i = 0; i < 5; i++) {
            BLD_Contact conBld = new BLD_Contact(uow).useBankContact()
                .account(bankAccBld);
            new BLD_CallReport(uow)
                .internal()
                .meetingPurpose(DMN_CallReport.CORE_TEAM_MEETING)
                .linkWithParent(bankAccBld)
                .addAttendee(
                    new BLD_CallReportAttendee(uow)
                        .contact(conBld)
                );
        }

        uow.commitWork();

    }
    
    @IsTest
    static void testCSTEffectivenessBatch() {
        Test.startTest();
        Database.executeBatch(new CSTEffectivenessBatch());
        Test.stopTest();
        List<Account> accounts = [SELECT Id, Client_Summary_Last_Updated__c FROM Account];
        System.assert(!accounts.isEmpty());
        System.assertNotEquals(null, accounts[0].Client_Summary_Last_Updated__c);
    }
}