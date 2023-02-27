/**
 * Test class for the OSB_RedirectReg_Ctrl class
 *
 * @author      Wayde Fagan (Wayde.Fagan@tetrad.co.za)
 * @date        April 2020
 */
@IsTest
public class OSB_RegistrationRequest_Ctrl_Test {

    private static String TEST_USER_NAME = 'test@testUser1324.com';

    @IsTest
    static void testSaveCase() {
     	Case regCase = (Case) new BLD_Case().setOSBData().suppliedEmail(TEST_USER_NAME).getRecord();
        Case result = OSB_RegistrationRequest_Ctrl.saveCase(regCase);
        System.assertEquals(result.SuppliedEmail,TEST_USER_NAME);
    }

    @IsTest
    static void testDecodeBase64String() {
        String base64String = 'dHJ1ZXx0cnVlfGZhbHNl';
        Test.startTest();
        base64String = OSB_RegistrationRequest_Ctrl.decodeBase64String(base64String);
        Test.stopTest();
        
        System.assertEquals('true|true|false',base64String);
    }

    @IsTest
    static void negativeTestDecodeBase64String() {
        String base64String = null; 
        Test.startTest();
        base64String = OSB_RegistrationRequest_Ctrl.decodeBase64String(base64String);
        Test.stopTest();

        System.assertEquals(null, base64String);
    }
}