/**
 * SEL_Opportunities test class.
 * @description Test Class for SEL_Opportunities
 * @author Kyle Cockcroft (kyle@bsky.co.za)
 * @date 07-08-2019
 *
 *****************************************************************************************
 *   @ Last Modified By  :   Maham Hassan
 *   @ Last Modified On  :   08/04/2022
 *   @ Last Modified Reason  : Updated this class to update the coverage required for 
 *                              deployment
 *
 *****************************************************************************************
 */
@isTest
public class SEL_Opportunities_TEST {
    
    public static List < Opportunity > methodOneOpps;
    public static List < Opportunity > methodTwoOpps;
    public static Set<Id> allIds = new Set<Id>();
    public static String grandParentProductType = 'GrandParentProductType';

    @isTest
    private static void selectByOppIdAndGrandParentProductTypeTest() {
        
        SEL_Opportunities selector = new SEL_Opportunities();
        methodOneOpps = selector.selectByOppIdAndGrandParentProductType(allIds, grandParentProductType);
        System.assertNotEquals(methodOneOpps,null,'success');
          for(Opportunity oppy : methodOneOpps){
            System.assertEquals('test opportunity', oppy.Short_Summary__c, 'Opportunity short summary should be test opportunity');            
            for(SB_Product__c product : oppy.Products__r){
                System.assertEquals(50.00, product.Risk_Weighted_Value__c, 'Product risk weighted value should be 50');
                System.assertEquals(20, product.Total_Fees__c, 'Product total fees should be 20');
            }   
        }
    }

    @isTest
    private static void selectByIdTest() {
        
        SEL_Opportunities selector = new SEL_Opportunities();
        methodTwoOpps = selector.selectById(allIds);
        System.assertNotEquals(methodTwoOpps,null,'success');
        
        for(Opportunity oppy : methodTwoOpps){
            System.assertEquals('test opportunity', oppy.Short_Summary__c, 'Opportunity short summary should be test opportunity'); 
        }
    }
    
    @isTest
    private static void selectByCIFNumberWithStartDateTest() {
        
        SEL_Opportunities selector = new SEL_Opportunities();
        List<Opportunity> methodOneOpps = selector.selectByCIFNumberWithStartDate(
                new Set<String>{''},UserInfo.getUserId(),Date.valueOf('2019-01-01')
        );
        System.assertEquals(0, methodOneOpps.size(), 'Opportunity with CIF Number should be 0');
    }

    @IsTest
    public static void testSelectByIdWithActiveTeamMembers() {
        SEL_Opportunities selector = new SEL_Opportunities();
        Set<Id> oppIds = new Set<Id>{fflib_IDGenerator.generate(Opportunity.SObjectType)};

        Test.startTest();
        selector.selectByIdWithActiveTeamMembers(oppIds);
        Test.stopTest();

        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assertEquals(1, result.getSubselectQueries().size(), 'Opportunity List size should be 1');
        // System.assertEquals('SELECT UserId FROM OpportunityTeamMembers WHERE IsActive__c = \'True\'', result.getSubselectQueries().get(0).toSOQL());
        // System.assertEquals('Id IN :ids', result.getCondition());
    }

    @isTest
    public static void testEnableExtraAttributes() {
        SEL_Opportunities opp = SEL_Opportunities.newInstance().
                                withCrudAssert(false).
                                withFlsEnforced(true).
                                includeSelectorFields(true);
        opp.selectByIdsWithoutCrudAndFlsEnforcement(allIds);
        opp.selectByIdsWithoutSharing(allIds);
        opp.selectByIds(allIds);
        System.assertEquals(0, opp.selectByIds(allIds).size(), 'Opportunity record should be 0');
    }
}