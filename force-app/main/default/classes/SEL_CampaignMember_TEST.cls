/**
 * Test class for SEL_CampaignMember
 *
 * @author Sergio Moradas (The Cocktail)
 * @date October 2021
 */
@IsTest (IsParallel = true)
private class SEL_CampaignMember_TEST {

    @IsTest
    static void selectByCampaign() {
        SEL_CampaignMember.newInstance().selectByCampaign(new Set<Id>());
        fflib_QueryFactory result = fflib_QueryFactory.lastQueryFactory;
        System.assert(result.getCondition().containsIgnoreCase('CampaignId IN :campaignIds'));
    }

}