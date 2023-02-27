/***
  	@ Func Area     	:  IB
  	@ Author        	:  Wayne Solomon
  	@ Modified Date    	:  19 Feb 2020
  	@ User Story    	:  US-4492 -- DM NBAC: SPV New lightning component page layout added to existing JV Lightning record page
  	@description 	    :  Updated test class for DMN_BusinessAssessment
***/
@isTest
private class DMN_BusinessAssessment_Test {

	private static final String 
		TEST_USER_NAME          = 'stdBank@nbac.com',
		DEF_ACC_NAME            = 'Def Name for Acc',
		DEF_ACC_NAME_IMM       	= 'Def Name for Immediate',
		CIF_NUMBER            = '654321',
		IMM_CIF_NUMBER            = '654322',
		MILESTONE_TRANSACTION_OVERVIEW		= 'Transaction Overview';

	private static final Decimal
		 CURRENCY_VALUE1 = 1000.00,
		 CURRENCY_VALUE2 = 2000.00,
		 CURRENCY_VALUE3 = 3000.00,
		 CURRENCY_VALUE4 = 4000.00,
		 CURRENCY_VALUE5 = 5000.00,
		 CURRENCY_VALUE6 = 6000.00,
		 CURRENCY_VALUE7 = 100000000.00,
         NEW_CROC_VALUE = 200;
	
	private static User 
		usrOwner,
		usrCCBM,
		usrRiskManager;

	@TestSetup
	private static void prepareData() {

		TEST_DataFactory.generateConfiguration();
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        System.runAs(new User(Id = UserInfo.getUserId())){
            
            usrOwner = (User)new BLD_USER(uow).userName(TEST_USER_NAME+'1').useCib().syncContact().getRecord();
            usrCCBM = (User)new BLD_USER(uow).userName(TEST_USER_NAME+'2').useCib().syncContact().getRecord();
            usrRiskManager = (User)new BLD_USER(uow).userName(TEST_USER_NAME+'3').useCib().syncContact().getRecord();
            uow.commitWork();
        }
        Test.startTest();
        Test.stopTest(); 

        System.runAs(usrOwner){
            BLD_Account ugpClientBld	= (BLD_Account) new BLD_Account(uow).name(DEF_ACC_NAME).CIF(CIF_NUMBER).useCib().riskRating(DMN_Account.RISK_RATING_D1).useGroupParent()
            									.setField(Account.Country_Risk__c, DMN_Account.CTRY_OF_RISK)
            									.setField(Account.Client_Franco__c, DMN_Account.FRANCO_ANGOLA)
            									.setField(Account.Internal_Credit_Rating__c, DMN_Account.RISK_RATING_D2);

            uow.commitwork(); 
            
            ugpClientBld.setField(Account.Client_Sector__c, DMN_Account.SEC_CUSTOMER)
            			.setField(Account.Client_Sub_Sector__c, DMN_Account.SUB_SEC_AGRICULTURE);
            uow.registerDirty(ugpClientBld);
            
            BLD_Account childAccBld  = (BLD_Account) new BLD_Account(uow).name(DEF_ACC_NAME_IMM).CIF(IMM_CIF_NUMBER).useCib()
            							.useImmediateParent(ugpClientBld.getRecordId())
            							.setField(Account.Economic_Group_Parent__c,ugpClientBld.getRecordId());
            uow.commitwork();
            BLD_Opportunity opportunityBld1 = new BLD_Opportunity(uow).develop().client(ugpClientBld).currency(UTL_Currency.corporateIsoCode);
            BLD_Opportunity opportunityBld2 = new BLD_Opportunity(uow).develop().client(ugpClientBld).currency(UTL_Currency.corporateIsoCode);
            BLD_Product productBld1 = new BLD_Product(uow).linkToOpp(opportunityBld1).notionalValueCurrency(CURRENCY_VALUE7).currency(UTL_Currency.corporateIsoCode);
            BLD_Product productBld2 = new BLD_Product(uow).linkToOpp(opportunityBld2).notionalValueCurrency(CURRENCY_VALUE7).currency(UTL_Currency.corporateIsoCode);
            BLD_Product productBld3 = new BLD_Product(uow).linkToOpp(opportunityBld2).notionalValueCurrency(CURRENCY_VALUE7).currency(UTL_Currency.corporateIsoCode);

            BLD_ClientTeam ccBld = new BLD_ClientTeam(uow).account(ugpClientBld).role(DMN_ClientTeam.ROLE_MANAGER_CLIENT_COVERAGE).coordinator(true).user(usrOwner.Id);
            BLD_ClientTeam ccbmBld = new BLD_ClientTeam(uow).account(ugpClientBld).role(DMN_ClientTeam.ROLE_BUSINESS_DEV_MANAGER).ccbm(true).user(usrCCBM.Id);
            BLD_ClientTeam creditManagerBld = new BLD_ClientTeam(uow).account(ugpClientBld).role(DMN_ClientTeam.CREDIT_MANAGER).user(usrRiskManager.Id);

            BLD_GlobalClientRevenue globalRevenueBld1 = new BLD_GlobalClientRevenue(uow).client(ugpClientBld).currentAndPreviousYear()
            											.tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_GLOBAL_MARKET)
            											.clientValueZarCurrentYear(CURRENCY_VALUE1).clientValueZarPreviousYear(CURRENCY_VALUE2);
            BLD_GlobalClientRevenue globalRevenueBld2 = new BLD_GlobalClientRevenue(uow).client(ugpClientBld).currentAndPreviousYear()
            											.tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_INVESTMENT_BANKING)
            											.clientValueZarCurrentYear(CURRENCY_VALUE3).clientValueZarPreviousYear(CURRENCY_VALUE4);
    		BLD_GlobalClientRevenue globalRevenueBld3 = new BLD_GlobalClientRevenue(uow).client(ugpClientBld).currentAndPreviousYear()
            											.tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_RANSACTIONAL_PRODUCTS_AND_SERVICES)
            											.clientValueZarCurrentYear(CURRENCY_VALUE5).clientValueZarPreviousYear(CURRENCY_VALUE6);
            
            BLD_ClientCapitalAndRevenue capitalRevenueBld = new BLD_ClientCapitalAndRevenue(uow).clientCIF(CIF_NUMBER).CROCZAR(CURRENCY_VALUE2).currency(UTL_Currency.corporateIsoCode);
	        
	        String currentYear = String.valueOf(System.today().year());
	        BLD_ShareWallet shareWalletBld1  = new BLD_ShareWallet(uow).client(ugpClientBld)
	        												.division(DMN_ShareWallet.DIVISION_GLOBAL_MARKETS).financialYear(currentYear)
	        												.revenue(CURRENCY_VALUE1).totalWalletSize(CURRENCY_VALUE5);
	       	BLD_ShareWallet shareWalletBld2  = new BLD_ShareWallet(uow).client(ugpClientBld)
	        												.division(DMN_ShareWallet.DIVISION_INVESTMENT_BANKING).financialYear(currentYear)
	        												.revenue(CURRENCY_VALUE2).totalWalletSize(CURRENCY_VALUE4);
	        BLD_ShareWallet shareWalletBld3  = new BLD_ShareWallet(uow).client(ugpClientBld)
	        												.division(DMN_ShareWallet.DIVISION_TRANSACTIONAL_PRODUCTS_AND_SERVICES).financialYear(currentYear)
	        												.revenue(CURRENCY_VALUE1).totalWalletSize(CURRENCY_VALUE2);
			
	       	BLD_CreditRiskAppetite riskApetiteBld = (BLD_CreditRiskAppetite) new BLD_CreditRiskAppetite(uow)
	       												.setField(Credit_Risk_Appetite__c.Country__c, DMN_Account.CTRY_OF_RISK)
														.setField(Credit_Risk_Appetite__c.Sector__c, DMN_Account.SEC_CUSTOMER)
														.setField(Credit_Risk_Appetite__c.Sub_Sector__c, DMN_Account.SUB_SEC_AGRICULTURE)
														.setField(Credit_Risk_Appetite__c.Sector_Credit_Appetite__c, DMN_RiskAppettite.RISK_HOLD)
														.setField(Credit_Risk_Appetite__c.Country_Credit_Appetite__c, DMN_RiskAppettite.RISK_HOLD);
			
			BLD_CreditLine creditLineBld1 	= new BLD_CreditLine(uow).account(ugpClientBld).totalUtilisation(CURRENCY_VALUE2).creditLimit(CURRENCY_VALUE2);
			BLD_CreditLine creditLineBld2 	= new BLD_CreditLine(uow).account(childAccBld).totalUtilisation(CURRENCY_VALUE3).creditLimit(CURRENCY_VALUE3);

			uow.commitwork();
			BLD_BusinessAssessment assessment = new BLD_BusinessAssessment(uow).client(ugpClientBld);

			uow.commitwork();

		}
	}

	private static void getUsers(){
        for(User u : [  SELECT Username
		FROM User
		WHERE UserName in: (new String[]{TEST_USER_NAME+'1', TEST_USER_NAME+'2',TEST_USER_NAME+'3'})]){
			if(u.UserName == (TEST_USER_NAME+'1')){
				usrOwner = u;
			}
			if(u.UserName == (TEST_USER_NAME+'2')){
				usrCCBM = u;
			}
			if(u.UserName == (TEST_USER_NAME+'3')){
				usrRiskManager = u;
			}
		}
	}

	@isTest static void shouldThrowNoAssessmentException() {
		String exceptionMessage;
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		try{
			DMN_BusinessAssessment.assignOpportunities(null, null,uow);
		}catch(DMN_BusinessAssessment.BusinessAssessmentException ex){
			exceptionMessage = ex.getMessage();
		}

		system.assertEquals(DMN_BusinessAssessment.NO_BUSINESS_ASSESSMENT_SPECIFIED, exceptionMessage);
	}

	@isTest static void shouldThrowNoOpportuinityException() {
		String exceptionMessage;
		
		Business_Assessment__c[] assessments = [SELECT Id
												FROM Business_Assessment__c limit 1];
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();										
		
		try{
			
			DMN_BusinessAssessment.assignOpportunities(assessments[0].Id, null,uow);

		}catch(DMN_BusinessAssessment.BusinessAssessmentException ex){
			exceptionMessage = ex.getMessage();
		}

		system.assertEquals(DMN_BusinessAssessment.NO_OPPORTUNITY_SPECIFIED, exceptionMessage);
	}

	@IsTest
	private static void shouldUpdateOpportunityOnBusinessAssessmentUpdate(){
		Business_Assessment__c assessment = [
				SELECT Id, Account__c, Name, Credit_Paper_Approved_By__c
				FROM Business_Assessment__c
				limit 1
		];

		Opportunity[] opportunities = [
				SELECT Id
				FROM Opportunity
				WHERE AccountId = :assessment.Account__c
				LIMIT 1
		];

		List<Id> opportunitiesIds = new List<Id>(new Map<Id,SObject>(opportunities).keySet());
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

		Test.startTest();
		Assessment_Opportunity__c[] assessmentOpps = DMN_BusinessAssessment.assignOpportunities(assessment.Id, opportunitiesIds, uow);
		uow.commitWork();
		assessment.Credit_Paper_Approved_By__c = 'John Doe';

		update assessment;
		Test.stopTest();

		Opportunity testOpp = [SELECT Id, Business_Assessment_Name__c, Credit_Paper_Approved_By__c FROM Opportunity WHERE Id = :opportunities.get(0).Id];
		System.assertEquals(assessment.Name, testOpp.Business_Assessment_Name__c);
		System.assertEquals(assessment.Credit_Paper_Approved_By__c, testOpp.Credit_Paper_Approved_By__c);
	}

	@IsTest
	private static void shouldUpdateOpportunityOnBusinessAssessmentDelete(){
		Business_Assessment__c assessment = [
				SELECT Id, Account__c, Name, Credit_Paper_Approved_By__c
				FROM Business_Assessment__c
				limit 1
		];

		Opportunity[] opportunities = [
				SELECT Id
				FROM Opportunity
				WHERE AccountId = :assessment.Account__c
				LIMIT 1
		];

		Test.startTest();
		List<Id> opportunitiesIds = new List<Id>(new Map<Id,SObject>(opportunities).keySet());
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

		Assessment_Opportunity__c[] assessmentOpps = DMN_BusinessAssessment.assignOpportunities(assessment.Id, opportunitiesIds, uow);
		uow.commitWork();
		assessment.Credit_Paper_Approved_By__c = 'John Doe';

		update assessment;
		delete assessment;
		Test.stopTest();

		Opportunity testOpp = [SELECT Id, Business_Assessment_Name__c, Credit_Paper_Approved_By__c FROM Opportunity WHERE Id = :opportunities.get(0).Id];
		System.assertEquals(null, testOpp.Business_Assessment_Name__c);
		System.assertEquals(null, testOpp.Credit_Paper_Approved_By__c);
	}

	@IsTest
	private static void shouldUpdateOpportunityOnBusinessAssessmentUndelete(){
		Business_Assessment__c assessment = [
				SELECT Id, Account__c, Name, Credit_Paper_Approved_By__c
				FROM Business_Assessment__c
				limit 1
		];

		Opportunity[] opportunities = [
				SELECT Id
				FROM Opportunity
				WHERE AccountId = :assessment.Account__c
				LIMIT 1
		];

		Test.startTest();
		List<Id> opportunitiesIds = new List<Id>(new Map<Id,SObject>(opportunities).keySet());
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

		Assessment_Opportunity__c[] assessmentOpps = DMN_BusinessAssessment.assignOpportunities(assessment.Id, opportunitiesIds, uow);
		uow.commitWork();
		assessment.Credit_Paper_Approved_By__c = 'John Doe';

		update assessment;
		delete assessment;
		undelete assessment;
		Test.stopTest();

		Opportunity testOpp = [SELECT Id, Business_Assessment_Name__c, Credit_Paper_Approved_By__c FROM Opportunity WHERE Id = :opportunities.get(0).Id];
		System.assertEquals(assessment.Name, testOpp.Business_Assessment_Name__c);
		System.assertEquals(assessment.Credit_Paper_Approved_By__c, testOpp.Credit_Paper_Approved_By__c);
	}

	@isTest static void shouldCreateAssessmentOpportunities() {
		Test.startTest();
		Business_Assessment__c[] assessments = [SELECT Id, Account__c
												FROM Business_Assessment__c limit 1];
		
		Opportunity[] opportunities = [SELECT Id 
										FROM Opportunity
										WHERE AccountId =: assessments[0].Account__c];

		List<Id> opportunitiesIds = new List<Id>(new Map<Id,SObject>(opportunities).keySet());
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		
		Assessment_Opportunity__c[] assessmentOpps = DMN_BusinessAssessment.assignOpportunities(assessments[0].Id, opportunitiesIds, uow);


		uow.commitWork();

		Business_Assessment__c assessment = [SELECT Delegated_Authority__c, Total_SB_Gross_Participation__c
												, NBAC_Committee__c, NBAC_Committee_Level__c
												FROM Business_Assessment__c LIMIT 1];
		test.stopTest();
		system.assertEquals(2, assessmentOpps.size());
		system.assertEquals(DMN_BusinessAssessment.DELEGATED_AUTHORITY_DA2, assessment.Delegated_Authority__c);
		system.assertEquals((3*CURRENCY_VALUE7+CURRENCY_VALUE2+CURRENCY_VALUE3), assessment.Total_SB_Gross_Participation__c);

		system.assertEquals(DMN_BusinessAssessment.COMMITTEE_ANGOLA, assessment.NBAC_Committee__c);
		system.assertEquals(DMN_BusinessAssessment.COMMITTEE_LEVEL_LOCAL, assessment.NBAC_Committee_Level__c);
	}
	
	@isTest static void shouldSetDefaults() {
		getUsers();
		Business_Assessment__c assessment = [SELECT Id, YTD_Group_Parent_Client_CROC__c, Economic_Group_Sector_Risk_Appetite__c,Economic_Group_Risk_Appetite__c
													, GM_Share_of_Wallet_Existing_SBG__c , IB_Share_of_Wallet_Existing_SBG__c, TPS_Share_of_Wallet_Existing_SBG__c
													, GM_Share_of_Wallet_Existing_Total__c , IB_Share_of_Wallet_Existing_Total__c, TPS_Share_of_Wallet_Existing_Total__c
													, Global_Markets_CY_Revenue__c , Investment_Banking_CY_Revenue__c, TPS_CY_Revenue__c
													, Global_Markets_PY_Revenue__c , Investment_Banking_PY_Revenue__c, TPS_PY_Revenue__c
													, Group_Parent_CC__c, Group_Parent_CCBM__c, Credit_Manager__c, Economic_Group_Parent_Credit_Limits__c 
													, CurrencyISOCode
												FROM Business_Assessment__c LIMIT 1];

		assessment.Milestone__c = MILESTONE_TRANSACTION_OVERVIEW;

		system.assertEquals(assessment.YTD_Group_Parent_Client_CROC__c, CURRENCY_VALUE2);
		
		system.assertEquals(assessment.GM_Share_of_Wallet_Existing_SBG__c, (CURRENCY_VALUE1/CURRENCY_VALUE5)*100);
		system.assertEquals(assessment.IB_Share_of_Wallet_Existing_SBG__c, (CURRENCY_VALUE2/CURRENCY_VALUE4)*100);
		system.assertEquals(assessment.TPS_Share_of_Wallet_Existing_SBG__c, (CURRENCY_VALUE1/CURRENCY_VALUE2)*100);
		
		system.assertEquals(assessment.GM_Share_of_Wallet_Existing_Total__c, CURRENCY_VALUE5);
		system.assertEquals(assessment.IB_Share_of_Wallet_Existing_Total__c, CURRENCY_VALUE4);
		system.assertEquals(assessment.TPS_Share_of_Wallet_Existing_Total__c, CURRENCY_VALUE2);
		
		system.assertEquals(assessment.Global_Markets_CY_Revenue__c, CURRENCY_VALUE1);
		system.assertEquals(assessment.Investment_Banking_CY_Revenue__c, CURRENCY_VALUE3);
		system.assertEquals(assessment.TPS_CY_Revenue__c, CURRENCY_VALUE5);
		
		system.assertEquals(assessment.Global_Markets_PY_Revenue__c, CURRENCY_VALUE2);
		system.assertEquals(assessment.Investment_Banking_PY_Revenue__c, CURRENCY_VALUE4);
		system.assertEquals(assessment.TPS_PY_Revenue__c, CURRENCY_VALUE6);
		
		system.assertEquals(assessment.Economic_Group_Parent_Credit_Limits__c, CURRENCY_VALUE2+CURRENCY_VALUE3);

		system.assertEquals(assessment.Economic_Group_Sector_Risk_Appetite__c, DMN_RiskAppettite.RISK_HOLD);
		system.assertEquals(assessment.Economic_Group_Risk_Appetite__c, DMN_RiskAppettite.RISK_HOLD);
		
		system.assertEquals(assessment.CurrencyISOCode, UTL_Currency.corporateIsoCode);
		
		system.assertEquals(assessment.Group_Parent_CCBM__c, usrCCBM.Id);
		system.assertEquals(assessment.Credit_Manager__c, usrRiskManager.Id);
		system.assertEquals(assessment.Group_Parent_CC__c, usrOwner.Id);
	}
	
	@isTest static void shouldCreatePdf() {
		getUsers();
		Business_Assessment__c assessment = [
				SELECT Milestone__c,
						(	SELECT Name
							FROM Attachments
						)
				FROM Business_Assessment__c
				LIMIT 1
		];

		System.assertEquals(true, assessment.Attachments.isEmpty());
		System.assertNotEquals(DMN_BusinessAssessment.MILESTONE_SUPPORTED, assessment.Milestone__c);

		Test.startTest();
			assessment.Milestone__c = DMN_BusinessAssessment.MILESTONE_SUPPORTED;
			assessment.RecordTypeId = UTL_RecordType.getRecordTypeId(	DMN_BusinessAssessment.OBJ_NAME,
																		DMN_BusinessAssessment.RT_NBAC);

			update assessment;
		Test.stopTest();

		assessment = [SELECT Milestone__c FROM Business_Assessment__c WHERE Id =: assessment.Id];
		System.assertEquals(DMN_BusinessAssessment.MILESTONE_SUPPORTED, assessment.Milestone__c);
	}

	@isTest static void shouldUpdateRevenueData() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

		List<Business_Assessment__c> bAssessments = [SELECT Account__r.CIF__c,  Global_Markets_CY_Revenue__c, Global_Markets_PY_Revenue__c FROM Business_Assessment__c LIMIT 1];
		Decimal oldCYValue = bAssessments[0].Global_Markets_CY_Revenue__c,
				oldPYValue = bAssessments[0].Global_Markets_PY_Revenue__c;
        List<Client_Capital_and_Revenue__c> ccRevenue = [SELECT CROC_ZAR__c FROM Client_Capital_and_Revenue__c LIMIT 1];
        ccRevenue[0].CROC_ZAR__c = NEW_CROC_VALUE;
        uow.registerDirty(ccRevenue);

		BLD_GlobalClientRevenue globalRevenueBld1 = (BLD_GlobalClientRevenue) new BLD_GlobalClientRevenue(uow).currentAndPreviousYear()
				.tradingDivision(DMN_GlobalClientRevenue.TRADING_DIVISION_GLOBAL_MARKET)
				.clientValueZarCurrentYear(CURRENCY_VALUE1).clientValueZarPreviousYear(CURRENCY_VALUE2)
				.setField(Global_Client_Revenue__c.Client__c, bAssessments[0].Account__c)
				.setField(Global_Client_Revenue__c.Client_CIF_Number__c, bAssessments[0].Account__r.CIF__c);
        uow.commitWork();
		Test.startTest();
			bAssessments = DMN_BusinessAssessment.updateRevenueAndCrocData(bAssessments);
            update bAssessments;
		Test.stopTest();

		List<Business_Assessment__c> businessAssessments = [SELECT YTD_Group_Parent_Client_CROC__c, Global_Markets_CY_Revenue__c, Global_Markets_PY_Revenue__c FROM Business_Assessment__c LIMIT 1];
		System.assertEquals(oldCYValue + CURRENCY_VALUE1, businessAssessments[0].Global_Markets_CY_Revenue__c);
		System.assertEquals(oldPYValue + CURRENCY_VALUE2, businessAssessments[0].Global_Markets_PY_Revenue__c);
        System.assertEquals(NEW_CROC_VALUE, businessAssessments[0].YTD_Group_Parent_Client_CROC__c);
	}

	@isTest static void shouldUpdateEntitiesRiskRating() {
		Test.startTest();
		Business_Assessment__c[] assessments = [SELECT Id, Account__c
		FROM Business_Assessment__c limit 1];

		Opportunity[] opportunities = [SELECT Id, Account.Name, Account.Internal_Credit_Rating__c
		FROM Opportunity
		WHERE AccountId =: assessments[0].Account__c];

		String entity1 = opportunities[0].Account.Name + ', ' + opportunities[0].Account.Internal_Credit_Rating__c;
		String entity2 = opportunities[1].Account.Name + ', ' + opportunities[1].Account.Internal_Credit_Rating__c;

		List<Id> opportunitiesIds = new List<Id>(new Map<Id,SObject>(opportunities).keySet());
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

		Assessment_Opportunity__c[] assessmentOpps = DMN_BusinessAssessment.assignOpportunities(assessments[0].Id, opportunitiesIds, uow);

		uow.commitWork();

		DMN_BusinessAssessment.updateEntitiesRiskRating(new Set<Id> {assessments[0].Account__c} );

		Business_Assessment__c bAssessment = [SELECT Entities_Risk_Rating__c, (SELECT Id FROM Assessment_Opportunities__r) FROM Business_Assessment__c WHERE Id = :assessments[0].Id];
		Test.stopTest();
		System.assert((bAssessment.Entities_Risk_Rating__c).contains(entity1));
		System.assert((bAssessment.Entities_Risk_Rating__c).contains(entity2));
	}

	@isTest static void updateDistributionAndRiskManMilestoneTest() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.SB_Gross_Participation__c,1);
		bAsessment.setField(Business_Assessment__c.SB_Hold__c,1);
		bAsessment.setField(Business_Assessment__c.SB_Sell_Down__c,1);
		bAsessment.setField(Business_Assessment__c.Market_Deal_Size__c,1);
		bAsessment.setField(Business_Assessment__c.Bank_Role__c,'Advisor');
		bAsessment.setField(Business_Assessment__c.Transaction_Type__c,'Bi-Lateral');
		bAsessment.setField(Business_Assessment__c.Listed_Instruments__c,'1');
		bAsessment.setField(Business_Assessment__c.Distribution_Price__c,'1');
		bAsessment.setField(Business_Assessment__c.Distribution_Commentary__c,'1');
		bAsessment.setField(Business_Assessment__c.Risk_Commentary__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateDistributionAndRiskManMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Distribution_And_RiskMan__c);
	}

	@isTest static void updateComplianceMilestoneTest() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.GCCR_Status__c,'1');
		bAsessment.setField(Business_Assessment__c.KYC_Status__c,'1');
		bAsessment.setField(Business_Assessment__c.EDD_PEP__c,'1');
		bAsessment.setField(Business_Assessment__c.Sanctions__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateComplianceMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Compliance__c);
	}

	@isTest static void updateEnvironmentalAssessmentMilestoneTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.ES_Risk_Commentary__c,'1');
		bAsessment.setField(Business_Assessment__c.Transaction_Risk__c,'1');
		bAsessment.setField(Business_Assessment__c.Client_Risk__c,'1');
		bAsessment.setField(Business_Assessment__c.Reference_Number__c,'1');
		bAsessment.setField(Business_Assessment__c.Transaction_on_the_Exceptions_List__c,true);
		Test.startTest();
		DMN_BusinessAssessment.updateEnvironmentalAssessmentMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Environmental_Assessment__c);
	}

	@isTest static void updateAnnexureDescriptionMilestoneTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.Submission_Type__c,'Type 3: Emphasis on risk / complexity');
		bAsessment.setField(Business_Assessment__c.Additional_Transaction_Description__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateAnnexureDescriptionMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Annexure_Description__c);
	}

	@isTest static void updateAnnexureRationaleMilestoneTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.Submission_Type__c,'Type 2: Emphasis on client strategy / returns');
		bAsessment.setField(Business_Assessment__c.Additional_Strategic_Rationale__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateAnnexureRationaleMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Annexure_Rationale__c);
	}

	@isTest static void updateStrategicRationaleMilestoneTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.Strategic_Rationale__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateStrategicRationaleMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Strategic_Rationale__c);
	}

	@isTest static void updateTransactionProfileMilestoneTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.Transaction_Description__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateTransactionProfileMilestone((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Transaction_Profile__c);
	}

	@isTest static void updateTransactionCounterPartiesTest() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.RecordTypeId,Schema.SObjectType.Business_Assessment__c.getRecordTypeInfosByDeveloperName().get('NBAC_Joint_Venture').getRecordTypeId());
		bAsessment.setField(Business_Assessment__c.Account__c,bAccount0.getRecordId());
		bAsessment.setField(Business_Assessment__c.Gearing_Metric__c,'1');
		bAsessment.setField(Business_Assessment__c.Off_Taker__c,'1');
		bAsessment.setField(Business_Assessment__c.Max_Transaction_Gearing__c,1);
		bAsessment.setField(Business_Assessment__c.Nature_of_Business__c,'1');
		bAsessment.setField(Business_Assessment__c.Guarantor_Name__c,bAccount0.getRecordId());
		bAsessment.setField(Business_Assessment__c.Guarantor_Gearing_PreTransaction__c,'1');
		bAsessment.setField(Business_Assessment__c.Guarantor_Gearing_PostTransaction__c,'1');
		bAsessment.setField(Business_Assessment__c.Export_Credit_Agency__c,'1');
		bAsessment.setField(Business_Assessment__c.Political_Risk_Cover__c,1);
		bAsessment.setField(Business_Assessment__c.Commercial_Risk_Cover__c,1);
		Test.startTest();
		DMN_BusinessAssessment.updateTransactionCounterParties((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(!((Business_Assessment__c) bAsessment.getRecord()).Completed_Transaction_Counterparties__c);
	}

	@isTest static void updateClientDetailsTest() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.RecordTypeId,Schema.SObjectType.Business_Assessment__c.getRecordTypeInfosByDeveloperName().get('NBAC_Joint_Venture').getRecordTypeId());
		bAsessment.setField(Business_Assessment__c.Client_Rating__c,'1');
		bAsessment.setField(Business_Assessment__c.Construction_Risk_Grade__c,'1');
		bAsessment.setField(Business_Assessment__c.Operations_Risk_Grade__c,'1');
		bAsessment.setField(Business_Assessment__c.Client_Sector__c,'1');
		bAsessment.setField(Business_Assessment__c.Risk_Classification__c,'1');
		bAsessment.setField(Business_Assessment__c.Economic_Group_Sector_Risk_Appetite__c,'1');
		bAsessment.setField(Business_Assessment__c.Complexity__c,'1');
		bAsessment.setField(Business_Assessment__c.Decision_Emphasis__c,'1');
		bAsessment.setField(Business_Assessment__c.Construction_LGD__c,1);
		bAsessment.setField(Business_Assessment__c.Operation_LGD__c,1);
		bAsessment.setField(Business_Assessment__c.Ultimate_Shareholders__c,'1');
		bAsessment.setField(Business_Assessment__c.Sponsors__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateClientDetails((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Client_Details_New__c);
	}

	@isTest static void updateBusinessSOWTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.GM_Share_of_Wallet_Existing_Total__c,1);
		bAsessment.setField(Business_Assessment__c.GM_Share_of_Wallet_Existing_SBG__c,1);
		bAsessment.setField(Business_Assessment__c.IB_Share_of_Wallet_Existing_Total__c,1);
		bAsessment.setField(Business_Assessment__c.IB_Share_of_Wallet_Existing_SBG__c,1);
		bAsessment.setField(Business_Assessment__c.TPS_Share_of_Wallet_Existing_Total__c,1);
		bAsessment.setField(Business_Assessment__c.TPS_Share_of_Wallet_Existing_SBG__c,1);
		bAsessment.setField(Business_Assessment__c.Anticipated_Ancillary_Business_GM__c,'1');
		bAsessment.setField(Business_Assessment__c.Anticipated_Ancillary_Business_IB__c,'1');
		bAsessment.setField(Business_Assessment__c.Anticipated_Ancillary_Business_TPS__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateBusinessSOW((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Business_and_SOW_New__c);
	}

	@isTest static void updateFinancialAnalysisTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());
		Test.startTest();
		DMN_BusinessAssessment.updateFinancialAnalysis((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(!((Business_Assessment__c) bAsessment.getRecord()).Completed_Financial_Analysis_New__c);
	}

	@isTest static void updateTransactionPartiesTest(){
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Account bAccount0 = new BLD_Account(uow)
				.name('acc0')
				.useGroupParent()
		;
		BLD_BusinessAssessment bAsessment = (BLD_BusinessAssessment) new BLD_BusinessAssessment(uow)
				.client(bAccount0.getRecordId());

		bAsessment.setField(Business_Assessment__c.Advisor__c,'1');
		bAsessment.setField(Business_Assessment__c.Mandated_Lead_Arranger__c,'1');
		bAsessment.setField(Business_Assessment__c.Other_Lenders__c,'1');
		Test.startTest();
		DMN_BusinessAssessment.updateTransactionParties((Business_Assessment__c)bAsessment.getRecord());
		Test.stopTest();
		System.assert(((Business_Assessment__c) bAsessment.getRecord()).Completed_Transaction_Parties_New__c);
	}
}