/**
 * Mock class for AKILI Insights
 *
 * @author Vipeen Sarode
 * @date October 2021
 */
@isTest
public with sharing class AKI_GetInsights_TEST {
/**
 * Test method to cover get insight api
*/
    @isTest
    public static void getInsightsDataTest() {
        test.startTest();
        test.setMock(HTTPCalloutMock.class, new AKI_InsightsMock());
        AKI_ScheduleGetInsights sh = new AKI_ScheduleGetInsights();
        String cronStr = '0 0 23 * * ?'; 
        System.assert(cronStr != null,'cron string should not be null');
        system.schedule('Test Get Insight schedule', cronStr, sh); 
        test.stopTest();
    }

}