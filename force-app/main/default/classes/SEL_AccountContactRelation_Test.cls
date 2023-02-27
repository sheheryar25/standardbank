/**
 * @description Selector test class for SEL_AccountContactRelation
 * @author		Emmanuel Mulea(Nocks)
 * @date		March 2022
 */
@isTest
public class SEL_AccountContactRelation_Test {
    @IsTest
    static void selectByClientId(){
        Test.startTest();
        SEL_AccountContactRelation.newInstance().selectByContactId(new Set<Id>());
        Test.stopTest();
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('ContactId IN: idSet'));
        
    }

}