/**
* @author Emmanuel Nocks (BlueSky)
* @date August 2020
* @description Test class for SEL_ApplicationDocuments.
*/
@IsTest(IsParallel=true)
public class SEL_ApplicationDocuments_Test {
    
    @IsTest
    static void shouldSelectByAccountApplicationId(){
        Test.startTest();
        SEL_ApplicationDocuments.newInstance().selectByAccountApplicationId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Account_Application__c in :IdSet'));
    }
    
    @IsTest
    static void shouldSelectByOnboardApplicationId(){
        Test.startTest();
        SEL_ApplicationDocuments.newInstance().selectByOnboardApplicationId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Onboarding_Application__c in :IdSet'));
    }
    @IsTest
    static void shouldSelectByOnboardAppWherePending(){
        Test.startTest();
        SEL_ApplicationDocuments.newInstance().selectByOnboardAppWherePending(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Onboarding_Application__c IN:onBoardid'));
    }
}