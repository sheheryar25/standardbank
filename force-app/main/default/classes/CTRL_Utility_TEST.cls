/**
* @description Test class for CTRL_Utility 
* @className CTRL_Utility_TEST
* @author purna.unnagiri@standardbank.co.za
* @lastModified 07/19/2022
*/

@isTest
public with sharing class CTRL_Utility_TEST {

    @isTest 
    public static void testAllMethods() {
        Test.startTest();       
        
        List<String> fieldList = new List<String>{'FirstName','LastName'};
        CTRL_Utility.isObjectAccessible('Contact', fieldList);  
        CTRL_Utility.isObjectCreatable('Contact', fieldList);
        CTRL_Utility.isObjectUpdatable('Contact', fieldList);
        CTRL_Utility.isObjectDeletable('Contact');
        String objLabel = CTRL_Utility.getObjectLabel('Contact');   
        CTRL_Utility.getMissingPermissionMsgForSingleObj('Contact');
        CTRL_Utility.getMissingPermissionMsgForMultipleObj(new List<String>{'Contact'});
        CTRL_Utility.isMultipleObjectDeletable(new List<String>{'Contact'});        
        
        System.assertEquals(objLabel , 'Contact');
        Test.stopTest();
    }
}