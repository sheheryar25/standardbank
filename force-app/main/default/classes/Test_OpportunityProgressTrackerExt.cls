/*****************************************************************************************************************************************************************************************************************
    @ Author        : Shubham Khilauria
    @ Date          : 13 - Feb - 2014
    @ Description   : Test Class for ClientOperatingCountryControllerClass.cls. This class will test the Unit test for Drag and Drop Page
                      which will include creating Existing Business Records, Prospective Business Records and also the scenario when 
                      Client doesn't have any Client Operating COuntries associated to it.

    @Last Modified Date: 4 Dec 2015
    @Last ModifiedBy: Petr Svestka
    @Last Modified Reason: fixed the users' timezone to SAST
    
    @ Last Modified By  : Abhishek V
    @ Last Modified On  : July 5, 2016
    @ Modification Description : Moved test.startTest() to fix 101 SOQL limit. Also, combined individual user records to a list and inserted
******************************************************************************************************************************************************************************************************************/

@isTest(seealldata = false)
private class Test_OpportunityProgressTrackerExt {
    /************************************************************************************************
    Scenario - Test different stages on Opportunity to show different visuals on screen.
    *************************************************************************************************/
    static testMethod void testOpportunityStages() {
        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

        User admUser = (User) new BLD_USER(uow).useSysAdmin().getRecord();
        User admUser1 = (User) new BLD_USER(uow).useSysAdmin().getRecord();
        User custUser = (User) new BLD_USER(uow).useCib().getRecord();

        System.runAs(new User(Id = UserInfo.getUserId())){
            uow.commitWork();
        }

        BLD_Opportunity oppBld = new BLD_Opportunity(uow)
            .stage(DMN_Opportunity.ST_LEAD)
            .client(
                new BLD_Account(uow).useChild().CIF('0').CIFActiveCode('A')
            );

        uow.commitWork();

        Opportunity oppRec = (Opportunity) oppBld.getRecord();
        
        
        system.runAs(admUser){
            
            ApexPages.StandardController std_Controller = new ApexPages.StandardController(oppRec);
            PageReference testPage  = Page.ProgressTracker;
            Test.setCurrentPage(testPage);
            OpportunityProgressTrackerExt oppStage = new OpportunityProgressTrackerExt(std_controller);
             
            // Set Close date less than today then Expired Opportunity will be Highlighted
            oppRec.CloseDate = System.today()-1;
            oppRec.Start_Date__c = System.today();
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
             
            //Insert Opp Team Members
            new BLD_OpportunityTeamMember(uow)
                .opportunity(oppBld)
                .userId(custUser.Id)
                .role('Product Specialist')
                .commitWork();
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolLeadWithMileStoneExpired,true);
            
            test.startTest();
            // Set Close date less than today then Expired Opportunity will be Highlighted
            oppRec.CloseDate = System.today()+4;
            oppRec.Start_Date__c = System.today();
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolLeadWithMileStone,true);
            
            //Change Opportunity Stage to Develop without Revenue.
            oppRec.StageName = DMN_Opportunity.ST_DEVELOP;
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolOrangeOpp,true);
            
            //Change Opportunity Stage to Develop with Rvenue.
            new BLD_Product()
                .linkToOpp(oppBld)
                .commitWork();
            oppRec.StageName = DMN_Opportunity.ST_DEVELOP;
            oppRec.Amount = 220.00;
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolDevelopWithMileStone,true);
            
            //Expire Opportunity in Develop Stage.
            oppRec.CloseDate = System.today()-4;
            oppRec.Start_Date__c = System.today();
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolDevelopWithMileStoneExpired,true);
            
            //Change Opportunity Stage to Closed
            oppRec.StageName = DMN_Opportunity.ST_CLOSED_WON;
            oppRec.Reason_Won_Lost_Comments__c = 'Test Comments';
            oppRec.Reason_Won_Lost_Detail__c = 'Test Detail';
            oppRec.ReasonForWinLossPickList__c = 'Win Reason';
            
            update oppRec;
            oppStage.oppId = oppRec.Id;
            //call Process opportunity
            oppStage.processOpportunity();
            System.assertEquals(oppStage.boolClosedStage,true);
            
            oppRec.OwnerId = admUser1.Id;
            update oppRec;
            //call Process opportunity
            oppStage.processOpportunity();
            test.stopTest();
            
        }   
    
       
    }
    
    
}