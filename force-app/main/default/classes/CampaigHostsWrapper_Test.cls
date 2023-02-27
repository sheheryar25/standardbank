/*****************************************************************************************************\
    @ Author        : Rudolf Niehaus
    @ Date          : September 2011
    @ Description   : Test Class For CampaigHostsWrapper.cls         
                  
    @ Last Modified By  : Wayne Gray
    @ Last Modified On  : June 2012
    @ Modification Description : Move test methods into external class  
                                 Case #6521- Change contact to use TestFatcory
                                 
    @ Last Modified By  : Nitish Kumar
    @ Last Modified On  : Feb 2013
    @ Modification Description : Added best practices to the test class  
                                 EN : 31 - Used TestDataUtility Class
                                 API Version moved from 25 to 27
******************************************************************************************************/

@isTest(SeeAllData = False)
public class CampaigHostsWrapper_Test{

       /**
         * @author Nitish Kumar
         * @date 19/02/2013
         * @description Tests the functionality
         */

    public static testMethod void testCampaignHostWrapper() {

        CampaigHostsWrapper cw = new CampaigHostsWrapper(
            new Campaign_Member_Host__c(),
            new Set<String>{'a host'},
            new List<Campaign_Hosts__c> {new Campaign_Hosts__c()}
        );
        System.assertEquals(cw.checked,false);
        cw.checked = true;
        System.assertEquals(cw.checked,true);

        CampaigHostsWrapper cw2 = new CampaigHostsWrapper();
        System.assertEquals(cw2.checked,false);
        cw2.checked = true;
        System.assertEquals(cw2.checked,true);

    }
}