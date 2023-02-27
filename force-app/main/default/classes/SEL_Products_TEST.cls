/**
 * SEL_Products test class
 *
 * @author Kyle Cockcroft (kyle@bsky.co.za)
 * @date 2019-06-06
 */
@isTest
public class SEL_Products_TEST {
    
    public static List <SB_Product__c> methodOneProducts;
    public static List <SB_Product__c> methodTwoProducts;
    public static Set<Id> allIds = new Set<Id>();
    public static String grandParentProductType = 'GrandParentProductType';

    @IsTest
    static void shouldSelectWithoutCondition() {
        List<SB_Product__c> result = SEL_Products.newInstance().selectWithoutCondition();
        System.assertNotEquals(null, result);
    }

    @IsTest
    private static void selectByIdTest() {
        
        //Instantiate Selector class
        SEL_Products selector = new SEL_Products();
        //Call Test Method
        methodOneProducts = selector.selectById(allIds);
        
        //Validate Test Results
        System.assertNotEquals(methodOneProducts,null,'success');        
    }

    @IsTest
    private static void selectByOpportunityIdAndGrandParentProductTypeTest() {
        
        //Instantiate Selector class
        SEL_Products selector = new SEL_Products();
        //Call Test Method
        methodTwoProducts = selector.selectByOpportunityIdAndGrandParentProductType(allIds, grandParentProductType);
        
        //Validate Test Results
        System.assertNotEquals(methodTwoProducts,null,'success');  
    }

    @IsTest
    private static void shouldSelectByOpportunityStages() {
        List<SB_Product__c> result = SEL_Products.newInstance().selectByOpportunityStages(new Set<String>());
        System.assertNotEquals(null, result);
    }

    @IsTest
    private static void shouldCreateCorrectQueryConditionForSelectByOpportunityId(){
        SEL_Products selector = new SEL_Products();
        Set<Id> oppIds = new Set<Id>{
                fflib_IDGenerator.generate(Opportunity.SObjectType)
        };

        Test.startTest();
        selector.selectByOpportunityId(oppIds);
        Test.stopTest();

        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assertEquals('Opportunity__c IN :opportunityIds', result.getCondition());
    }

    @IsTest
    private static void shouldCreateCorrectQueryWithComplexCondition() {
        SEL_Products selector = new SEL_Products();
        Set<Id> oppIds = new Set<Id>{
                fflib_IDGenerator.generate(Opportunity.SObjectType)
        };

        List<Schema.RecordTypeInfo> recordTypeInfos = SB_Product__c.SObjectType.getDescribe().getRecordTypeInfos();
        String recordTypeDevName = recordTypeInfos[0].getDeveloperName();
        String additionalCond = 'AND Parent_Product__c != NULL';
        String orderField = 'CreatedDate';

        Test.startTest();
        selector.selectByOppIdRecordTypeProductLeadSource(
                oppIds,
                recordTypeDevName,
                additionalCond,
                orderField,
                fflib_QueryFactory.SortOrder.ASCENDING,
                true );
        Test.stopTest();

        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().contains(additionalCond));
        System.assert(result.getOrderings().toString().contains('field='+orderField));
    }

}