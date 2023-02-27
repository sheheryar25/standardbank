/**
 * Test class for SEL_Users
 *
 * @author Ayush Garg (ayusgarg@deloitte.com)
 * @date August 2020
 */
@IsTest(IsParallel=true)
private class SEL_Users_TEST {
    
    @IsTest
    static void shouldSelectByUserName() {
        Test.startTest();
        SEL_Users.newInstance().selectByUserName(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Username IN :userNames'));
    }

    @IsTest
    static void shouldSelectWithAeNumber() {
        Test.startTest();
        SEL_Users.newInstance().selectWithAeNumber();
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('AE_Number__c != null'));
    }
    
    @IsTest
    static void shouldSelectByContactId() {
        Test.startTest();
        SEL_Users.newInstance().selectByContactId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('ContactId IN :ids'));
    }

    @IsTest
    static void shouldselectByIsActiveAndProfileNameWoSharing() {
        Test.startTest();
        SEL_Users.newInstance().selectByIsActiveAndProfileNameWoSharing(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Profile.Name IN :profileNames'));
    }
    
    @IsTest
    static void shouldSelectByIdWoSharing() {
        Test.startTest();
        SEL_Users.newInstance().selectByIdWoSharing(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN :ids'));
    } 
    
    @IsTest
    static void shouldSelectByPingUUID() {
        Test.startTest();
        SEL_Users.newInstance().selectByPingUUID(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Ping_UUID__c IN: idSet'));
    }
    
    @IsTest
    static void shouldSelectByName() {
        Test.startTest();
        SEL_Users.newInstance().selectByName(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Name IN :names'));
    }
    
    @IsTest
    static void shouldSelectByEmail() {
        Test.startTest();
        SEL_Users.newInstance().selectByEmail(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Email IN :emails'));
    }
    
    @IsTest
    static void shouldSelectWithContactFieldsById() {
        Test.startTest();
        SEL_Users.newInstance().selectWithContactFieldsById(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id IN :ids'));
    }

    @IsTest
    static void selectByUserCIBGlobalAndEmail() {
        Test.startTest();
        SEL_Users.newInstance().selectByUserCIBGlobalAndEmail('' ,new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('User_CIB_Global_Area__c =: userCIBGlobal'));
    }
}