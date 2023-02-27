/**
 * Test class for SEL_CampaignMemberHosts
 *
 * @author Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date June 2020
 */
@IsTest (IsParallel = true)
private class SEL_CampaignMemberHosts_TEST {

    @IsTest
    static void selectByMember() {
        SEL_CampaignMemberHosts.newInstance().selectByMember(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('Member__c IN :memberIds'));
    }

}