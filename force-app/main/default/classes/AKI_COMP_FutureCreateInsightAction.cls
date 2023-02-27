/**
 * API Class for integration with AWS to create insight through IBM Datapower
 * 
 * @author Vipeen Sarode
 * @date october 2021
 * @description this class used to send different insight actions to akili
 */
public with sharing class AKI_COMP_FutureCreateInsightAction {

    
    /**
     * @description This method will create insight in akili
     * 
     * @param wrapperDetail wrap data to create insight actions
     * 
     */
    @future(callout=true)
    public static void createInsightActionSendFeedback(String wrapperDetail){

        List<AKI_COMP_AkiliInsightsListviewController.WrapperInsightActions> wrapInsightActionRecList = (List<AKI_COMP_AkiliInsightsListviewController.WrapperInsightActions>) System.JSON.deserialize(wrapperDetail, List<AKI_COMP_AkiliInsightsListviewController.WrapperInsightActions>.class);
                
        String reqBody = jsonGenerator(wrapInsightActionRecList);
            
        String accsstokn = getAccessToken();

        AKILI_Insights_API__mdt insightCreateInsAct =new SEL_AkiliInsightApiMetadatas().selectInsightApiByDeveloperName('Create_Insight_Actions');

        HttpRequest request = new HttpRequest();
        request.setMethod('POST');
        
        request.setEndpoint(insightCreateInsAct.Endpoint__c);
        request.setHeader('Accept','application/json'); 
        request.setHeader('x-fapi-interaction-id',insightCreateInsAct.x_fapi_interaction_id__c); 
        request.setHeader('x-apigw-api-id',insightCreateInsAct.x_apigw_api_id__c); 
        request.setHeader('Authorization','Bearer '+accsstokn); 
        request.setHeader('x-client-certificate',insightCreateInsAct.Certificate_Key__c); 
        request.setHeader('x-api-type',insightCreateInsAct.x_api_type__c); 
        request.setBody(reqBody);

        Http httpInst = new Http(); 
        HttpResponse response = new HttpResponse();
        response = httpInst.send(request);

    }

/**
     * @description This method will get authentication to create insight in akili
     * 
     * @return String 
     */
    public static String getAccessToken(){

        AKILI_Insights_API__mdt insightAuth = new SEL_AkiliInsightApiMetadatas().selectInsightApiByDeveloperName('Authentication');

        HttpRequest req = new HttpRequest();

        req.setEndpoint(insightAuth.Endpoint__c);
        req.setMethod('POST'); //Set HTTPRequest header properties 
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded'); 
        req.setHeader('Accept','Application/json'); 
        req.setHeader('x-ibm-client-id',insightAuth.Client_ID__c); 
        req.setHeader('x-ibm-client-secret',insightAuth.Client_Secret__c); 
        req.setHeader('x-client-certificate',insightAuth.Certificate_Key__c); 
        String body = 'grant_type='+insightAuth.Grant_Type__c+'&scope='+insightAuth.Scope__c;
        req.setBody(body);
        Http http = new Http(); 
        HttpResponse res = new HttpResponse();
        res = http.send(req);	//Helpful debug messages 
        Map<String, Object> updata=(Map<String, Object>)JSON.deserializeUntyped(res.getbody());
        return (String)updata.get('access_token');
    }

/**
     * @description This method will create the jsin body which needs to pass to create insight action api
     * 
     * @param wrapInsightActionRecList hold the wrapper data of insight actions
     * 
     * @return string of json
     */
    public static String jsonGenerator(List<AKI_COMP_AkiliInsightsListviewController.WrapperInsightActions> wrapInsightActionRecList){ 
        
        
        //generate JSON string need to passed 
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeFieldName('leadactions');
        gen.writeStartArray();
        for (AKI_COMP_AkiliInsightsListviewController.WrapperInsightActions wrapInsightActionRec : wrapInsightActionRecList) {                       
            gen.writeStartObject();

            gen.writeNumberField('param_leadid',Integer.valueOf(wrapInsightActionRec.extleadId));
            gen.writeStringField('param_salesforceactionid',wrapInsightActionRec.insightActId);
            gen.writeStringField('param_salesforceleadid',wrapInsightActionRec.insightId);

            gen.writeFieldName('param_salesforceopportunityid');
            gen.writeString(wrapInsightActionRec.opportunityId==Null ? 'null' : wrapInsightActionRec.opportunityId);

            gen.writeFieldName('param_actiontype');
            gen.writeString(wrapInsightActionRec.actionType==Null ? 'null' : wrapInsightActionRec.actionType);

            gen.writeFieldName('param_actionvalue');
            gen.writeString(wrapInsightActionRec.actionValue==Null ? 'null' : wrapInsightActionRec.actionValue);

            gen.writeFieldName('param_insightstatus');
            gen.writeString(wrapInsightActionRec.insightStatus==Null ? 'null' : wrapInsightActionRec.insightStatus);  
            
            gen.writeFieldName('param_insightquality');
            gen.writeString(wrapInsightActionRec.insightQuality==Null ? 'null' : wrapInsightActionRec.insightQuality); 
            
            gen.writeStringField('param_createdbysalesforceuserid',userInfo.getUserId());
            gen.writeEndObject();
        }
        gen.writeEndArray();
        gen.writeEndObject();

        String genString = gen.getAsString().replaceAll('\n','').replaceAll('\r','');
        
        return genString;
    }



}