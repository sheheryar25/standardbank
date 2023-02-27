/**
* Class for generic form creation based on database records
*
* <p></p>
*
* @author Salesforce
*
* @date Oct 7th 2021
*/
public with sharing class AOB_CTRL_FormCreator {
    
    /**
    * gets a list of fields to be displayed based on screen and product
    * @param applicationId Id   - Id of the Community
    * @param screenName String  - Auth Provider user data describing the User to create
    * @return List<AOB_Field> 
    */
    @AuraEnabled
    public static AOB_DTO_Form getFields(Id applicationId,String screenName) {
        List<AOB_FlowScreen__c> screens = new SEL_AOBScreen().selectFieldsByName(screenName);
        AOB_DTO_Form form = new AOB_DTO_Form();
        //get apps
        List<AOB_Application__c> apps = getApps(screens,applicationId);
        //get form
        form.subTitle = getFormSubtitle(screens, apps);
        form.title=screens[0].AOB_title__c;
        List<AOB_DTO_Field> fields=new List<AOB_DTO_Field>();
        
        List<AOB_DTO_Section> sections=new List<AOB_DTO_Section>();
        Set<id> sectionIds=new Set<id>();
        AOB_DTO_Section jsSection;
        
        for(AOB_ScreenSection__c  section : new SEL_AOBSection().selectSectionsByScreenName(screenName)){
                                                 // set section infos
			jsSection = setSectionInfo(section);
			sections.add(jsSection); 
			sectionIds.add(section.id);                             
         }
        
        Map<id,List<AOB_DTO_Field>> sectionFields=new Map<id,List<AOB_DTO_Field>>();
        List<String> mriTables=new List<String>();
        for(AOB_Field__c  field: new SEL_AOBField().selectMRITables(sectionIds)){
            mriTables.add(field.AOB_MRITable__c );
        }
        
        Map<String, List<AOB_DTO_SelectOption>> refData = AOB_Utils.getAllPicklistEntriesCodes(mriTables);
        
        for(AOB_Field__c  field : new SEL_AOBField().selectFieldsBySection(sectionIds)){// where to be added to filter by screen
            AOB_DTO_Field jsField = new AOB_DTO_Field(field,apps);
            jsField.options=refData.get(field.AOB_MRITable__c);
            if(sectionFields.containsKey(field.AOB_Section__c)){
                sectionFields.get(field.AOB_Section__c).add(jsField);
            }
            else{
                sectionFields.put(field.AOB_Section__c,new List<AOB_DTO_Field>{jsField});
            }
        }
        for(AOB_DTO_Section section:sections){
            section.fields=sectionFields.get(section.identifier);
        }
        form.sections=sections;
        return form;
    }

    /**
    * gets a list of apps
    * @param    screens List<AOB_FlowScreen__c>    screens - all flow screens
    * @param    applicationId Id applicationId
    * @return List<AOB_Application__c> 
    */
    private static List<AOB_Application__c> getApps(List<AOB_FlowScreen__c> screens,Id applicationId){
        List<AOB_Application__c> apps;
        if(!screens.isEmpty()){
            if(String.isNotBlank(screens[0].AOB_TitleApplicationField__c) && screens[0].AOB_TitleApplicationField__c.toLowerCase()!='name'){
                apps=database.query('select id,name,'+screens[0].AOB_TitleApplicationField__c+' from AOB_Application__c where id=\''+applicationId+'\'');
            }else{
                apps=database.query('select id,name from AOB_Application__c where id=\''+applicationId+'\'');
            }
        }
        else{
            throw new AuraHandledException('Unable to find selected screen');
        }
        return apps;
    }

    /**
    * gets form subtitle
    * @param screens - all flow screens
    * @param apps - all flow apps
    * @return String
    */
    private static String getFormSubtitle(List<AOB_FlowScreen__c> screens, List<AOB_Application__c> apps){
        String formSub;
        if(String.isNotBlank(screens[0].AOB_subTitle__c) && screens[0].AOB_subTitle__c.contains('{####}') &&!apps.isEmpty()){
            formSub=screens[0].AOB_subTitle__c.replace('{####}',String.valueOf(apps[0].get(screens[0].AOB_TitleApplicationField__c)));
        }
        else if(String.isNotBlank(screens[0].AOB_subTitle__c) && screens[0].AOB_subTitle__c.contains('{##firstName##}') &&!apps.isEmpty()){
            formSub=screens[0].AOB_subTitle__c.replace('{##firstName##}',String.isBlank(UserInfo.getfirstName())?UserInfo.getlastName():UserInfo.getfirstName());
        }
        else{
            formSub=screens[0].AOB_subTitle__c;
        }
        return formSub;
    }
    

    /**
    * gets sections info
    * @param section - section info
    * @return String
    */
    private static AOB_DTO_Section setSectionInfo(AOB_ScreenSection__c section){
        AOB_DTO_Section sectionInfo;
        sectionInfo = new AOB_DTO_Section();
        sectionInfo.identifier=section.id;                               
        sectionInfo.title=section.AOB_Title__c;  
        sectionInfo.smallDeviceColumns=section.AOB_smallDeviceColumns__c;
        sectionInfo.mediumDeviceColumns=section.AOB_mediumDeviceColumns__c;
        sectionInfo.largeDeviceColumns=section.AOB_largeDeviceColumns__c;
        sectionInfo.rank=section.AOB_Rank__c;
        sectionInfo.gridClass='aob_form_input slds-col slds-m-top_small slds-small-size_1-of-'+sectionInfo.smallDeviceColumns+' slds-medium-size_1-of-'+sectionInfo.mediumDeviceColumns+' slds-large-size_1-of-'+sectionInfo.largeDeviceColumns;
        return sectionInfo;
    }

    
}