/**
 * Test class for SEL_BusinessAssessments
 *
 * @author Wayne Solomon
 * @date 2020-06-17
 */
@IsTest
private class SEL_BusinessAssessments_TEST {
    @IsTest
    static void selectByIdsWithAssessmentOppChildrenTest() {
        SEL_BusinessAssessments selector = new SEL_BusinessAssessments();
        Test.startTest();
        List<Business_Assessment__c> methodOneOpps = selector.selectByIdsWithAssessmentOppChildren(new Set<Id>{null});
        Test.stopTest();

        System.assert(methodOneOpps.isEmpty());
    }
}