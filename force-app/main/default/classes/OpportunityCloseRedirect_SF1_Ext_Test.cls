/*************************************************************************\
    @ Author        :     Vaishali Singh
    @ Date          :     19 January 2015
    @description   :     EN-0434: Opportunity Edit Action on SF1
****************************************************************************/
@isTest(SeeAllData=false) 
private class OpportunityCloseRedirect_SF1_Ext_Test {

    @IsTest
    static void testSave() {
        Id rtId = Account.sObjectType.getDescribe().getRecordTypeInfosByName().get('Child').getRecordTypeId();
        User testUser = (User) new BLD_USER().useCib().getRecord();
        testUser.User_Division__c = 'Global Markets'; 
        testUser.Business_Unit__c = 'CRM IT'; 
        testUser.User_CIB_Global_Area__c = 'CIBSA';
        testUser.Force_Owner_to_Add_Opportunity_Product__c = true;
        insert testUser;
        System.runAs(testUser) {
            fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
            new BLD_Account(uow)
                    .recordTypeId(rtId)
                    .name('Test Client 1')
                    .addOpportunity(
                        new BLD_Opportunity(uow)
                                .name('Test Opportunity')
                                .closeDate(Date.today())
                                .stage('2 - Develop')
                                .currency('ZAR')
            );
            uow.commitWork();
            Opportunity opp = [SELECT Id, StageName FROM Opportunity LIMIT 1];
            Test.startTest();
            Test.setCurrentPage(Page.CloseOpportunityPage);
            ApexPages.currentPage().getParameters().put('Id', opp.Id);
            ApexPages.StandardController controller = new ApexPages.StandardController(opp);
            OpportunityCloseRedirect_SF1_Ext opptyCloseRedirectSF1 = new OpportunityCloseRedirect_SF1_Ext(controller);
            opptyCloseRedirectSF1.save();
            Test.StopTest();
        }
        List<Opportunity> opportunities = [SELECT Id, Probability FROM Opportunity];
        for(Opportunity opportunity : opportunities) {
            System.assertEquals(25, opportunity.Probability);
        }
    }
}