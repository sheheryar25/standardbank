/**
 *
 * Controller class with logic invoked from the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
public with sharing class OSB_VA_AccountSearch_CTRL {

    private static List<Log__c> logs = new List<Log__c>();
    private static Map<AccountSearchInput, Log__c> input2Log = new Map<AccountSearchInput, Log__c>();
    private static List<OSB_VA_AccountSearchOutput> result = new List<OSB_VA_AccountSearchOutput>();
    private static Map<String, Set<String>> contact2AccountNumbers = new Map<String, Set<String>>();
    private static Map<String, String> accountNumber2AccountName = new Map<String, String>();

    public enum OCH_AccountSearchError {
        HTTP_REQUEST_SEND_ERROR, HTTP_RESPONSE_ERROR, NO_ACCOUNTS_FOUND_ERROR
    }

    public static final Map<OCH_AccountSearchError, String> ERROR_2_ERROR_MESSAGE = new Map<OCH_AccountSearchError, String>{
            OCH_AccountSearchError.HTTP_REQUEST_SEND_ERROR => System.Label.OSB_VA_BA_TechnicalErrorSingle,
            OCH_AccountSearchError.HTTP_RESPONSE_ERROR => System.Label.OSB_VA_BA_TechnicalErrorSingle,
            OCH_AccountSearchError.NO_ACCOUNTS_FOUND_ERROR => System.Label.OSB_VA_BA_NoAccountsFound
    };

    /**
     * DTO class with params for account search
     */
    public class AccountSearchInput {
        @InvocableVariable
        public OSB_VA_Account_Types__mdt accountType;
        @InvocableVariable
        public String accessToken;
        @InvocableVariable
        public String contactId;
        @InvocableVariable
        public String customerIdentifier;
        @InvocableVariable
        public String serviceType;
    }

    /**
     * Invocable method for getting the bank accounts matching search criteria
     *
     * @param inputs List<AccountSearchInput>
     *
     * @return List<OSB_VA_AccountSearchOutput>
     */
    @InvocableMethod(Label='VA account search')
    public static List<OSB_VA_AccountSearchOutput> searchForAccounts(List<AccountSearchInput> inputs) {
        SEL_FinancialAccountPermissions selector = SEL_FinancialAccountPermissions.newInstance();
        Set<Id> contactIds = new Set<Id>();
        for (AccountSearchInput input : inputs) {
            contactIds.add(Id.valueOf(input.contactId));
        }
        List<Financial_Account_Permission__c> permissions = selector.selectActiveByAuthorizedPersonsWithClientNameAndAccountNumber(contactIds, inputs.get(0).serviceType);
        for (Financial_Account_Permission__c permission : permissions) {
            if (contact2AccountNumbers.get(permission.Authorized_Person__c) == null) {
                contact2AccountNumbers.put(permission.Authorized_Person__c, new Set<String>());
            }
            contact2AccountNumbers.get(permission.Authorized_Person__c).add(permission.Financial_Account__r.External_Id__c);
            if (accountNumber2AccountName.get(permission.Financial_Account__r.External_Id__c) == null) {
                accountNumber2AccountName.put(permission.Financial_Account__r.External_Id__c, permission.Financial_Account__r.Name);
            }
        }
        for (AccountSearchInput input : inputs) {
            OSB_VA_AccountSearchOutput output = new OSB_VA_AccountSearchOutput();
            HttpResponse response = queryOCH(output, input.customerIdentifier, input.accessToken, input);
            if (response == null) {
                continue;
            }
            parseOCHResponse(response.getBody(), output, input);
        }
        handleLogs(inputs);
        return result;
    }

    private static void parseOCHResponse(String responseBody, OSB_VA_AccountSearchOutput output, AccountSearchInput input) {
        Map<String, Object> respBody = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
        List<Object> respData = (List<Object>) respBody.get('data');
        if (respData == null || respData.size() == 0) {
            handleOutputError(output, OCH_AccountSearchError.NO_ACCOUNTS_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_NO_BALANCE_FOUND);
            return;
        }
        Map<String, Object> dataValue = (Map<String, Object>) respData.get(0);
        List<Object> accounts = (List<Object>) dataValue.get('resultList');
        if (accounts == null || accounts.size() == 0) {
            handleOutputError(output, OCH_AccountSearchError.NO_ACCOUNTS_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_NO_BALANCE_FOUND);
            return;
        }
        List<OSB_VA_AccountInfo> accountsInfo = new List<OSB_VA_AccountInfo>();
        for (Object account : accounts) {
            Map<String, Object> acc = (Map<String, Object>) account;
            String accountNumber = (String) acc.get('saledtls_Acctid');
            String accountType = (String) acc.get('saledtls_Channelcustid');
            String accountCurrency = (String) acc.get('saleChannelDtls_AcctCurrCode');
            String outputText = String.format('{0} {1} {2}', new List<Object>{
                    accountNumber, accountCurrency, input.accountType.Label
            });
            OSB_VA_AccountInfo accInfo = new OSB_VA_AccountInfo();
            accInfo.accountId = accountNumber;
            accInfo.outputText = outputText;
            if (input.accountType.Code__c == accountType && contact2AccountNumbers.get(input.contactId).contains(accountNumber)) {
                accountsInfo.add(accInfo);
            }
        }
        if (accountsInfo.isEmpty()) {
            handleOutputError(output, OCH_AccountSearchError.NO_ACCOUNTS_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_NO_BALANCE_FOUND);
            return;
        } else {
            OSB_VA_AccountInfo accountNotPresent = new OSB_VA_AccountInfo();
            accountNotPresent.outputText = System.Label.OSB_VA_Account_Not_Listed;
            accountsInfo.add(accountNotPresent);
        }
        output.hasError = false;
        output.accounts = accountsInfo;
        result.add(output);
    }

    private static HttpResponse queryOCH(OSB_VA_AccountSearchOutput output, String customerIdentifier, String accessToken, AccountSearchInput input) {
        HttpResponse response;
        try {
            response = OSB_SRV_BotBalanceViewHandler.queryOCHForAccountsList(customerIdentifier, accessToken);
            if (response.getStatusCode() != 200) {
                if (response.getStatusCode() == 404) {
                    handleOutputError(output, OCH_AccountSearchError.NO_ACCOUNTS_FOUND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_NO_BALANCE_FOUND);
                } else {
                    handleOutputError(output, OCH_AccountSearchError.HTTP_RESPONSE_ERROR, OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION);
                    throw new CalloutException('Response from OCH was returned with status code: ' + String.valueOf(response.getStatusCode()));
                }
                return null;
            }
        } catch (Exception ex) {
            Log__c errorLog = new Log__c(Stack_trace__c = ex.getStackTraceString(), Message__c = ex.getMessage(), Area__c = 'OneHub', Type__c = 'Error', Context_User__c = UserInfo.getUserId());
            input2Log.put(input, errorLog);
            logs.add(errorLog);
            handleOutputError(output, OCH_AccountSearchError.HTTP_REQUEST_SEND_ERROR, OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION);
            return null;
        }
        return response;
    }

    private static void handleOutputError(OSB_VA_AccountSearchOutput outputMsg, OCH_AccountSearchError errorType, String actionType) {
        outputMsg.hasError = true;
        outputMsg.errorType = errorType.name();
        outputMsg.errorOutPutMessage = ERROR_2_ERROR_MESSAGE.get(errorType);
        outputMsg.actionType = actionType;

        result.add(outputMsg);
    }

    private static void handleLogs(List<AccountSearchInput> inputs) {
        if (!logs.isEmpty()) {
            insert logs;
            Integer i = 0;
            while (i < inputs.size()) {
                AccountSearchInput input = inputs.get(i);
                Log__c log = input2Log.get(input);
                if (log != null) {
                    OSB_VA_AccountSearchOutput output = result.get(i);
                    output.errorLogId = log.Id;
                }
                i += 1;
            }
        }
    }
}