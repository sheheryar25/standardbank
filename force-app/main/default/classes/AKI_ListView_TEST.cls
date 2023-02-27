/**
 * Test class for Akili List View
 * 
 * @author Khakhu Ramakuela
 * @date October 2021
 */
@isTest
public class AKI_ListView_TEST {

    /**
     * Tests that getInsightData retrieves the relevant data for all cases
     */
    @isTest
    static void getInsightsDataTest(){
        List<Insight__c> ins;
        List<Insight__c> myIns;
        List<Insight__c> searchIns;
        AKI_TESTDATA.createInsights(5);
        AKI_TESTDATA.createInsight();
        Test.startTest();
        ins = AKI_COMP_AkiliInsightsListviewController.getInsightsData('{"searchKey": "",    "myInsightsSelected": false,    "allInsightsSelected": true,    "expiringSoonSelected": true,    "snoozedInsightsSelected": true}');
        searchIns = AKI_COMP_AkiliInsightsListviewController.getInsightsData('{"searchKey": "FX",    "myInsightsSelected": false,    "allInsightsSelected": true,    "expiringSoonSelected": true,    "snoozedInsightsSelected": false}');
        myIns = AKI_COMP_AkiliInsightsListviewController.getInsightsData('{"searchKey": "",    "myInsightsSelected": true,    "allInsightsSelected": false,    "expiringSoonSelected": false,    "snoozedInsightsSelected": false}');
        Test.stopTest();
        System.assert(ins.size() >0, 'Was expecting to find at least one insight');
        System.assert(searchIns.size() >0, 'Was expecting to find at least one insight');
        System.assert(myIns.size() >0, 'Was expecting to find at least one insight '+ins.get(0).Client_Coordinator__c+' '+UserInfo.getUserId());
    }

    /**
     * Tests that changeProdSpecialist correctly makes changes to the correct object instance and field and creates the relevant insight action
     */
    @isTest static void changeProdSpecialistTest(){
        Insight__c ins = AKI_TESTDATA.createInsights(1).get(0);
        Id newOwner=UserInfo.getUserId();
        Id oldOwner=UserInfo.getUserId();
        String leadId='0932';
        Test.setMock(HttpCalloutMock.class, new RAS_CreateDcp_ApiMock());
        Test.startTest();
        string paramVal = '{"recId":"'+ ins.id+'","psId": "'+newOwner+'","oldRecOwnerId":"'+ oldOwner+'","sendEmailOwnerChange": '+FALSE+',"leadId": "'+leadId+'"}';
        AKI_COMP_AkiliInsightsListViewController.changeProdSpecialist(paramVal);
        Insight_Action__c insAct=[SELECT id,Action_Type__c,Insight_Quality__c, Insight_Status__c FROM Insight_Action__c].get(0);
        Test.stopTest();
        System.assert(insAct.Action_Type__c=='Owner Changed', 'Insight action');
    }

    /**
     * Tests that createOpportunity correctly makes changes to the correct object instance and field and creates the relevant insight action
     */
    @isTest static void createOpportunityTest(){
        Insight__c ins = AKI_TESTDATA.createInsights(1).get(0);
        Account a=AKI_TestData.createAccount();
        Id clientId=a.Id;
        String oppName='Test Opportunity';
        String leadId='0932';
        String oppDescription='Testo opportunity';
        Date closeDate = Date.today().addDays(5);
        Test.setMock(HttpCalloutMock.class, new RAS_CreateDcp_ApiMock());
        Test.startTest();
        string paramVal = '{"recId":"'+ins.id+'","coClientId":"'+clientId+'","coName":"'+oppName+'","coDescription":"'+oppDescription+'","coCloseDate":"'+closeDate+'","leadId":"'+leadId+'"}';
        AKI_COMP_AkiliInsightsListViewController.createOpportunity(paramVal);
        Insight_Action__c insAct=[SELECT id,Action_Type__c,Insight_Quality__c, Insight_Status__c FROM Insight_Action__c].get(0);
        Opportunity opp=[Select Name, Description, AccountId,CloseDate, StageName,Lead_Source__c  From Opportunity].get(0);
        Test.stopTest();
        System.assert(insAct.Action_Type__c=='Opportunity Created', 'Insight action');
        System.assert(opp.Name==oppName, 'Expected different opportunity id');
        System.assert(opp.Description==oppDescription, 'Expected different opportunity description'+opp);
        System.assert(opp.AccountId==clientId, 'Expected different opportunity AccountId');
        System.assert(opp.CloseDate==closeDate, 'Expected different opportunity CloseDate');
        System.assert(opp.StageName=='1 - Lead', 'Expected different opportunity stage name');
        System.assert(opp.Lead_Source__c=='Akili Insight', 'Expected different opportunity lead source');
    }

    /**
     * Tests that snoozedInsights correctly makes changes to the correct object instance and field and creates the relevant insight action
     */
    @isTest static void snoozedInsightsTest(){
        Insight__c ins = AKI_TESTDATA.createInsights(1).get(0);
        String recComments='test snoozing insights';
        String leadId='0932';
        Test.setMock(HttpCalloutMock.class, new RAS_CreateDcp_ApiMock());
        Test.startTest();
        string paramVal = '{"recId":"'+ins.id+'","recComments":"'+ recComments+'","isSnoozed":'+FALSE +',"leadId":"'+leadId+'"}';
        AKI_COMP_AkiliInsightsListViewController.snoozedInsights(paramVal);
        Insight_Action__c insAct=[SELECT id,Action_Type__c,Insight_Quality__c, Insight_Status__c FROM Insight_Action__c].get(0);
        Test.stopTest();
        System.assert(insAct.Action_Type__c=='Is Snoozed', 'Insight action');
    }

    /**
     * Tests that feedbackInsights correctly makes changes to the correct object instance and field and creates the relevant insight action
     */
    @isTest static void feedbackInsightsTest(){
        Insight__c ins = AKI_TESTDATA.createInsights(1).get(0);
        String insightStatusVal='Insight actioned';
        String insightQualityVal='Please give me more';
        String leadId='0932';
        Test.setMock(HttpCalloutMock.class, new RAS_CreateDcp_ApiMock());
        Test.startTest();
        string paramVal = '{"recId":"'+ins.id+'","insightStatusVal":"'+insightStatusVal+'","insightQualityVal":"'+insightQualityVal+'","leadId":"'+leadId+'"}';
        AKI_COMP_AkiliInsightsListViewController.feedbackInsights(paramVal);
        Insight_Action__c insAct=[SELECT id,Action_Type__c,Insight_Quality__c, Insight_Status__c FROM Insight_Action__c].get(0);
        Test.stopTest();
        System.assert(insAct.Action_Type__c=='Rating', 'Insight action');
    }
}