/**
 *
 * @author vipeen Sarode
 * @date 08 OCT 2021
 * @description Insight Selector Layer class.
 */
public with sharing class SEL_Insights extends fflib_SObjectSelector {
    
    /**
     * getSObjectFieldList
     * @return List<Schema.SObjectField>
     */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Insight__c.Id,
            Insight__c.Name, 
            Insight__c.Lead_Date__c,
            Insight__c.Expiry_Date__c, 
            Insight__c.Category__c, 
            Insight__c.External_Lead_ID__c, 
            Insight__c.Sub_Category__c, 
            Insight__c.Comment__c, 
            Insight__c.Event_Date__c, 
            Insight__c.Potential_Insight_Revenue__c, 
            Insight__c.Is_Snoozed__c, 
            Insight__c.Is_Expired__c, 
            Insight__c.Expiring_Soon__c, 
            Insight__c.Next_Steps__c, 
            Insight__c.Insight__c,  
            Insight__c.Client__c, 
            Insight__c.owner.id,
            Insight__c.Client_Coordinator__c,
            Insight__c.Is_Provided_Feedback__c
        };
    }

     /**
     * selectById
     * @return Schema.SObjectType
     */
    public Schema.SobjectType getSObjectType(){
        return Insight__c.SobjectType;
    }

    
    /**
     * selectInsightsBySearchKey
     * 
     * @param searchKey set of ids
     * @param myInsightsSelected 
     * @param expiringSoonSelected 
     * @param snoozedInsightsSelected
     * 
     * @return List<Insight__c>
     */
    public List<Insight__c> selectInsightsBySearchKey(String searchKey,Boolean myInsightsSelected,Boolean expiringSoonSelected,Boolean snoozedInsightsSelected) {
        String key;
        String condition = '';
        Id currentUserId = userInfo.getUserId();

        condition+= 'Opportunity__c = null';
        condition+= ' AND Is_Expired__c=false';
        if ( searchKey != null && searchKey != '' ) {
            key = '%' + searchKey + '%';
            condition += ' AND (Category__c LIKE :key OR Client__r.name LIKE :key)';
        }
        //add custome filter button action to condition
        if(myInsightsSelected){
            condition+= ' AND Is_Snoozed__c = false AND Is_Provided_Feedback__c=false AND(Client_Coordinator__c = :currentUserId OR OwnerId =:currentUserId)';
        }
        if(expiringSoonSelected){
            condition+= ' AND (Client_Coordinator__c = :currentUserId OR OwnerId =:currentUserId) AND (Expiry_Date__c = NEXT_N_Days:7 OR Expiry_Date__c =TODAY)';
        }
        if(snoozedInsightsSelected){
            condition+= ' AND Is_Snoozed__c = true AND (Client_Coordinator__c = :currentUserId OR OwnerId =:currentUserId)';
        }

        String query = newQueryFactory().
        selectField('Client__r.Name').
        selectField('Client__r.Client_Sector__c').
        selectField('Client__r.Description').
        selectField('owner.name').
        selectField('Client_Coordinator__r.name').
        setCondition(condition).
        setOrdering(Insight__c.Expiry_Date__c,fflib_QueryFactory.SortOrder.ascending).
        toSOQL();

        List<Insight__c> insightList = Database.query(query);        

       return insightList;

    }

}