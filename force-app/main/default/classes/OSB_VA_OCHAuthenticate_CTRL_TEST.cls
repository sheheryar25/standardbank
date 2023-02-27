/**
 * Test class for OSB_VA_OCHAuthenticate_CTRL
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
@IsTest
public with sharing class OSB_VA_OCHAuthenticate_CTRL_TEST {

    @IsTest
    public static void testNoTokenRequestError() {
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(500, 'Error', null, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{
                null
        });
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(System.Label.OSB_VA_BA_TechnicalErrorSingle, outputs.get(0).errorMessage);
        System.assertEquals(null, outputs.get(0).refreshToken);
        System.assertEquals(null, outputs.get(0).accessToken);
        System.assertEquals(true, outputs.get(0).hasError);
    }

    @IsTest
    public static void testNoTokenResponseError() {
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(400, 'Bad Request', '', null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{null});
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(System.Label.OSB_VA_BA_TechnicalErrorSingle, outputs.get(0).errorMessage);
        System.assertEquals(null, outputs.get(0).refreshToken);
        System.assertEquals(null, outputs.get(0).accessToken);
        System.assertEquals(true, outputs.get(0).hasError);
    }

    @IsTest
    public static void testNoTokenSuccess() {
        String responseBody = '{"access_token":"B684723E8E51DD98FA6BBF83BBBEA462D5342E84","refresh_token":"19C0030231692F4744475F1B921A253EBDE1FFE3","token_type":"bearer","expires_in":20}';
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(200, 'OK', responseBody, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{
                null
        });
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(null, outputs.get(0).errorMessage);
        System.assertEquals('19C0030231692F4744475F1B921A253EBDE1FFE3', outputs.get(0).refreshToken);
        System.assertEquals('B684723E8E51DD98FA6BBF83BBBEA462D5342E84', outputs.get(0).accessToken);
    }

    @IsTest
    public static void testUseNotExpiredTokenSuccess() {
        DCS_API_Token__c accessToken = new DCS_API_Token__c(Name='OCH Token');
        accessToken.Access_Token__c = 'AccessToken';
        accessToken.Refresh_Token__c = 'RefreshToken';
        accessToken.Created_Time__c = String.valueOf(Datetime.now().getTime());
        insert accessToken;
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{
                null
        });
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(null, outputs.get(0).errorMessage);
        System.assertEquals(accessToken.Refresh_Token__c, outputs.get(0).refreshToken);
        System.assertEquals(accessToken.Access_Token__c, outputs.get(0).accessToken);
    }

    @IsTest
    public static void testUseRefreshTokenSuccess() {
        String responseBody = '{"access_token":"C784723E8E51DD98FA6BBF83BBBEA462D5342E84","refresh_token":"19C0030231692F4744475F1B921A253EBDE1FFE3","token_type":"bearer","expires_in":20}';
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(200, 'OK', responseBody, null);
        DCS_API_Token__c accessToken = new DCS_API_Token__c(Name='OCH Token');
        accessToken.Access_Token__c = 'AccessToken';
        accessToken.Refresh_Token__c = 'RefreshToken';
        accessToken.Created_Time__c = String.valueOf(Datetime.now().addMinutes(-11).getTime());
        insert accessToken;
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{
                null
        });
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(null, outputs.get(0).errorMessage);
        System.assertEquals('19C0030231692F4744475F1B921A253EBDE1FFE3', outputs.get(0).refreshToken);
        System.assertEquals('C784723E8E51DD98FA6BBF83BBBEA462D5342E84', outputs.get(0).accessToken);
    }

    @IsTest
    public static void testNoValidInput() {
        String responseBody = '{"access_token":"C784723E8E51DD98FA6BBF83BBBEA462D5342E84","refresh_token":"19C0030231692F4744475F1B921A253EBDE1FFE3","token_type":"bearer","expires_in":20}';
        OSB_VA_HttpCalloutMock calloutMock = new OSB_VA_HttpCalloutMock(200, 'OK', responseBody, null);
        Test.setMock(HttpCalloutMock.class, calloutMock);
        Test.startTest();
        List<OSB_VA_OCHAuthenticate_CTRL.OCHTokenOutput> outputs = OSB_VA_OCHAuthenticate_CTRL.authenticate(new List<String>{
                null
        });
        Test.stopTest();
        System.assertEquals(1, outputs.size(), 'Should return 1 output');
        System.assertEquals(null, outputs.get(0).errorMessage);
        System.assertEquals('19C0030231692F4744475F1B921A253EBDE1FFE3', outputs.get(0).refreshToken);
        System.assertEquals('C784723E8E51DD98FA6BBF83BBBEA462D5342E84', outputs.get(0).accessToken);
    }
}