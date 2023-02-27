/**
 *
 * Controller class with logic invoked from the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
public with sharing class OSB_VA_OCHAuthenticate_CTRL {

    private static final String ACCESS_TOKEN = 'access_token';
    private static final String REFRESH_TOKEN = 'refresh_token';
    private static final Long TEN_MINUTES = 10 * 60 * 1000;
    private static final Long FIFTEEN_MINUTES = 15 * 60 * 1000;

    /**
     * DTO class with the result of getting authentication token for OCH API
     */
    public class OCHTokenOutput {
        @InvocableVariable
        public String accessToken;
        @InvocableVariable
        public String refreshToken;
        @InvocableVariable
        public String accessTokenCreatedTime;
        @InvocableVariable
        public Boolean hasError;
        @InvocableVariable
        public String errorMessage;
        @InvocableVariable
        public String actionType;
        @InvocableVariable
        public String errorLogId;
    }

    /**
     * Method to get the authentication token for the OCH API
     *
     * @param inputs List<String> inputs - inputs are there to conform to InvocableMethod requirements
     *
     * @return List<OCHTokenOutput>
     */
    @InvocableMethod(Label='VA OCH authenticate')
    public static List<OCHTokenOutput> authenticate(List<String> inputs) {
        List<OCHTokenOutput> result = new List<OCHTokenOutput>();
        OCHTokenOutput output = queryOCH();

        for (Integer i = 0; i < inputs.size(); i++) {
            result.add(output);
        }
        return result;
    }

    private static OCHTokenOutput queryOCH() {
        OCHTokenOutput output = new OCHTokenOutput();
        DCS_API_Token__c accessToken = DCS_API_Token__c.getInstance('OCH Token');
        if(accessToken == null){
            accessToken = new DCS_API_Token__c(Name = 'OCH Token');
        }
        Long now = Datetime.now().getTime();
        try {
            if (accessToken == null || accessToken.Created_Time__c == null || Long.valueOf(accessToken.Created_Time__c) + FIFTEEN_MINUTES < now) {
                HttpResponse response = OSB_SRV_BotBalanceViewHandler.queryOCHForAccessToken();
                parseOCHAuthenticateResponse(output, response.getBody(), accessToken);
            } else  {
                if (Long.valueOf(accessToken.Created_Time__c) + TEN_MINUTES < now) {
                    HttpResponse response = OSB_SRV_BotBalanceViewHandler.queryOCHForRefreshToken(accessToken.Refresh_Token__c);
                    parseOCHAuthenticateResponse(output, response.getBody(), accessToken);
                } else {
                    output.accessToken = accessToken.Access_Token__c;
                    output.refreshToken = accessToken.Refresh_Token__c;
                    output.accessTokenCreatedTime = accessToken.Created_Time__c;
                }
            }
        } catch (Exception ex) {
            Log__c errorLog = new Log__c(Stack_trace__c = ex.getStackTraceString(), Message__c = ex.getMessage(), Area__c = 'OneHub', Type__c = 'Error', Context_User__c = UserInfo.getUserId());
            insert errorLog;
            output.errorLogId = errorLog.Id;
            output.actionType = OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION;
            output.hasError = true;
            output.errorMessage = System.Label.OSB_VA_BA_TechnicalErrorSingle;
        }
        return output;
    }

    private static void parseOCHAuthenticateResponse(OCHTokenOutput output, String responseBody, DCS_API_Token__c accessToken) {
        Map<String, Object> parsedResponse = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
        output.accessToken = (String) parsedResponse.get('access_token');
        output.refreshToken = (String) parsedResponse.get('refresh_token');
        output.accessTokenCreatedTime = String.valueOf(Datetime.now().getTime());
        accessToken.Access_Token__c = (String) parsedResponse.get('access_token');
        accessToken.Refresh_Token__c = (String) parsedResponse.get('refresh_token');
        accessToken.Created_Time__c = String.valueOf(Datetime.now().getTime());
        upsert accessToken;
    }
}