/**
 * APEX Class for AKILI Listview to perform differet insights actions
 * 
 * @author Vipeen Sarode
 * @date octomber 2021
 */
public with sharing class AKI_COMP_AkiliInsightsListviewController {
    /**
    * @description This method return the akili list view data based on multiple filter and search values
    * 
    * @param getInsightParamVal the parameter wrapper String 
    * 
    * @return List<Insight__c>
    */
    @AuraEnabled(cacheable=true)
     public static List<Insight__c> getInsightsData(String getInsightParamVal){ 

        ParamData paramVals = (ParamData) System.JSON.deserialize(getInsightParamVal, ParamData.class);
        
        List<Insight__c> insightList = new SEL_Insights().selectInsightsBySearchKey(paramVals.searchKey, paramVals.myInsightsSelected, paramVals.expiringSoonSelected, paramVals.snoozedInsightsSelected);
        
        return insightList;
    }
 
    /**
      * @description This method change the insight product specialist and send insight action detials to akili
      * 
      * @param  changepsParamVal  the parameter wrapper string 
      * 
      */
    @AuraEnabled
     public static void changeProdSpecialist(string changepsParamVal){

        ParamData paramVals = (ParamData) System.JSON.deserialize(changepsParamVal, ParamData.class);

        Insight__c insightRec = New Insight__c();

        insightRec.id = paramVals.recId;
        insightRec.ownerId = paramVals.psId;
        insightRec.Previous_Owner__c = paramVals.oldRecOwnerId;        

        WrapperShareRec shareWrap = New WrapperShareRec();
        shareWrap.insightRecId = paramVals.recId;
        shareWrap.oldRecOwnerId = paramVals.oldRecOwnerId;

        list<WrapperInsightActions> wrapperInsightActionsList = New list<WrapperInsightActions>();

        WrapperInsightActions instWrap = new WrapperInsightActions();
        instWrap.actionType = 'Owner Changed';
        instWrap.actionedUser = userInfo.getUserId();
        instWrap.insightId = paramVals.recId;
        instWrap.extleadId = paramVals.leadId;
        instWrap.wrapperShareRecData = shareWrap; 
        wrapperInsightActionsList.add(instWrap);    

        Map<string,Id> insertedActionMap = createInsightAction(wrapperInsightActionsList);

        for(WrapperInsightActions rec : wrapperInsightActionsList){
            rec.insightActId = insertedActionMap.get(rec.actionType);
        }


        Database.DmlOptions options = new Database.DmlOptions();
        options.emailHeader.triggerUserEmail = boolean.valueOf(paramVals.sendEmailOwnerChange);
        Database.SaveResult srRec = Database.update(insightRec, options);
        if(srRec.isSuccess()){
            String dataSet = JSON.serialize(wrapperInsightActionsList);
            if(wrapperInsightActionsList[0].actionType == 'Owner Changed'){
                shareInsightRecord(dataSet);
            }            
            aki_comp_FutureCreateInsightAction.createInsightActionSendFeedback(dataSet);
        }else{
            list<Insight_Action__c> insertedActions = New list<Insight_Action__c>();
            for (Id idInst : insertedActionMap.keyset()) {
                Insight_Action__c iaRecInst = new Insight_Action__c();
                iaRecInst.id = insertedActionMap.get(idInst);
                insertedActions.add(iaRecInst);
            }
            if (Schema.sObjectType.Insight_Action__c.isDeletable()) {
                delete insertedActions;
            }
        }
 
     }
 
     /**
      *  @description This method create opportunity based on user input and send insight action detials to akili
      * 
      * @param  createOpptyPramsVal  the parameter wrapper string 
      * 
      */
     @AuraEnabled
     public static void createOpportunity(String createOpptyPramsVal){
 
        ParamData paramVals = (ParamData) System.JSON.deserialize(createOpptyPramsVal, ParamData.class);
 
        Opportunity opp=new Opportunity();
        opp.Name=paramVals.coName;
        opp.Description=paramVals.coDescription;             
        if(paramVals.coClientId!=null){
            opp.AccountId=paramVals.coClientId;
        }
        opp.CloseDate=date.valueOF(paramVals.coCloseDate);
        opp.StageName='1 - Lead';
        opp.Lead_Source__c='Akili Insight';
        Database.SaveResult srRec = Database.insert(opp);

        if(srRec.isSuccess()){
            Insight__c ins = new Insight__c();            
            ins.id = paramVals.recId;
            ins.Opportunity__c=opp.Id;
            if (Schema.sObjectType.Insight__c.fields.Opportunity__c.isUpdateable()) {
                update ins;
            }

            list<WrapperInsightActions> wrapperInsightActionsList = New list<WrapperInsightActions>();

            WrapperInsightActions instWrap = new WrapperInsightActions();
            instWrap.actionType = 'Opportunity Created';
            instWrap.actionedUser = userInfo.getUserId();
            instWrap.insightId = paramVals.recId;
            instWrap.extleadId = paramVals.leadId;
            wrapperInsightActionsList.add(instWrap);    

            WrapperInsightActions instWrap1 = new WrapperInsightActions();
            instWrap1.actionType='Rating';
            instWrap1.insightStatus='Insight actioned';
            instWrap1.insightQuality='Please give me more';             
            instWrap1.actionedUser = userInfo.getUserId();
            instWrap1.insightId = paramVals.recId;
            instWrap1.extleadId = paramVals.leadId;            
            wrapperInsightActionsList.add(instWrap1);   

            Map<String,Id> insertedActionMap = createInsightAction(wrapperInsightActionsList);

            for(WrapperInsightActions rec : wrapperInsightActionsList){
                rec.insightActId = insertedActionMap.get(rec.actionType);
            }
          
            String dataSet = JSON.serialize(wrapperInsightActionsList);

            aki_comp_FutureCreateInsightAction.createInsightActionSendFeedback(dataSet);
        }
             
     }
 
     /**
      * @description This method will snooze and unsnooze insight and send insight action detials to akili
      * 
      * @param  snoozeInsightParamVal  the parameter wrapper string  
      * 
      */
     @AuraEnabled
     public static void snoozedInsights(String snoozeInsightParamVal){
 
         ParamData paramVals = (ParamData) System.JSON.deserialize(snoozeInsightParamVal, ParamData.class);
 
         Insight__c inst = new Insight__c();            
         inst.id = paramVals.recId;
         inst.Comment__c=paramVals.recComments;
         inst.Is_Snoozed__c = paramVals.isSnoozed;
         Database.SaveResult srRec = Database.update(inst);
 
         if(srRec.isSuccess()){
             list<WrapperInsightActions> wrapperInsightActionsList = New list<WrapperInsightActions>();
 
             WrapperInsightActions instWrap = new WrapperInsightActions();
             instWrap.actionType = 'Is Snoozed';
             instWrap.actionedUser = userInfo.getUserId();
             instWrap.insightId = paramVals.recId;
             instWrap.extleadId = paramVals.leadId;            
             instWrap.actionValue = paramVals.isSnoozed ? '1' : '0';            
             wrapperInsightActionsList.add(instWrap);  
             
             Map<String,Id> insertedActionMap = createInsightAction(wrapperInsightActionsList);
 
             for(WrapperInsightActions rec : wrapperInsightActionsList){
                 rec.insightActId = insertedActionMap.get(rec.actionType);
             }
             
             String dataSet = JSON.serialize(wrapperInsightActionsList);
 
             aki_comp_FutureCreateInsightAction.createInsightActionSendFeedback(dataSet);
 
         }
     }
 /**
      * @description  This method  create feedback insight action and send insight action detials to akili
      * 
      * @param   feedbackInsightVal  the parameter wrapper string 
      * 
      */
     @AuraEnabled
     public static void feedbackInsights(string feedbackInsightVal){

         ParamData paramVals = (ParamData) System.JSON.deserialize(feedbackInsightVal, ParamData.class);

         Insight__c inst = new Insight__c ();
         inst.id = paramVals.recId;
         inst.Is_Provided_Feedback__c=True;
         Database.SaveResult srRec = Database.update(inst);

 
         list<WrapperInsightActions> wrapperInsightActionsList = New list<WrapperInsightActions>();
 
         WrapperInsightActions instWrap = new WrapperInsightActions();
         instWrap.actionType = 'Rating';
         instWrap.actionedUser = userInfo.getUserId();
         instWrap.insightId = paramVals.recId;
         instWrap.extleadId = paramVals.leadId;
         instWrap.insightQuality = paramVals.insightQualityVal;
         instWrap.insightStatus = paramVals.insightStatusVal;
         wrapperInsightActionsList.add(instWrap); 
 
         Map<string,Id> insertedActionMap = createInsightAction(wrapperInsightActionsList);
 
         for(WrapperInsightActions rec : wrapperInsightActionsList){
             rec.insightActId = insertedActionMap.get(rec.actionType);
         }
         
         String dataSet = JSON.serialize(wrapperInsightActionsList);
 
         aki_comp_FutureCreateInsightAction.createInsightActionSendFeedback(dataSet);
 
     }
 
     /**
      *  @description This method will share insight with previous product specialist as insight transfer to new product specialist
      * 
      * @param   wrapperDetail detail insight record in string wrap format 
      * 
      */
     @future
     public static void shareInsightRecord(String wrapperDetail){
 
         List<aki_comp_AkiliInsightsListviewController.WrapperInsightActions> wrapInsightActionRecList = (List<aki_comp_AkiliInsightsListviewController.WrapperInsightActions>) System.JSON.deserialize(wrapperDetail, List<aki_comp_AkiliInsightsListviewController.WrapperInsightActions>.class);
         Insight__Share insightShare  = new Insight__Share();    
         insightShare.ParentId = wrapInsightActionRecList[0].wrapperShareRecData.insightRecId;            
         insightShare.UserOrGroupId = wrapInsightActionRecList[0].wrapperShareRecData.oldRecOwnerId;            
         insightShare.AccessLevel = 'Edit';            
         
         insightShare.RowCause = Schema.Insight__Share.RowCause.Manual;                     
         Database.SaveResult sr = Database.insert(insightShare,false);
    }
 
     /**
      *  @description This method create insight action based on insight action type
      * 
      * @param   wrapInsightActionRec detail insight record in string wrap format 
      * 
      * @return Map<string,Id>  map of insight action type and insight action id
      */
 public static Map<string,Id> createInsightAction(List<WrapperInsightActions> wrapInsightActionRec){ 
     Map<string,Id> typeActionIdMap = New Map<string,string>();
     list<Insight_Action__c> insightActList = New list<Insight_Action__c>();
     for(WrapperInsightActions rec : wrapInsightActionRec){
         Insight_Action__c iaRecInst = new Insight_Action__c();
         switch on rec.actionType {
             when 'Owner Changed' {		// when block 1
                 iaRecInst.Action_Type__c = rec.actionType;
                 iaRecInst.User__c = rec.actionedUser;
                 iaRecInst.Insight__c = rec.insightId;
             }
             when 'Opportunity Created' {		// when block 2
                 iaRecInst.Action_Type__c = rec.actionType;
                 iaRecInst.User__c = rec.actionedUser;
                 iaRecInst.Insight__c = rec.insightId;            
             }
             when 'Rating' {
                 iaRecInst.Action_Type__c = rec.actionType;
                 iaRecInst.User__c = rec.actionedUser;
                 iaRecInst.Insight__c = rec.insightId;
                 iaRecInst.Insight_Quality__c = rec.insightQuality;
                 iaRecInst.Insight_Status__c = rec.insightStatus;                
             }            
             when 'Is Snoozed' {
                 iaRecInst.Action_Type__c = rec.actionType;
                 iaRecInst.User__c = rec.actionedUser;
                 iaRecInst.Insight__c = rec.insightId;
             }
         }
         insightActList.add(iaRecInst);
     }
     if (Schema.sObjectType.Insight_Action__c.fields.Action_Type__c.isCreateable()) {
         insert insightActList;
     }
     
 
     for(Insight_Action__c rec : insightActList){
         typeActionIdMap.put(rec.Action_Type__c,rec.Id);
     }
     return typeActionIdMap;
 }
 
 /**
      *   @description   hold data of insight action opportunity and insight share details
      */
     
     public class WrapperInsightActions {
         public String insightActId {get; set;}
         public String opportunityId {get; set;}
         public String actionType {get; set;}
         public String insightId {get; set;}
         public String extleadId {get; set;}   
         public String actionValue {get; set;}                
         public String insightQuality {get; set;}
         public String insightStatus {get; set;}
         public String actionedUser {get; set;}
         public String createdByUser {get; set;}
         public WrapperShareRec wrapperShareRecData {get; set;}
        
         /**
         *@description This is the contructor method. When we create a new wrap object. We also set the all value to null;
         */
         public WrapperInsightActions() {
             insightActId = null;
             opportunityId  = null;
             actionType  = null;
             insightId  = null;
             extleadId = null;
             insightQuality = null;
             insightStatus  = null;
             actionedUser  = null;
             createdByUser  = null;
         }
     }
    /**
    * @description hold data of insight share details
    *
    */
     public class WrapperShareRec {
         public String insightRecId {get; set;}
         public String oldRecOwnerId {get; set;}        
  
         /**
         * @description This is the contructor method. When we create a new wrap object. We also set the all value to null;
         */
         public WrapperShareRec() {
             insightRecId  = null;
             oldRecOwnerId  = null;
         }
     }
     
    /**
    *@description hold data of insight parameters
    *
    */
     public class ParamData{
        public String searchKey;	
        public Boolean myInsightsSelected;
        public Boolean allInsightsSelected;
        public Boolean expiringSoonSelected;
        public Boolean snoozedInsightsSelected;

        //pram for change owner
        public String recId;	
        public String leadId;	
        public String psId;	
        public String oldRecOwnerId;	
        public String sendEmailOwnerChange;	

        //params for opportunity creation
        public String coClientId;	
        public String coName;	
        public String coDescription;	
        public String coCloseDate;
        
        //params for isSnooze
        public String recComments;
        public Boolean isSnoozed;

        //paramsfor Insight feedback
        public String insightStatusVal;	//Insight previously actioned
	    public String insightQualityVal;
     }
    
 }