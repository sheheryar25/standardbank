/**
 * Test class for SEL_SubscribedSolutions
 *
 * @author Ephetehe Mokgopanyane(ephetehe.mokgopanyane@tetrad.co.za)
 * @date August 2020
 */
@IsTest(IsParallel=true)
private class SEL_SubscribedSolutions_Test {

    @IsTest
    static void shouldSelectById() {
        Test.startTest();
        SEL_SubscribedSolutions.newInstance().selectById(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN: idSet'));
    }

    @IsTest
    static void shouldSelectByUserId() {
        Test.startTest();
        SEL_SubscribedSolutions.newInstance().selectByUserId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('User__c IN: idSet'));
    }
    
    @IsTest
    static void shouldSelectByTitle() {
        Test.startTest();
        SEL_SubscribedSolutions.newInstance().selectBySolutionTitle(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Solution__r.title IN:knowledgeTitles'));
    }
    
    @IsTest
    static void shouldSelectByUserAndSolutionId() {
        Test.startTest();
        SEL_SubscribedSolutions.newInstance().selectByUserIdAndSolutionId(new Set<Id>(),new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('User__c IN: idSet AND Id IN: SolutionIds'));
    }
}