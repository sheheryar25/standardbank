/**
 *@description  API Class to get insight in salesforce insight object from akili datdabse
 * 
 * @author Vipeen Sarode
 * @date october 2021
 */
public with sharing class AKI_GetInsightFromAkili {
    /**
     * @description  This method make callout to get insight from akili insight
     */
    @future(callout=true)
    public static void makeWebserviceCallout(){
            
        String accsstokn = AKI_COMP_FutureCreateInsightAction.getAccessToken();

        AKILI_Insights_API__mdt insightGetInsights =new SEL_AkiliInsightApiMetadatas().selectInsightApiByDeveloperName('Get_Insights');
        HttpRequest request = new HttpRequest();
        request.setMethod('GET');

        request.setEndpoint(insightGetInsights.Endpoint__c);
        request.setHeader('Accept','application/json'); 

        request.setHeader('x-fapi-interaction-id',insightGetInsights.x_fapi_interaction_id__c); 
        request.setHeader('x-apigw-api-id',insightGetInsights.x_apigw_api_id__c); 
        request.setHeader('Authorization','Bearer '+accsstokn); 
        request.setHeader('x-client-certificate',insightGetInsights.Certificate_Key__c); 
        
        String utcTime = 'param_lastupdated='+String.valueOfGmt(System.now().addHours(-1));
         
        String apiType = insightGetInsights.x_api_type__c+'&'+utcTime;
        request.setHeader('x-api-type',apiType); 

        Http httpInst = new Http(); 
        HttpResponse response = new HttpResponse();
        response = httpInst.send(request);

        String resBody  = response.getBody();

        AkiliInsightAPIDataList obj = (AkiliInsightAPIDataList) System.JSON.deserialize(resBody, AkiliInsightAPIDataList.class);
        if(obj.leads != null){
            insertInsightsRecords(obj.leads);            
        }
    }

    /**
     * @description This method will insert all akili insight records return by akili engine
     *    
     * @param listObj
     */
    public static void insertInsightsRecords(List<AkiliInsightAPIDataWrap> listObj){


        //create map to link client with CIF number
        Map<String,id> clientAndCifNoMap = New Map<String,id>();
        set<String> cifNumber = New set<String>();
        for(AkiliInsightAPIDataWrap recInst : listObj){
            cifNumber.add(recInst.customercif);
        }
        
        List<Account> accountList = new SEL_Accounts().selectByCIFNumber(cifNumber);

        for(account accInst:accountList){
            clientAndCifNoMap.put(accInst.CIF__c,accInst.id);
        }

        List<Insight__c> insightList = New List<Insight__c>();

        for(AkiliInsightAPIDataWrap recInst : listObj){
            Insight__c insRec = New Insight__c();
            insRec.External_Lead_ID__c = recInst.leadid;
            insRec.Client__c = clientAndCifNoMap.get(recInst.customercif);
            if(recInst.clientcoordinatorid!=null){
                insRec.Client_Coordinator__c= recInst.clientcoordinatorid;
            }
            if(recInst.productspecialistid!=null){
                insRec.OwnerId= recInst.productspecialistid;
            }
            if(recInst.salesforceopportunityid!=null){
                insRec.OwnerId= recInst.salesforceopportunityid;
            }
            if(recInst.salesforceopportunityid!=null){
                insRec.Id= recInst.salesforceleadid;
            }
            insRec.Event_Date__c= date.valueOf(recInst.eventdate);
            insRec.Lead_Date__c= date.valueOf(recInst.leaddate);
            insRec.Expiry_Date__c= date.valueOf(recInst.expirydate);
            insRec.Category__c= recInst.category;
            insRec.Sub_Category__c= recInst.subcategory;
            insRec.Insight__c= recInst.insights;
            insRec.Next_Steps__c= recInst.nextbestaction;
            insRec.Is_Snoozed__c= recInst.issnoozed;
            insightList.add(insRec);
        }
       // upsert insightList External_Lead_ID__c;

        Schema.SObjectField ftoken = Insight__c.Fields.External_Lead_ID__c;
        Database.UpsertResult[] srList = Database.upsert(insightList,ftoken,false);
    }
    /**
     * @description wrapper class to hold list of records return by akili engine
     *     
     */
    public class AkiliInsightAPIDataList{
        public AkiliInsightAPIDataWrap[] leads;
    }
     /**
     * @description wrapper class to hold record return by akili engine
     *     
     */
    public class AkiliInsightAPIDataWrap {
        public String leadid {get; set;}	
        public String customercif {get; set;}	
        public String clientcoordinatorid {get; set;}	
        public String productspecialistid {get; set;}
        public String salesforceopportunityid {get; set;}
        public String salesforceleadid {get; set;}	
        public String eventdate {get; set;}	
        public String leaddate {get; set;}	
        public String expirydate {get; set;}
        public String opportunitycreatedtimestamp {get; set;}
        public String visibility {get; set;}	
        public String category {get; set;}	
        public String subcategory {get; set;}	
        public String insights {get; set;}
        public String nextbestaction {get; set;}
        public String insightstatus {get; set;}	
        public String insightquality {get; set;}	
        public String insightcreatedbyid {get; set;}	
        public String insightcreatedtimestamp {get; set;}	
        public boolean issnoozed {get; set;}	
        public string isexpired {get; set;}	
        public String lastupdatedtimestamp {get; set;}
       
        
    }
    
}