/**
 * Service class that retrieves data from Gateway API.
 * US-1463
 *
 * @author Maria Pszonka (mpszonka@deloittece.com)
 * @date August 2020
 */
public with sharing class PBB_SRV_GatewayAPI_GetTransactions implements IService {

    private static final SRV_Logger loggerService = (SRV_Logger) SRV_Logger.newInstance();
    private static final SRV_HttpRequestSender.IService httpService = SRV_HttpRequestSender.newInstance();
    private static final PBB_SRV_GatewayRequestProvider.IService requestProviderService = PBB_SRV_GatewayRequestProvider.newInstance();

    private static final String URL_GET_PROACT_ROLLUP_TRANSACTIONS = '/proact-rollup-transaction-details/rollup-transactions';
    private static final String URL_GET_PROACT_NARRATIVE_TRANSACTIONS = '/proact-narrative-transaction-details/narrative-transactions';

    public interface IService {
        List<RollUpTransactionData> fetchRollUpTransactionsData(Id clientId);
        List<NarrativeTransactionData> fetchNarrativeTransactionsData(Id clientId);
    }

    public static IService newInstance() {
        return (IService) ORG_Application.service.newInstance(IService.class);
    }

    /**
     * Method retrieves rollup transactions from the Gateway Proact API.
     * US-1463
     *
     * @param clientId: Client id for which the data will be retrieved.     *
     * @return list of raw rollup transactions data for the given client.
     */
    public List<RollUpTransactionData> fetchRollUpTransactionsData(Id clientId) {

        Account client = getClientRecord(clientId);

        HttpRequest request = buildCallRequest();
        request.setEndpoint('callout:gatewaynp' + URL_GET_PROACT_ROLLUP_TRANSACTIONS);
        request.setMethod('POST');
        request.setBody(JSON.serialize(new ProactRequestBody(Uuid.formatValue(client.GUID__c))));
        List<RollUpTransactionData> rollUpTransactions = new List<RollUpTransactionData>();
        HttpResponse response = httpService.send(request, 5);

        if (response.getStatusCode() == 200 && !String.isBlank(response.getBody())) {
            rollUpTransactions = (List<RollUpTransactionData>) JSON.deserialize(response.getBody(), List<RollUpTransactionData>.class);
            return rollUpTransactions;
        } else if (response.getStatusCode() == 204 || String.isBlank(response.getBody())) {
            return null;
        } else {
            throw new ApiException(String.format('Error! For client {0} Got {1} with {2}, body {3}', new List<String>{
                    clientId, String.valueOf(response.getStatusCode()), response.getStatus(), response.getBody()
            }));
        }
    }

    /**
     * Method retrieves narrative transaction from the proact api.
     * US-1463
     *
     * @param clientId: Client id for which the data will be retrieved.
     * @return list of raw narrative transactions data for the given client.
     */
    public List<NarrativeTransactionData> fetchNarrativeTransactionsData(Id clientId) {

        Account client = getClientRecord(clientId);

        HttpRequest request = buildCallRequest();
        request.setEndpoint('callout:gatewaynp' + URL_GET_PROACT_NARRATIVE_TRANSACTIONS);
        request.setMethod('POST');
        request.setBody(JSON.serialize(new ProactRequestBody(Uuid.formatValue(client.GUID__c))));

        List<NarrativeTransactionData> narrativeTransactions = new List<NarrativeTransactionData>();
        HttpResponse response = httpService.send(request, 5);

        if (response.getStatusCode() == 200 && !String.isBlank(response.getBody())) {
            narrativeTransactions = (List<NarrativeTransactionData>) JSON.deserialize(response.getBody(), List<NarrativeTransactionData>.class);
            return narrativeTransactions;
        } else if (response.getStatusCode() == 204 || String.isBlank(response.getBody())) {
            return null;
        } else {
            throw new ApiException(String.format('Error! For client {0} Got {1} with {2}, body {3}', new List<String>{
                    clientId, String.valueOf(response.getStatusCode()), response.getStatus(), response.getBody()
            }));
        }
    }

    private Account getClientRecord(Id clientId) {

        List<Account> clients = SEL_Accounts.newInstance().selectGuidById(new Set<Id>{
                clientId
        });

        if (clients.isEmpty() || clients[0].GUID__c == null) {
            ApiException ex = new ApiException('Error, client ' + clientId + ' does not exist or client does not have GUID number specified');
            throw ex;
        }

        return clients[0];
    }

    private HttpRequest buildCallRequest() {

        HttpRequest request = requestProviderService.getRequestWithToken();
        request.setHeader('Accept', 'application/json');
        request.setTimeout(20000);

        return request;
    }

    public class RollUpTransactionData {

        public String Period;
        public Integer Transaction_Count;
        public Decimal Account_OD_Limit;
        public Integer Flag_Pos_Trans_Amt;
        public Decimal Account_Balance;
        public String Acc_Type;
        public Decimal Transaction_Amount;
    }

    public class NarrativeTransactionData {

        public Integer Debtor_Creditor_Count;
        public String Debtor_Creditor;
        public Decimal Debtor_Creditor_Amount;
    }

    public class ApiException extends Exception {
    }

    public class ProactRequestBody {
        String PartnerGUID;
        public ProactRequestBody(String GUID) {
            this.PartnerGUID = GUID;
        }
    }
}