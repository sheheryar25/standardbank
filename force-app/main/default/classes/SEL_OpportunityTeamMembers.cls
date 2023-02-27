/**
 * @description Selector class for OpportunityTeamMember
 *
 * @author Konrad Bruszewski
 * @date July 2021
 */
public with sharing class SEL_OpportunityTeamMembers extends fflib_SObjectSelector {

    /**
     * Returns list of OpportunityTeamMember fields
     *
     * @return list of sobject's fields
     */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
                OpportunityTeamMember.Id,
                OpportunityTeamMember.IsActive__c,
                OpportunityTeamMember.Name,
                OpportunityTeamMember.OpportunityAccessLevel,
                OpportunityTeamMember.OpportunityId,
                OpportunityTeamMember.PhotoUrl,
                OpportunityTeamMember.TeamMemberRole,
                OpportunityTeamMember.Title,
                OpportunityTeamMember.User_Business_Unit__c,
                OpportunityTeamMember.User_CIB_Global_Area__c,
                OpportunityTeamMember.User_City__c,
                OpportunityTeamMember.User_Country__c,
                OpportunityTeamMember.User_Division__c,
                OpportunityTeamMember.User_Franco__c,
                OpportunityTeamMember.User_State__c,
                OpportunityTeamMember.User_Team__c,
                OpportunityTeamMember.UserId
        };
    }

    /**
     * Returns OpportunityTeamMember sobject type
     *
     * @return sobject type
     */
    public Schema.SObjectType getSObjectType() {
        return OpportunityTeamMember.SObjectType;
    }

    /**
     * Returns query locator for the given condition
     *
     * @param condition  String with query condition
     *
     * @return query locator
     */
    public String getQueryWithCustomCondition(String condition) {
        return newQueryFactory().setCondition(condition).toSOQL();
    }
}