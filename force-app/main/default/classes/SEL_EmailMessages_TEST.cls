/**
 * SEL_EmailMessages Test class.
 *
 * @author Kyle Cockcroft (kcockcroft@deloitte.co.za)
 * @date 2019-04-24
 */
@IsTest
private class SEL_EmailMessages_TEST {

    @IsTest
    private static void testSelectorMethods() {
        Test.startTest();
        SEL_EmailMessages selector = new SEL_EmailMessages();
        selector.selectByParentId(new Set<Id>());
        List<EmailMessage> messages = selector.selectById(new Set<Id>());
        Test.stopTest();
        System.assert(messages.isEmpty());
    }

}