/**
 *  Test class for SEL_Contacts.
 *
 * @author		Youssef Ibrahim (yibrahim@deloittece.com)
 * @date		December 2020
*/
@IsTest
private class SEL_Contacts_TEST {

    @IsTest
    static void shouldSelectById() {
        SEL_Contacts.newInstance().selectById(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN: idSet'));
    }

    @IsTest
    static void shouldSelectAuthorisedPersonByAccountId() {
        SEL_Contacts.newInstance().selectAuthorisedPersonByAccountId(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Contact_Role_s_at_' +
                'Client__c includes (\'Authorised Person\') and AccountId in :idSet'));
    }

    @IsTest
    static void shouldSelectKYCContactByAccountId() {
        SEL_Contacts.newInstance().selectKYCContactByAccountId(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Contact_Role_s_at_Client__c' +
                ' includes (\'KYC Contact\',\'GROUP KYC Contact\') and AccountId in :idSet'));
    }

    @IsTest
    static void shouldSelectByUserId() {
        SEL_Contacts.newInstance().selectByUserId(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT ContactId FROM ' +
                'User WHERE Id IN :ids)'));
//        System.assert(result.getSelectedFields().contains('OSB_Community_Access_Manager__r.name'));
    }

    @IsTest
    static void shouldSelectByEmailIdentityPassport() {
        SEL_Contacts.newInstance().selectByEmailIdentityPassport(new Set<String>(),
                new Set<String>(), new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Email IN :emails AND (Identity_Number__c IN' +
                ' :idNumbers OR OSB_Passport_Number__c IN :passportNumbers)'));
    }

    @IsTest
    static void shouldSelectByIdentityNumber() {
        SEL_Contacts.newInstance().selectByIdentityNumber(new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Identity_Number__c IN: IdentityNumbers'));
    }

    @IsTest
    static void shouldSelectByOneHubManager() {
        SEL_Contacts.newInstance().selectByOneHubManager(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('OSB_Community_Access_Manager__c in :idSet'));
    }

    @IsTest
    static void shouldSelectByFirstNameLastNameEmail() {
        SEL_Contacts.newInstance().selectByFirstNameLastNameEmail(new Set<String>(), new Set<String>(), new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('(FirstName IN: firstNames AND LastName' +
                ' IN: lastNames AND Email IN: emails)'));
    }

    @IsTest
    static void shouldSelectByNameEmailPingId() {
        SEL_Contacts.newInstance().selectByNameEmailPingId(new Set<String>(), new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Name IN: names AND Email IN:' +
                ' emails AND Ping_Id__c !=null '));
    }

    @IsTest
    static void shouldSelectByIndustryUserId() {
        SEL_Contacts.newInstance().selectByIndustryUserId(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT ContactId ' +
                'FROM User WHERE Id IN :ids) AND Company_Industry__c !=null'));
    }

    @IsTest
    static void shouldSelectByIdWoSharing() {
        SEL_Contacts.newInstance().selectByIdWoSharing(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN: idSet'));
    }

    @IsTest
    static void shouldSelectByIdentityNumberWoSharing() {
        SEL_Contacts.newInstance().selectByIdentityNumberWoSharing(new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Identity_Number__c IN: IdentityNumbers'));
    }

    @IsTest
    static void shouldSelectByUserIdWoSharing() {
        SEL_Contacts.newInstance().selectByUserIdWoSharing(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT ContactId FROM ' +
                'User WHERE Id IN :ids)'));
    }

    @IsTest
    static void shouldSelectByIndustryUserIdWoSharing() {
        SEL_Contacts.newInstance().selectByIndustryUserIdWoSharing(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT ContactId FROM User WHERE Id ' +
                'IN :ids) AND Company_Industry__c !=null'));
    }

    @IsTest
    static void shouldSelectByNameEmailPingIdWoSharing() {
        SEL_Contacts.newInstance().selectByNameEmailPingIdWoSharing(new Set<String>(), new Set<String>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Name IN: names AND Email IN: emails ' +
                'AND Ping_Id__c !=null '));
    }
    @IsTest
    static void shouldSelectByClientId() {
        Test.startTest();
        SEL_Contacts.newInstance().selectByClientId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('AccountId IN: clientId'));
    }
    @IsTest
    static void shouldSelectByOnboardAppId() {
        Test.startTest();
        SEL_Contacts.newInstance().selectByOnboardAppId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN (SELECT Authorised_Person__c FROM Application_Document__c WHERE '+
                'Onboarding_Application__c IN:onboardId and Document_Status__c=:statusPending)'));
    }
}