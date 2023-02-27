/**
 * Test class for SEL_Accounts
 *
 * @author Wayne Solomon
 * @date Aug 2020
 */
@IsTest
private class SEL_Accounts_TEST {
    @IsTest
    static void selectByCifWithSubmittedBusinessAssessmentsTest() {
        SEL_Accounts selector = new SEL_Accounts();
        Test.startTest();
        List<Account> methodOneOpps = selector.selectByCifWithSubmittedBusinessAssessments(new Set<String>{
                null
        }, 1);
        Test.stopTest();

        System.assert(methodOneOpps.isEmpty());
    }
    
    @IsTest
    static void shouldSelectByCIFNumberWithClientTeam(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByCIFNumberWithClientTeam(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('CIF__c in :cifSet'));
    }
    
    @IsTest
    static void shouldSelectByCIFNumber(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByCIFNumber(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('CIF__c in :cifSet'));
    }
        
    @IsTest
    static void shouldSelectByCIFNumberWithClientTeamAndRole(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByCIFNumberWithClientTeamAndRole(new Set<String>(),null);
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('CIF__c in :cifSet'));
    }
        
    @IsTest
    static void shouldSelectHierarchyByTopParentIdWithKYCStatus(){
        Test.startTest();
            SEL_Accounts.newInstance().selectHierarchyByTopParentIdWithKYCStatus(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id in :idSet or ParentId in :idSet OR Parent.ParentId in :idSet or Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.Parent.ParentId in :idSet or Parent.Parent.Parent.Parent.Parent.ParentId in :idSet'));
    }
        
    @IsTest
    static void shouldSelectTopParentIdByChildId(){
        Test.startTest();
            SEL_Accounts.newInstance().selectTopParentIdByChildId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id in :idSet'));
    }
        
    @IsTest
    static void shouldSelectByRegistrationNumber(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByRegistrationNumber(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Registration_Number__c in :registrationNumbers'));
    }
        
    @IsTest
    static void shouldSelectGuidById(){
        Test.startTest();
            SEL_Accounts.newInstance().selectGuidById(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id in :ids'));
    }
            
    @IsTest
    static void shouldSelectByRegisteredName(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByRegisteredName(new Set<String>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Name in :registeredNames'));
    }
            
    @IsTest
    static void shouldSelectBpidById(){
        Test.startTest();
            SEL_Accounts.newInstance().selectBpidById(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id in :ids'));
    }
            
    @IsTest
    static void shouldSelectByOwners(){
        Test.startTest();
            SEL_Accounts.newInstance().selectByOwners(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('OwnerId in :ownerIds'));
    }
                
    @IsTest
    static void shouldSelectAccountsWithOwnerRelByAccountId(){
        Test.startTest();
            SEL_Accounts.newInstance().selectAccountsWithOwnerRelByAccountId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Id in :ids'));
    }
                    
    @IsTest
    static void shouldselectWithoutCondition(){
        Test.startTest();
            SEL_Accounts.newInstance().selectWithoutCondition();
        Test.stopTest();
    }
                    
    @IsTest
    static void shouldselectById(){
        Test.startTest();
            SEL_Accounts.newInstance().selectById(new Set<Id>());
        Test.stopTest();
    }

}