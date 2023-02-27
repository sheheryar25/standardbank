/**
 * 
 * @description Controller Class for AR Quick Links Component
 * @author Maham Hassan
 * @since 11-04-2022
 */
public with sharing class AR_QuickLinks_CTRL {
    /**
    * @description Returns list of AR quick links and Trade works
    * @return List<AR_QuickLinks>
    */
	@AuraEnabled
	public static List<AR_QuickLinks> getQuickLinks(){
        
        List<AR_QuickLinks> arQuickLinks = new List<AR_QuickLinks>();
        User userDetails = SEL_Users.newInstance().selectUsersWithProfileByIds(new Set<Id> {UserInfo.getUserId()}).get(0);

        Map<String, Trade_Club_works__mdt> tradeLinks = Trade_Club_works__mdt.getAll();
		for (Trade_Club_works__mdt tradeLink: tradeLinks.values()) {
            if (tradeLink.Country__c  == userDetails.Country) {
                AR_QuickLinks arQuickLink = new AR_QuickLinks();
                arQuickLink.link = 'http://' + tradeLink.URL_Link__c;
                arQuickLink.label = tradeLink.MasterLabel;
                arQuickLink.icon = 'utility:standard_objects';
                arQuickLinks.add(arQuickLink);
            }
		}        

        Map<String, AR_Quick_Link__mdt> quickLinks = AR_Quick_Link__mdt.getAll();
        for (AR_Quick_Link__mdt quickLink: quickLinks.values()) {
            if (quickLink.Show_for_Profile__c.contains(userDetails.Profile.Name)) {
                AR_QuickLinks arQuickLink = new AR_QuickLinks();
                arQuickLink.link = 'http://' + quickLink.Link__c;
                arQuickLink.label = quickLink.Label__c;
                arQuickLink.icon = quickLink.Icon__c.replace('#' , ':');
                arQuickLinks.add(arQuickLink);    
            }
        }
        return arQuickLinks;
	}


    /**
     * 
     * @description returns list of Sector Resources
     * @return  List of AR_QuickLinks
     */
    @AuraEnabled
    public static List<AR_QuickLinks> getSectorResources(){

        List<AR_QuickLinks> sectorResources = new List<AR_QuickLinks>();
        Map<String, Sector_Resource__mdt> sectorResourcesList = Sector_Resource__mdt.getAll();

        for (Sector_Resource__mdt secResource: sectorResourcesList.values()) {
            AR_QuickLinks sectorResource = new AR_QuickLinks();
            sectorResource.icon = secResource.Icon__c;
            sectorResource.label = secResource.Label__c;
            sectorResource.link = secResource.Link__c;
            sectorResources.add(sectorResource);
        }
        return sectorResources;
    }

    /**
     * 
     * @description Wrapper Class for Quick Links
     */
    public class AR_QuickLinks {
        @AuraEnabled
        public string link;
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string icon;
    }
}