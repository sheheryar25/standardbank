/**
 * @description Test Class for AR_QuickLinks_CTRL
 * @author Maham Hassan
 * @since 12-04-2022
 */
@isTest
public with sharing class AR_QuickLinks_TEST {

    /**
     * 
     * @description Test method to retrieve quick links
     */
    @isTest
    public static void testQuickLinks() {
        Map<String, AR_Quick_Link__mdt> quickLinks = AR_Quick_Link__mdt.getAll();
        List<AR_QuickLinks_CTRL.AR_QuickLinks> qLinks = AR_QuickLinks_CTRL.getQuickLinks();
        System.assertEquals(quickLinks.size() + 1, qLinks.size(), 'Quick Links items should be 1 greater than size of AR Quick Links metadata.');
    }

    /**
     * 
     * @description Test method to retrieve sector resources
     */
    @isTest
    public static void testSectorResources() {
        Map<String, Sector_Resource__mdt> sectorResourcesList = Sector_Resource__mdt.getAll();
        List<AR_QuickLinks_CTRL.AR_QuickLinks> secResources = AR_QuickLinks_CTRL.getSectorResources();
        System.assertEquals(sectorResourcesList.size(), secResources.size(), 'Sector Resources items should be equal to size of Sector Resource metadata.');
    }
}