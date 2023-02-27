@isTest
public class OSB_VA_RequestFactory_TEST
{
    @isTest
    public static void testiTrackPayRequest()
    {
        test.startTest();
        HttpRequest iTrackPayRequest = OSB_VA_RequestFactory.createiTrackPaySearchRequest('SOME_TRANSACTION_NUMBER', 'Transaction');
        test.stopTest();
        System.assert(iTrackPayRequest.getEndpoint().contains('SOME_TRANSACTION_NUMBER'));
    }
    
    @isTest
    public static void testSwiftRequest()
    {
        test.startTest();
        HttpRequest swiftRequest = OSB_VA_RequestFactory.createSwiftGPIPaymentTrackingRequest('THIS_IS_THE_UETR');
        test.stopTest();
        
        System.assert(swiftRequest.getEndpoint().contains('THIS_IS_THE_UETR'));
    }
}