/*****************************************************************************************************\
    @ Func Area     : Campaigns, Campaign Members and Member hosts.
    @ Author        : Rudolf Niehaus
    @ Date          : 02/2011
    @ Test File     : TestCampaignMemberHostController
    @ Description   : Case#1168
                      Controller class for the Visualforce pages CampaignMemberToExcel.page. The controller creates an Excel export file
                      per 2500 campaign members. The reason for this it to overcome the SF limits per visualforce page. 
   
    @ Last Modified By  :   Stephen Moore
    @ Last Modified On  :    25/04/2012
    @ Modification Description : remove preferred_language__c and replace it with sa_preferred_language__c
                             C-00003926 Delete Preferred Language (See line 51)
    
    @ Last Modified By  :   Rudolf niehaus
    @ Last Modified On  :   30/05/2012
    @ Modification Description : Defect for Case#6374. Update the ordering of members from desc to asc when the data are renderd to Excel.

* @description Added a property for bom
* SFP-3681
*
* @author Wayne Solomon
* @date Mar 2021
*/
public inherited sharing class CampaignExportController {
    public String bom {
        get {
            return '\uFEFF';
        }
        private set;
    }
    public Transient List<CampaigHostsWrapper> memberResultsExl {get;set;}
    public Transient List<Campaign_Member_Host__c> memhostList;
    public String currentId {get;set;}
    public Integer limitSize {get;set;}
    public Integer exportSize {get;set;}
    public String fileNo {get;set;}
    public String camName {get;set;}
    public Map<Id,Set<String>> hostMap = new Map<Id,Set<String>>();
    public Map<Id,List<Campaign_Hosts__c>> hostsMap = new Map<Id,List<Campaign_Hosts__c>>();
    private String memIds = '';
    private List<String> members = new List<String>();

    /**
   * Class constructor
   */
    public CampaignExportController(){
        currentId = ApexPages.currentPage().getParameters().get('campId');
        memIds = ApexPages.currentPage().getParameters().get(CampaignMemberHostController.PARAM_NAME_MEMBERS_IDS);
        fileNo = ApexPages.currentPage().getParameters().get('fileno');
        if(memIds.length() > 0){
            members = memIds.split('-');
        }
        exportSize = members.size();
    }

    /**
   * Export to Excel method.
   * @return null
   */
    public PageReference loadExl(){
		System.debug('## LoadExl strats');
		
        List<Campaign> camp = [Select Id, Name From Campaign Where Id =: currentId];
        camName = camp[0].Name;
		
        //Current readonly VF limit
        limitSize = 10000;
        
        System.debug('## Get all the members');
        String qry = 'Select Id, Attendance_Status__c, Member__r.Account.Actual_CY_Revenue__c, Member__r.Account.Client_Sector__c, Member__r.Account.Account_Owner__c, Member__r.Account.OwnerId, Member__r.CIF_Number__c,  Member__r.Account.CIB_Target_Client__c, Member__r.Client_Group_Parent__c, Member__r.Group_Parent_CIF_Number__c, Campaign_Wave__c, Member_Id__c,Member__c, Member__r.Shirt_Size__c, Member__r.Religion__c, Member__r.sa_Preferred_Language__c, Member__r.Phone, Member__r.Number_of_Children__c, Member__r.MobilePhone, Member__r.Golf_Handicap__c, Member__r.FAIS_Representative__c, Member__r.Disabilities__c, Member__r.Dietary_Requirements__c, Member__r.Contact_Category__c, Member__r.Allergies__c,Member__r.Name,Member__r.FirstName,Member__r.LastName, Member__r.Email, Member__r.Account.Name,Member__r.Title,Member_Status__c,Member__r.User_Division_Sync__c,Member__r.User_Business_Unit_Sync__c From Campaign_Member_Host__c Where Id IN : members AND Campaign__c = \'' + currentId + '\' order by Member__r.Name asc limit ' + limitSize;
        System.debug('SOQL = ' + qry);
              
        memhostList = Database.query(qry);
		
                
        Set<Id> memIds = new Set<Id>();
		
        for(Campaign_Member_Host__c mh : memhostList){
            
            memIds.add(mh.Id);        
        }
		
		
        List<Campaign_Hosts__c> hostList = [Select Id,Campaign_Member_Host__c, Bank_Contact__c , Bank_Contact__r.Name,Bank_Contact__r.FirstName, 
                                            Bank_Contact__r.LastName,Bank_Contact__r.User_Division_Sync__c,Bank_Contact__r.User_Business_Unit_Sync__c 
                                            From Campaign_Hosts__c 
                                            Where Campaign_Member_Host__c IN : memIds order by Campaign_Member_Host__c asc];

        
        Id memID = null;
        Set<String> hostNames = new Set<String>();
        List<Campaign_Hosts__c> hostsPerMem = new List<Campaign_Hosts__c>();
        
       
        for(Campaign_Hosts__c h : hostList){
			
            if(memID == h.Campaign_Member_Host__c || memID == null){
            	
                hostNames.add(h.Bank_Contact__r.Name);
               
                hostsPerMem.add(h);
                
                if(hostList.size() == 1){
                	
                    memID = h.Campaign_Member_Host__c;
                    
                    hostMap.put(memID, hostNames);
                   
                    hostsMap.put(memID,hostsPerMem);
                }
            }else{
                
                hostMap.put(memID, hostNames);
               
                hostsMap.put(memID,hostsPerMem);
                
                hostNames = new Set<String>();
                
                hostsPerMem = new List<Campaign_Hosts__c>();
               	
                hostNames.add(h.Bank_Contact__r.Name);
                
                hostsPerMem.add(h);
            }
            
            
            memID = h.Campaign_Member_Host__c;
           
        }
        
		
        hostMap.put(memID, hostNames);
       
        hostsMap.put(memID,hostsPerMem);
		
        memberResultsExl = new List<CampaigHostsWrapper>();
		
		 
        for(Campaign_Member_Host__c h : memhostList){
        	
           
            Set<String> contactNames = new Set<String>();
             
            List<Campaign_Hosts__c> linkedHosts = new List<Campaign_Hosts__c>();
             
            if(hostMap.containsKey(h.Id)){
                 
                contactNames = hostMap.get(h.Id);
               
                linkedHosts = hostsMap.get(h.Id);
            }else{
                 
                contactNames.add('None');
            }

            h.Member__r.Phone = getPhoneNumberWithLeadingZeros(h.Member__r.Phone);
            h.Member__r.MobilePhone = getPhoneNumberWithLeadingZeros(h.Member__r.MobilePhone);

            CampaigHostsWrapper cw = new CampaigHostsWrapper(h,contactNames,linkedHosts);
           
            memberResultsExl.add(cw);
        }

        hostMap.clear();
        hostsMap.clear();
        hostNames.clear();
        hostsPerMem.clear();
        
        return null;
    }

    private String getPhoneNumberWithLeadingZeros(String phoneNumber) {
        return String.isNotBlank(phoneNumber) ? '="' + phoneNumber + '"' : '';
    }
}