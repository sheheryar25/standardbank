/**
 *
 * Controller class with logic invoked from the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
@SuppressWarnings('PMD.CognitiveComplexity')
public with sharing class OSB_VA_CustomerIdentifier_CTRL {

    private static List<Log__c> logs = new List<Log__c>();
    private static Map<GetCustomerIdentifierInput, Log__c> input2Log = new Map<GetCustomerIdentifierInput, Log__c>();
    private static List<GetCustomerIdentifierOutput> customerIdentifierOutputs = new List<OSB_VA_CustomerIdentifier_CTRL.GetCustomerIdentifierOutput>();

    public enum OCHGetCustomerIdentifierError {
        HTTP_REQUEST_SEND_ERROR, HTTP_RESPONSE_ERROR, NO_ACCOUNT_FOUND_ERROR
    }

    public static final Map<OCHGetCustomerIdentifierError, String> ERROR_2_ERROR_MESSAGE = new Map<OCHGetCustomerIdentifierError, String>{
            OCHGetCustomerIdentifierError.HTTP_REQUEST_SEND_ERROR => System.Label.OSB_VA_BA_TechnicalErrorSingle,
            OCHGetCustomerIdentifierError.HTTP_RESPONSE_ERROR => System.Label.OSB_VA_BA_TechnicalErrorSingle,
            OCHGetCustomerIdentifierError.NO_ACCOUNT_FOUND_ERROR => System.Label.OSB_VA_NoAccountsFound
    };

    /**
     * DTO class with parameters to get the customer identifier from OCH
     */
    public class GetCustomerIdentifierInput {
        @InvocableVariable
        public String clientName;
        @InvocableVariable
        public String contactId;
        @InvocableVariable
        public String accessToken;
    }

    /**
     * DTO class for output with customer identifier fetching result
     */
    public class GetCustomerIdentifierOutput {
        @InvocableVariable
        public String customerIdentifier;
        @InvocableVariable
        public Boolean hasError;
        @InvocableVariable
        public String errorType;
        @InvocableVariable
        public String errorMessage;
        @InvocableVariable
        public String actionType;
        @InvocableVariable
        public String errorLogId;
    }

    /**
     * Invocable method for getting customer identifier from OCH
     *
     * @param inputs List<GetCustomerIdentifierInput>
     *
     * @return List<GetCustomerIdentifierOutput>
     */
    @InvocableMethod(Label='VA get customer identifier')
    public static List<GetCustomerIdentifierOutput> getCustomerIdentifier(List<GetCustomerIdentifierInput> inputs) {
        logs = new List<Log__c>();
        input2Log = new Map<OSB_VA_CustomerIdentifier_CTRL.GetCustomerIdentifierInput, Log__c>();
        customerIdentifierOutputs = new List<OSB_VA_CustomerIdentifier_CTRL.GetCustomerIdentifierOutput>();
        SEL_FinancialAccounts selector = SEL_FinancialAccounts.newInstance();
        Set<String> clientNames = new Set<String>();
        Map<String, String> clientName2AccountNumber = new Map<String, String>();
        for (GetCustomerIdentifierInput input : inputs) {
            clientNames.add(input.clientName);
        }
        List<Financial_Account__c> finAccounts = selector.selectByClientNames(clientNames);
        for (Financial_Account__c finAccount : finAccounts) {
            if (clientName2AccountNumber.get(finAccount.External_Id__c) == null) {
                clientName2AccountNumber.put(finAccount.Client__r.Name, finAccount.External_Id__c);
            }
        }
        for (GetCustomerIdentifierInput input : inputs) {
            GetCustomerIdentifierOutput output = new GetCustomerIdentifierOutput();
            HttpResponse response = queryOCH(output, clientName2AccountNumber.get(input.clientName), input.accessToken, input);
            if (response == null) {
                continue;
            }
            Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> responseData = (List<Object>) responseBody.get('data');
            if (responseData == null || responseData.size() == 0) {
                handleOutputError(output, OCHGetCustomerIdentifierError.NO_ACCOUNT_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION);
                continue;
            }
            String customerIdentifier = (String) ((Map<String, Object>) (responseData.get(0))).get('custId');
            if (customerIdentifier == null) {
                handleOutputError(output, OCHGetCustomerIdentifierError.NO_ACCOUNT_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION);
                continue;
            }
            output.customerIdentifier = customerIdentifier;
            customerIdentifierOutputs.add(output);
        }
        handleLogs(inputs);
        return customerIdentifierOutputs;
    }

    private static HttpResponse queryOch(GetCustomerIdentifierOutput output, String accountNumber, String accessToken, GetCustomerIdentifierInput input) {
        HttpResponse response;
        try {
            response = OSB_SRV_BotBalanceViewHandler.queryOCHForAccountDetails(accountNumber, accessToken);
            if (response.getStatusCode() != 200) {
                if (response.getStatusCode() == 404) {
                    handleOutputError(output, OCHGetCustomerIdentifierError.NO_ACCOUNT_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_NO_BALANCE_FOUND);
                } else {
                    throw new CalloutException('Response from OCH was returned with status code: ' + String.valueOf(response.getStatusCode()));
                }
                return null;
            }
        } catch (Exception ex) {
            Log__c errorLog = new Log__c(Stack_trace__c = ex.getStackTraceString(), Message__c = ex.getMessage(), Area__c = 'OneHub', Type__c = 'Error', Context_User__c = UserInfo.getUserId());
            input2Log.put(input, errorLog);
            logs.add(errorLog);
            handleOutputError(output, OCHGetCustomerIdentifierError.HTTP_REQUEST_SEND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION);
            return null;
        }
        return response;
    }

    private static void handleOutputError(GetCustomerIdentifierOutput outputMsg, OCHGetCustomerIdentifierError errorType, String actionType) {
        outputMsg.hasError = true;
        outputMsg.errorType = errorType.name();
        outputMsg.errorMessage = ERROR_2_ERROR_MESSAGE.get(errorType);
        outputMsg.actionType = actionType;
        customerIdentifierOutputs.add(outputMsg);
    }

    private static void handleLogs(List<GetCustomerIdentifierInput> inputs) {
        if (!logs.isEmpty()) {
            insert logs;
            Integer i = 0;
            while (i < inputs.size()) {
                GetCustomerIdentifierInput input = inputs.get(i);
                Log__c log = input2Log.get(input);
                if (log != null) {
                    GetCustomerIdentifierOutput output = customerIdentifierOutputs.get(i);
                    output.errorLogId = log.Id;
                }
                i += 1;
            }
        }
    }
}