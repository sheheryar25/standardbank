/**
 * Field Selector Layer
 * 
 * @author Salesforce
 *
 * @date Oct 29th 2021
 */
public with sharing class SEL_AOBScreen extends fflib_SObjectSelector {
    private static Set<String> fields=new Set<String>{'AOB_Title__c','AOB_subTitle__c','AOB_TitleApplicationField__c'};
	
    /**
     * getSObjectFieldList
     * @return List<Schema.SObjectField>
     */
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
                AOB_FlowScreen__c.Name,
                AOB_FlowScreen__c.Id,
                AOB_FlowScreen__c.AOB_Title__c,
                AOB_FlowScreen__c.AOB_TitleApplicationField__c
        };
    }

    /**
     * selectById
     * @return Schema.SObjectType
     */
    public Schema.SObjectType getSObjectType() {
        return AOB_FlowScreen__c.sObjectType;
    }

	/**
	 * @description Creates a new instance of the selector via the application class. This is here to allow unit tests to override
	 * and inject a mock instead of this class or to switch out this class for a new version.
	 * @return SEL_AOBScreen
	 */
	public static SEL_AOBScreen newInstance() {
		return(SEL_AOBScreen) ORG_Application.selector.newInstance(AOB_FlowScreen__c.SObjectType);
	}
    /**
     * Select without conditions
     *
     * @return List<AOB_FlowScreen__c>
     */
    public List<AOB_FlowScreen__c> selectWithoutCondition() {
        return (List<AOB_FlowScreen__c>) Database.query(
                newQueryFactory()
                        .toSOQL()
        );
    }
    
    /**
     * Select by section
     * @param screenName String
     * @return List<AOB_FlowScreen__c>
     */
    public List<AOB_FlowScreen__c> selectFieldsByName(String screenName) {
        fflib_QueryFactory fieldQueryFactory = newQueryFactory(false, false, false);
		fieldQueryFactory.setCondition('Name = :screenName');
		fieldQueryFactory.selectFields(fields);  

        return Database.query(fieldQueryFactory.toSOQL());
        
    }
    
}