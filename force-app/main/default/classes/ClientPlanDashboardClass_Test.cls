/****************************************************************\
    @ Author        : Nitish Kumar
    @ Date          : 19 - May - 2014
    @description   : Test class for ClientPlanDashboardClass.cls
    
    @ Last Modified By:     Abhishek Vaideeswaran
    @ Last Modified On:     February 2016
    @ Last Modified Reason: EN - 686 : Assigned CIF__c number to all clients for which GCR records are created                     
*****************************************************************/
@SuppressWarnings('PMD.NcssMethodCount,PMD.CognitiveComplexity')
@IsTest
private class ClientPlanDashboardClass_Test {

    @IsTest
    static void myUnitTest() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        User testUser1 = (User) new BLD_USER(uow).useSysAdmin().division(DMN_User.GM_DIVISION).getRecord();
        User testUser2 = (User) new BLD_USER(uow).useSysAdmin().division( DMN_User.TPS_DIVISION).getRecord();
        User testUser3 = (User) new BLD_USER(uow).useSysAdmin().division(DMN_User.IB_DIVISION).getRecord();
        User testUser4 = (User) new BLD_USER(uow).useSysAdmin().division(DMN_User.RE_DIVISION).getRecord();
        System.runAs(new User(Id = UserInfo.getUserId())) {
            uow.commitWork();
        }

        BLD_Account accBld = new BLD_Account(uow).useChild()
                .CIF('TestCIF0');

        for (Integer i = 0; i < 9; i++) {
            BLD_GlobalClientRevenue bldGCR = new BLD_GlobalClientRevenue(uow)
                    .reportingCountry(DMN_GlobalClientRevenue.REPORTING_COUNTRY_SA)
                    .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_GLOBAL_MARKET)
                    .clientValueUSDPreviousYear(14787.19)
                    .clientValueUSDCurrentYear(34937.14)
                    .budgetUSDNextYear(937.14)
                    .clientValueZarPreviousYear(98228.08)
                    .clientValueZarCurrentYear(108278.88)
                    .budgetZARNextYear(8228.09)
                    .client(accBld);
            if (i == 0 ) {
                bldGCR.currentAndPreviousYear()
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_GLOBAL_MARKET)
                        .divisionProductSubsets(DMN_GlobalClientRevenue.DIVISION_PRODUCT_SUBSETS_CREDIT);
            } else if (i == 1) {
                bldGCR.currentAndPreviousYear()
                        .divisionProductSubsets(DMN_GlobalClientRevenue.DIVISION_PRODUCT_SUBSETS_TRADE)
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_RANSACTIONAL_PRODUCTS_AND_SERVICES);

            } else if (i == 2) {
                bldGCR.currentAndPreviousYear()
                        .divisionProductSubsets(DMN_GlobalClientRevenue.DIVISION_PRODUCT_SUBSETS_ADVISORY)
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_INVESTMENT_BANKING);

            } else if (i == 3) {
                bldGCR.currentAndPreviousYear()
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_OTHER);

            } else if (i == 4) {
                bldGCR.currentAndPreviousYear()
                        .divisionProductSubsets(DMN_GlobalClientRevenue.DIVISION_PRODUCT_SUBSETS_CAPITAL_MARKETS);

            } else if (i == 5) {
                bldGCR.useHistoricalRevenue()
                        .snapshotDate(Date.today())
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_GLOBAL_MARKET)
                        .clientValueUSDCurrentMonth(10000.0)
                        .clientValueZARCurrentMonth(100000.0);

            } else if (i == 6) {
                bldGCR.useHistoricalRevenue()
                        .snapshotDate(Date.today().addMonths(-1))
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_RANSACTIONAL_PRODUCTS_AND_SERVICES)
                        .clientValueUSDCurrentMonth(10000.0)
                        .clientValueZARCurrentMonth(100000.0);

            } else if (i == 7) {
                bldGCR.useHistoricalRevenue()
                        .snapshotDate(Date.today().addMonths(-2))
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_INVESTMENT_BANKING)
                        .clientValueUSDCurrentMonth(10000.0)
                        .clientValueZARCurrentMonth(100000);

            } else if (i == 8) {
                bldGCR.useHistoricalRevenue()
                        .snapshotDate(Date.today().addMonths(-3))
                        .tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_OTHER)
                        .clientValueUSDCurrentMonth(10000.0)
                        .clientValueZARCurrentMonth(100000.0);
            }
        }

        new BLD_ClientPlan(uow)
                .account(accBld)
                .currencyIsoCode(UTL_Currency.corporateIsoCode);

        new BLD_Opportunity(uow)
                .client(accBld)
                .addProduct(new BLD_Product(uow))
                .ownerId(testUser1.Id);

        new BLD_Opportunity(uow)
                .client(accBld)
                .addProduct(new BLD_Product(uow))
                .ownerId(testUser2.Id);

        new BLD_Opportunity(uow)
                .client(accBld)
                .addProduct(new BLD_Product(uow))
                .ownerId(testUser3.Id);

        new BLD_Opportunity(uow)
                .client(accBld)
                .addProduct(new BLD_Product(uow))
                .ownerId(testUser4.Id);

        new BLD_Opportunity(uow)
                .client(accBld)
                .addProduct(new BLD_Product(uow));

        new BLD_CreditLine(uow)
                .account(accBld);

        new BLD_ShareWallet(uow)
                .client(accBld)
                .division(DMN_ShareWallet.DIVISION_TRANSACTIONAL_PRODUCTS_AND_SERVICES)
                .addProduct(new BLD_ShareWalletProduct(uow)
                .productSubset('Credit'));

        new BLD_ShareWallet(uow)
                .client(accBld)
                .division(DMN_ShareWallet.DIVISION_INVESTMENT_BANKING)
                .addProduct(new BLD_ShareWalletProduct(uow)
                .productSubset('Advisory'));

        new BLD_ShareWallet(uow)
                .client(accBld)
                .division(DMN_ShareWallet.DIVISION_GLOBAL_MARKETS)
                .addProduct(new BLD_ShareWalletProduct(uow)
                .productSubset('Trade'));

        new BLD_ClientCapitalAndRevenue(uow)
                .client(accBld);

        uow.commitWork();

        insert TEST_DataFactory.getCRT2SFMappings();

        Test.startTest();
        Boolean isExceptionThrown = false;
        try{
            PageReference cpdPage = Page.ClientPlanDashboard;
            cpdPage.getParameters().put('Id', accBld.getRecordId());
            Test.setCurrentPage(cpdPage);
            ApexPages.StandardController stdcontroller = new ApexPages.StandardController((Account) accBld.getRecord());
            ClientPlanDashboardClass con = new ClientPlanDashboardClass(stdcontroller);
            con.getcPlanCurrency();
            con.getcPlanCurrencyTop();
            con.getCurrencies();
            con.setcPlanCurrency('USD');
            con.setcPlanCurrencyTop('USD');
            con.refreshPage();
            con.setcPlanCurrency('ZAR');
            con.setcPlanCurrencyTop('ZAR');
            con.refreshPage1();
            con.getSumGM();
            con.getSumIB();
            con.getSumTPS();
            con.getSumAll();
            con.getSumFiveGM();
            con.getSumFiveIB();
            con.getSumFiveTPS();
            con.getSumFiveAll();
            con.crocCapitalUtilization();
        }
        catch(Exception ex) {
            isExceptionThrown = true;
        }
        System.assert(!isExceptionThrown);
        Test.stopTest();
    }

    @IsTest
    static void myUnitTest2() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        BLD_Account accBld = new BLD_Account(uow).useChild()
                .CIF('TestCIF2');
        uow.commitWork();

        Boolean isExceptionThrown = false;
        try {
            Test.startTest();
            PageReference cpdPage = Page.ClientPlanDashboard;
            cpdPage.getParameters().put('Id', accBld.getRecordId());
            Test.setCurrentPage(cpdPage);
            ApexPages.StandardController stdcontroller = new ApexPages.StandardController((Account)accBld.getRecord());
            ClientPlanDashboardClass con = new ClientPlanDashboardClass(stdcontroller);
            con.getcPlanCurrency();
            con.getcPlanCurrencyTop();
            con.getCurrencies();
            con.setcPlanCurrency('USD');
            con.setcPlanCurrencyTop('USD');
            con.refreshPage();
            con.setcPlanCurrency('ZAR');
            con.setcPlanCurrencyTop('ZAR');
            con.refreshPage1();
            con.getSumGM();
            con.getSumIB();
            con.getSumTPS();
            con.getSumAll();
            con.getSumFiveGM();
            con.getSumFiveIB();
            con.getSumFiveTPS();
            con.getSumFiveAll();
            con.crocCapitalUtilization();
            Test.stopTest();
        }
        catch(Exception ex) {
            isExceptionThrown = true;
        }
        System.assert(!isExceptionThrown);
    }
}