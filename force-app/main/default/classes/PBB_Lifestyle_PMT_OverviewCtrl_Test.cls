/***
    @ Func Area     	:  PBB Lifestyle
    @ Author        	:  Mykhailo Reznyk
    @ Date          	:  02.12.2019
    @ User Story    	:  US-4424
    @ Description 	    :  Test class of APEX Controller for PBB_Lifestyle_PMT_Overview_Client_Page component.
***/
@IsTest
private class PBB_Lifestyle_PMT_OverviewCtrl_Test {
/***
    @ param  	    :  No params
    @ return   	    :  void
    @ Description 	:  Setup method that creates test data.
***/
    @TestSetup
    private static void setupData(){
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        BLD_Account account = new BLD_Account(uow)
                .name('Test Account');
        account.addRevenueAndProfitability(
                new BLD_RevenueAndProfitability(uow)
                        .pmtExtractDate(Date.today().addDays(-7))
                        .netInterestIncome(25)
                        .nonInterestRevenue(30)
                        .averageCreditBalance(40)
                        .averageDebitBalance(50)
                        .impairments(60)
                        .operatingIncome(70)
                        .ytdAverageCreditBalance(80)
                        .ytdAverageDebitBalance(90)
                        .ytdImpairments(20)
                        .ytdNetInterestIncome(21)
                        .ytdNonInterestRevenue(22)
                        .ytdOperatingIncome(23)
        );
        account.addRevenueAndProfitability(
                new BLD_RevenueAndProfitability(uow)
                        .pmtExtractDate(Date.today())
                        .netInterestIncome(125)
                        .nonInterestRevenue(130)
                        .averageCreditBalance(140)
                        .averageDebitBalance(150)
                        .impairments(160)
                        .operatingIncome(170)
                        .ytdAverageCreditBalance(180)
                        .ytdAverageDebitBalance(190)
                        .ytdImpairments(200)
                        .ytdNetInterestIncome(210)
                        .ytdNonInterestRevenue(220)
                        .ytdOperatingIncome(230)
        );
        uow.commitWork();
    }
/***
    @ param  	    :  No params
    @ return   	    :  void
    @ Description 	:  Test if fetchData method actually returns data. Positive testing.
***/
    @IsTest
    static void testReturnData() {
        Account account = [SELECT Id FROM Account];
        Revenue_and_Profitability__c retrievedRevenueAndProf = PBB_Lifestyle_PMT_Overview_Controller.fetchData(account.Id);
        System.assert(retrievedRevenueAndProf != null);
        System.assertEquals(125, retrievedRevenueAndProf.Net_Interest_Income__c);
        System.assertEquals(130, retrievedRevenueAndProf.Non_Interest_Revenue__c);
        System.assertEquals(140, retrievedRevenueAndProf.Avarage_Credit_Balance__c);
        System.assertEquals(150, retrievedRevenueAndProf.Avarage_Debit_Balance__c);
        System.assertEquals(160, retrievedRevenueAndProf.Impairments__c);
        System.assertEquals(170, retrievedRevenueAndProf.Operating_Income__c);
        System.assertEquals(180, retrievedRevenueAndProf.YTD_Avarage_Credit_Balance__c);
        System.assertEquals(190, retrievedRevenueAndProf.YTD_Avarage_Debit_Balance__c);
        System.assertEquals(200, retrievedRevenueAndProf.YTD_Impairments__c);
        System.assertEquals(210, retrievedRevenueAndProf.YTD_Net_Interest_Income__c);
        System.assertEquals(220, retrievedRevenueAndProf.YTD_Non_Interest_Revenue__c);
        System.assertEquals(230, retrievedRevenueAndProf.YTD_Operating_Income__c);
    }

/***
    @ param  	    :  No params
    @ return   	    :  void
    @ Description 	:  Test if fetchData method returns null if no data was found. Negative testing.
***/
    @IsTest
    static void testReturnNull() {
        Account notInsertedAccount = new Account(Name='Not Inserted Tes Account');
        Revenue_and_Profitability__c retrievedRevenueAndProf = PBB_Lifestyle_PMT_Overview_Controller.fetchData(notInsertedAccount.Id);
        System.assertEquals(null, retrievedRevenueAndProf);
    }

/***
    @ param  	    :  No params
    @ return   	    :  void
    @ Description 	:  Test if fetchData method returns the latest Revenue_and_Profitability__c object.
***/
    @IsTest
    static void testReturnTheLatestPMTdata() {
        Account account = [SELECT Id FROM Account];
        Revenue_and_Profitability__c retrievedRevenueAndProf = PBB_Lifestyle_PMT_Overview_Controller.fetchData(account.Id);
        System.assertEquals(Date.today(), retrievedRevenueAndProf.PMT_extract_date__c);
    }
}