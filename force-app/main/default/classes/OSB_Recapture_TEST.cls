/**
 * Test Class Class for OSB_Recapture
 * 
 * @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
 * @date August 2021
 * 
 */
@isTest
public class OSB_Recapture_TEST {
    private static final String TEST_STATUS_CODE = 'OK';
    private static final String TEST_BODY = '{ "success": true, "challenge_ts": "2021-08-15T10:10:54Z", "hostname": "onehubqa-standardbankgroupcommunity.cs160.force.com"}';
    private static final String TOKEN = 'fakeTojken1025541';
    
	@TestSetup
    static void setup() {
        List<SObject> customSettingsList = new List<SObject>();
       	OSB_URLs__c osbUrl = new OSB_URLs__c();
        osbUrl.Name = 'Google_Recapture_Endpoint';
        osbUrl.Value__c = 'callout:Google_recapture';
        customSettingsList.add(osbUrl);
        
        SB_Parameters__c sB = new SB_Parameters__c();
		sB.Name = 'OSB_RecaptureKey';
        sB.Value__c = '6LfzIM0bAAAAAGT4n5jmvs1Y_APs3UOFg74Q56sB';
        customSettingsList.add(sB);
        insert customSettingsList;
    }
    
    @isTest
    static void testCheckCapture(){
        Map<String, String> mockResponseHeaders = new Map<String, String>();
		Test.setMock(HttpCalloutMock.class, new SingleRequestMock(200, TEST_STATUS_CODE, TEST_BODY,mockResponseHeaders));
        
        Test.startTest();
        Boolean result = OSB_Recapture.checkRecapture(TOKEN);
        Test.stopTest();
        System.assertEquals(true, result);
    }
}