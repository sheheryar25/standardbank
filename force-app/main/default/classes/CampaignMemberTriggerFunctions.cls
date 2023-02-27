/*****************************************************************************************************\
    @ Func Area     : Campaign, Campaign Members
    @ Author        : Rudolf Niehaus
    @ Date          : 11/2011
    @ Test File     : Test Method TestCampaignMemberTrigger.cls
    @ Description   : Case# 1168 : General Campaign Members functions class invoked by triggers
                    
                    Functions in this class:
                    ========================
                    
                    1 - setContactRecordType() Function that updates the record type field on the Campaignmembers object
                        to the related Contact record type. 
                    --------------------------------------- 
                    2 - validateRecordLock() Function that will prevent a user from adding / deleting a new Campaign member
                        if the LockCampaign__c flag for a Campaign = true
                    ---------------------------------------
                    Below three functions adds, updates and deletes records in the junction object
                    Campaign_Member_Host__c. This object holds the relationship between
                    Campaign memebers (Client Contacts), Hosts (Bank Contacts) and the campaign they 
                    belong to
                    3 - updateMemberHostObject()
                    4 - deleteFromMemberHostObject() [Also del all hosts linked to this member]
                    5 - addToMemberHostObject()
                    ---------------------------------------
                    6 - sendErrorMail() Function that sends an email to the CRM production support
                        team when an exception was thrown. Email address gets retrived from the 
                        custom settings Environment_Variable__c 
                    ---------------------------------------
                    7 - validateMemberType() Function that validates if the member is a lead or contact. If
                    contact then valid = true else valid = false
                    ---------------------------------------     
 -------------------------------------------------------------------------------------------------------------------------------------   
    @ Func Area         : Campaign, Campaign Members, Campaign Member Hosts
    @ Last Modified By  : Rudolf Niehaus
    @ Last Modified On  : 03/2012 
    @ Modification Description : Case# 5276:
                                 - Add additional member fields to the Junction object "Campaign member hosts" for reproting purposes
                                 - Change the error message description when a campaign is locked 
                                 
    @ Modification Description : API Version moved from 24 to 25  
                                 Case #6521- Change contact to use TestFatcory       
                                                     
--------------------------------------------------------------------------------------------------------------------------------------
 -------------------------------------------------------------------------------------------------------------------------------------   
    @ Func Area         : Campaign, Campaign Members, Campaign Member Hosts
    @ Last Modified By  : Nikhita Reddy
    @ Last Modified On  : 01/2013 
    @ Modification Description : EN- 0011:
                                 - Error Message in CampaignMemberTriggerFunctions class put in a custom setting.
                                 - Exception handling for dml operations. 
                                 - Check the list size before any dml operation.
                                 - Changed the API from 25 to 27
--------------------------------------------------------------------------------------------------------------------------------------
   
******************************************************************************************************/
public class CampaignMemberTriggerFunctions {

    private List < CampaignMember > memberList = new List < CampaignMember > ();
    private Set < Id > contactIds = new Set < Id > ();
    private Set < Id > campIds = new Set < Id > ();
    private Id campID;
    private Id leadID;
    private Set < Id > memberIds = new Set < Id > ();
    private Map < Id, CampaignMember > memberMap = new Map < Id, CampaignMember > ();
    private Environment_Variable__c settings = null;
    private String SupportEmailAddress = '';
    public static final String POCKET_RSVP_PARAM_NAME = 'PocketRsvp_User';

    //Class constructor. Take trigger body (new or old) as argument
    public CampaignMemberTriggerFunctions(List < CampaignMember > cmem) {

        System.debug('BIG5: Trigger Functions Constructure' + cmem.size() + '----' + cmem);

        //Pass trigger body to list
        this.memberList = cmem;
        system.debug('------------------'+ this.memberList);
        if (memberList.size() > 0) {
            System.debug('BIG5: Get campain ID for members ' + memberList[0].CampaignId);
            campID = memberList[0].CampaignId;
            leadID = memberList[0].LeadId;
        }

        //Get CRM Production support email address from custom settings in order to email
        //error messages
        this.settings = Environment_Variable__c.getInstance();
        this.SupportEmailAddress = settings.CRM_Production_Support__c;


        System.debug('BIG5: Loop through campaign member trigger body to get all the related IDs');
        //Loop through trigger body to populate Various collection objects
        for (CampaignMember cm: this.memberList) {
            contactIds.add(cm.ContactId);
            campIds.add(cm.CampaignId);
            memberIds.add(cm.Id);
            memberMap.put(cm.CampaignId, cm);
        }
        system.debug('----size---' + memberMap.size() +'--------membermapcreated--------' + memberMap);
    }

    //Below three functions, adds, updates and deletes records in the junction object
    //Campaign_Member_Host__c. This object holds the relationship between
    //Campaign memebers (Client Contacts), Hosts (Bank Contacts) and the campaign they
    //belong to
    //-------------------------------------------------
    // 1
    public void addToMemberHostObject() {

        List < Campaign_Member_Host__c > cmhList = new List < Campaign_Member_Host__c > ();

        for (CampaignMember cm: this.memberList) {
            Campaign_Member_Host__c cmh = new Campaign_Member_Host__c();

            cmh.Campaign__c = cm.CampaignId;
            cmh.Member__c = cm.ContactId;
            cmh.Member_Status__c = cm.Status;
            cmh.Member_Id__c = cm.Id;
            cmh.Campaign_Wave__c = cm.Campaign_Wave__c;
            //Case#5276:New Fields for reporting
            cmh.Attendance_Status__c = cm.Attendance_Status__c;
            cmh.Contact_Record_Type__c = cm.Contact_Record_Type__c;
            cmh.Date_Responded__c = cm.Date_Responded__c;
            cmh.Responded__c = cm.HasResponded;
            cmhList.add(cmh);
        }

        try {
            if (cmhList.size() > 0) {
                Database.saveresult[] s = Database.insert(cmhList, false);

            }
        } catch (DMLException ex) {
            sendErrorMail('DML Exception on Campaign_Member_Host__c INSERT : ' + ex.getMessage());
        }
    }
    // 2
    public void updateMemberHostObject() {

        List < Campaign_Member_Host__c > memberHostList = [Select Id, Member__c, Member_Status__c From Campaign_Member_Host__c Where Member__c IN: contactIds AND Campaign__c = : campID];
        Map < Id, Campaign_Member_Host__c > memberHostMap = new Map < Id, Campaign_Member_Host__c > ();

        if (memberHostList.size() > 0) {
            for (Integer x = 0; x < memberHostList.size(); x++) {
                memberHostMap.put(memberHostList[x].Member__c, memberHostList[x]);
            }
            for (CampaignMember cm: this.memberList) {

                if (memberHostMap.containsKey(cm.ContactId)) {
                    memberHostMap.get(cm.ContactId).Campaign_Wave__c = cm.Campaign_Wave__c;
                    memberHostMap.get(cm.ContactId).Member_Status__c = cm.Status;
                    //Case#5276: Additional reporting fields
                    memberHostMap.get(cm.ContactId).Attendance_Status__c = cm.Attendance_Status__c;
                    memberHostMap.get(cm.ContactId).Contact_Record_Type__c = cm.Contact_Record_Type__c;
                    memberHostMap.get(cm.ContactId).Date_Responded__c = cm.Date_Responded__c;
                    memberHostMap.get(cm.ContactId).Responded__c = cm.HasResponded;
                }
            }

            try {
                if (memberHostMap.values().size() > 0) {
                    Database.saveresult[] s = Database.update(memberHostMap.values(), false);
                }
            } catch (DMLException ex) {
                sendErrorMail('DML Exception on Campaign_Member_Host__c UPDATE : ' + ex.getMessage());
            }
        }

    }
    // 3
    public void deleteFromMemberHostObject() {
        List < Campaign_Member_Host__c > memberHostList = [Select Id From Campaign_Member_Host__c Where Member__c IN: contactIds AND Campaign__c = : campID];

        Set < Id > hostIds = new Set < Id > ();
        hostIds = al.SetUtils.objectToID(al.SetUtils.listToSet(al.ArrayUtils.pluck(memberHostList, 'Id')));

        List < Campaign_Hosts__c > hostList = [Select Id From Campaign_Hosts__c Where Id IN: hostIds];

        try {
            if (hostList.size() > 0) {
                Database.DeleteResult[] sr = Database.delete(hostList, false);
            }
            if (memberHostList.size() > 0) {
                Database.DeleteResult[] sr = Database.delete(memberHostList, false);
            }
        } catch (DMLException ex) {
            sendErrorMail('DML Exception on Campaign_Member_Host__c DELETE : ' + ex.getMessage());
        }

        //update campaigns with new host count
        set < Id > campids = new set < Id > ();
        campids.add(campID);
        CampaignHostsTriggerFunctions.recalculateHostCount(campids);

    }
    //------------------------------------------------------------------------------------------

    //Function that updates the record type field on the Campaignmembers object
    //to the related Contact record type.
    public void setContactRecordType() {
        Map < Id, Contact > contactMap = new Map < Id, Contact > ([Select Id, RecordType.Name From Contact Where Id IN: contactIds]);

        for (CampaignMember cm: this.memberList) {
            cm.Contact_Record_Type__c = contactMap.get(cm.ContactId).RecordType.Name;
        }
    }
    //Function that validates if the member is a lead or contact. If
    //contact then its a valid member
    public Boolean validateMemberType() {

        if (leadID == null) {
            return true;
        } else {
            return false;
        }

    }

    //Function that will prevent a user from adding, deleting or updating a new Campaign member
    //if the LockCampaign__c flag for a Campaign = true
    public void validateRecordLock() {

        List < Campaign > camp = [Select Id, Lock_Campaign__c From Campaign Where Id IN: campIds];
        Map<String,boolean> campLockMap = new Map<String,boolean>();

        for(Campaign cam : camp)
            campLockMap.put(cam.id, cam.Lock_Campaign__c);


        for(CampaignMember mem :memberList ){
            if(campLockMap.containsKey(mem.CampaignId)){
                if(campLockMap.get(mem.CampaignId) == true && UserInfo.getName() != SB_Parameters__c.getValues(POCKET_RSVP_PARAM_NAME).Value__c){
                    mem.addError(ErrorMessages__c.getValues('Campaign Locked').Error_String__c);
                }
            }
        }

        /*  System.debug('BIG5: Call validate Campaign Lock function');
          List < Campaign > camp = [Select Id, Lock_Campaign__c From Campaign Where Id IN: campIds];
          System.debug('BIG5: Loop through campaign list to check which once are locked');
          system.debug('Value of the Camp' + camp.size() + '----------------' +camp);
          for (Campaign c: camp) {
              if (c.Lock_Campaign__c) {
                  System.debug('BIG5: Campaign is Locked' + c.Lock_Campaign__c + '  ' + c.Id);
                  System.debug('BIG5: Add Error msg to member ' + memberMap.get(c.Id).Id);
                  system.debug('-----Value---------' + memberMap);
                  system.debug('-------Campaign Id----------' + memberMap.get(c.Id));
                  memberMap.get(c.Id).addError(ErrorMessages__c.getValues('Campaign Locked').Error_String__c);
              }
          } */
    }

    //Function that sends an email to the CRM production support
    //team when an exception was thrown. Email address gets retrived from the 
    //custom settings Environment_Variable__c                   
    public void sendErrorMail(String msg) {

        if (SupportEmailAddress == null) {
            SupportEmailAddress = 'test@test.co.za';
        }
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {
                SupportEmailAddress
        };
        mail.setToAddresses(toAddresses);
        mail.setSenderDisplayName('Apex Error in : ' + UserInfo.getOrganizationName());
        mail.setSubject('Apex Error related to Campaign Members');
        mail.setPlainTextBody('Error in Class: CampaignMemberTriggerFunctions\n' + msg);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {
                mail
        });
    }

}