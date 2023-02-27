/**
* @description  : Test Class for Controller for Client Related Revenues LWC Component
* User Story : SFP-7470
*
* @author Michal Pesko (mpesko@deloittece.com)
* @date October 2021
*/
@IsTest
public with sharing class CRT_clientRelatedRevenues_CTRL_TEST {
    /**
    * @description  : Method to test getting related revenues
    */
    @IsTest
    public static void shouldGetRelatedRevenues() {
        RecordType crtRecordType = [
                SELECT Id, Name
                FROM RecordType
                WHERE Name = 'CRT Global Client Revenue'
        ];

        BLD_Account bldAccount = new BLD_Account().CIF('12345');
        bldAccount.commitWork();
        BLD_GlobalClientRevenue bldGlobalClientRevenue = new BLD_GlobalClientRevenue()
                .client(bldAccount).crtBookingCountry('testCountry')
                .crtDepartment('testDepartment')
                .recordTypeId(crtRecordType.Id);
        bldGlobalClientRevenue.commitWork();
        Test.startTest();
            List<CRT_clientRelatedRevenues_CTRL.DataTableWrapper> revenues = CRT_clientRelatedRevenues_CTRL.getRelatedRevenues(bldAccount.getRecordId());
        Test.stopTest();
        System.assertEquals(1, revenues.size());
        System.assertEquals('testCountry', revenues.get(0).bookingCountry);
        System.assertEquals('testDepartment', revenues.get(0).department);
    }
}