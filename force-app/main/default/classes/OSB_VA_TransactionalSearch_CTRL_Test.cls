@isTest
public class OSB_VA_TransactionalSearch_CTRL_Test
{
    public class SetMockSuccess implements HttpCalloutMock
    {
        public HttpResponse respond(HttpRequest req)
        {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"accountNumber":"9120001288138","uetr":"8cefea59-d1cc-41b9-8e47-c40298c10419","statusOriginBic":null,"direction":"OUT","amount":745.0,"status":"Completed","statusReason":"Credited","valueDate":"2021-09-27","timeReceived":"2021-09-27T09:17:38","statuses":[{"statusOriginatorBic":null,"currency":"USD","settlementAmount":745.0,"chargeAmtCny":"USD745.0","status":"In Progress","statusReason":"Unconfirmed","timeReceived":"2021-09-27T09:17:38"},{"statusOriginatorBic":null,"currency":"USD","settlementAmount":745.0,"chargeAmtCny":null,"status":"In Progress","statusReason":"Unconfirmed","timeReceived":"2021-09-27T09:17:38"},{"statusOriginatorBic":null,"currency":"USD","settlementAmount":745.0,"chargeAmtCny":"USD745.0","status":"In Progress","statusReason":"Unconfirmed","timeReceived":"2021-09-27T09:18:08"},{"statusOriginatorBic":"SBICUGK0XXX","currency":"USD","settlementAmount":745.0,"chargeAmtCny":"USD745,00","status":"On Hold","statusReason":"Waiting for funds","timeReceived":"2021-09-27T09:19:28"},{"statusOriginatorBic":"SBICUGK0XXX","currency":"USD","settlementAmount":745.0,"chargeAmtCny":"USD745,00","status":"Completed","statusReason":"Credited","timeReceived":"2021-09-27T09:30:10"}],"instructedAmount":745.0,"senderBic":"SBICTZT0XXX","receiverBic":"SBICUGK0XXX","paymentReference":"OT21270TZ0171140","deducts":[],"currency":"USD"}');
            res.setStatusCode(200);
            return res;
        }
    }
    
    public class SetMockNoContent implements HttpCalloutMock
    {
        public HttpResponse respond(HttpRequest req)
        {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('NO_CONTENT');
            res.setStatusCode(200);
            return res;
        }
    }

    @isTest
    public static void testCallSuccess()
    {
        Test.setMock(HttpCalloutMock.class, new SetMockSuccess());
        OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput tsi = new OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput();
        tsi.transactionNumber = 'OT21270TZ0171140';
        
        test.startTest();
        List<OSB_VA_TransactionalSearch_CTRL.TransactionSearchOutput> ltso = OSB_VA_TransactionalSearch_CTRL.getTransactions(new List<OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput>{tsi});
        test.stopTest();
        
        List<String> transactions = new List<String>();
        for(OSB_VA_TransactionalSearch_CTRL.TransactionSearchOutput tso : ltso)
        {
            transactions.add(tso.transactionNumber);
        }
        
        System.assert(transactions.contains('OT21270TZ0171140'));
    }
    
    @isTest
    public static void testCallNoContent()
    {
        Test.setMock(HttpCalloutMock.class, new SetMockNoContent());
        OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput tsi = new OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput();
        tsi.transactionNumber = 'OT21270TZ0171140';
        
        test.startTest();
        List<OSB_VA_TransactionalSearch_CTRL.TransactionSearchOutput> ltso = OSB_VA_TransactionalSearch_CTRL.getTransactions(new List<OSB_VA_TransactionalSearch_CTRL.TransactionsSearchInput>{tsi});
        test.stopTest();
        
        List<String> errorTypes = new List<String>();
        
        for(OSB_VA_TransactionalSearch_CTRL.TransactionSearchOutput tso : ltso)
        {
            errorTypes.add(tso.errorType);
        }
        
        System.assert(errorTypes.contains('TRANSACTION_REFERENCE_INVALID'));
    }
}