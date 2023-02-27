@isTest
private class SEL_CallReportAttendees_Test {

    @IsTest
    static void selectByIdTest() {        
        SEL_CallReportAttendees.newInstance().selectById(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN :ids'));
    }

    @IsTest
    static void selectByContactIdTest() {
        SEL_CallReportAttendees.newInstance().selectByContactId(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Contact_id__c IN :contactIds'));
    } 

    @IsTest
    static void selectByContactIdAndStatusTest() {
        SEL_CallReportAttendees.newInstance().selectByContactIdAndStatus(new Set<Id>(), null, null);
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Contact_id__c IN :contactIds AND (Status__c = :invited OR Status__c = :attended)'));
    }

    @IsTest
    static void shouldGetSObjectFieldList() {
        SEL_CallReportAttendees selector = new SEL_CallReportAttendees();
        List<SObjectField> result = selector.getSObjectFieldList();
        system.assertNotEquals(null, result);
    }
}