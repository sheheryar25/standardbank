/**
 * 
 * Service class for sending of Community (OneHub) emails
 *
 * @author Wayde Fagan (Wayde.fagan@tetrad.co.za)
 * @date July 2020
 */
public with sharing class OSB_SRV_EmailBuilder implements IService {

    public static final string OSB_MAIL_ENCRKEY = 'EMAIL_ENCR';

    private static final String ACCESS_APPROVED_DP_NP_EMAIL_TEMPLATE = 'OSBDpNpAccessApproved';
    private static final String ACCESS_APPROVED_EMAIL_TEMPLATE = 'OSBAccessApproved';
    private static final String ACCESS_DECLINED_DP_NP_EMAIL_TEMPLATE = 'OSBDpNpAccessDeclined';
    private static final String ACCESS_DECLINED_EMAIL_TEMPLATE = 'OSBAccessDeclined';
    private static final String ACCESS_MANAGER_PLACEHOLDER = 'OSB_ContactAccessManager';
    private static final String ACCESS_REINVITE_APPROVED_DP_NP_EMAIL_TEMPLATE = 'OSB_DpNp_WelcomeBackAccessApproved';
    private static final String ACCESS_REMOVED_EMAIL_TEMPLATE = 'OSBDpNpAccessRemoved';
    private static final String ACCESS_REQUIRED_EMAIL_TEMPLATE = 'OSBDpNpAccessRequired';
	private static final String AP_EMAIL_TEMPLATE = 'OSB_APEmail';
    private static final String SOLUTION_EMAIL_TEMPLATE = 'OSB_SolutionEmail';
    private static final String CUSTOM_INVITE_URL = 'OSB_OneSpace_Invite_Url';
    private static final String FIRST_NAME_PLACEHOLDER = 'OSB_FirstName';
    private static final String NP_DP_EMAIL_TEMPLATE = 'OSB_DPNPEmailInvite';
    private static final String NP_DP_REINVITE_EMAIL_TEMPLATE = 'OSB_DpNp_ReInvite';
    private static final String OSB_CUSTOM_SETTING_EMAIL_BANNER = 'OSB_EmailBanner';
    private static final String OSB_CUSTOM_SETTING_EMAIL_FOOTER = 'OSB_EmailFooter';
    private static final String OSB_CUSTOM_SETTING_EMAIL_ADDRESS = 'OSB_Email_Address';
    private static final String OSB_SERVLET_URL = '/servlet/servlet.ImageServer?id=';
    private static final String OSB_OID = '&oid=';
    private static final String OSB_CUSTOM_SETTING_BASE_URL = 'OSB_Base_URL';
    private static final String OSB_CUSTOM_SETTING_OSB_URL = 'OSB_Url';
    private static final String OSB_CUSTOM_SETTING_OSB_INVITE_URL = 'OSB_OneSpace_Invite_Url';
    private static final String OSB_RECORD_ID_PLACEHOLDER = 'OSB_RecordId';
    private static final String SIGNUP_CONFIRMATION_EMAIL_TEMPLATE = 'OSBDpNpSignUpConfirmation';
    private static final String OSB_SOLUTIONEMAIL = 'OSB_SolutionEmail';
    private static final String OSB_RELYCOMPLYSOLUTIONEMAIL = 'OSB_RelyComplySolutionEmail';
	private static final String OSB_FIDEMSOLUTIONEMAIL = 'OSB_FiDEMSolutionEmail';
 	private static final String FIDEM = 'FIdEM';    
    private static final String AUTHENTIFI = 'Authentifi';
    private static final String RELYCOMPLY = 'RelyComply';
    @TestVisible private static final String OSB_EMAIL_BANNER_IMAGE_NAME = 'OSB_Email_Banner_Image';
    @TestVisible private static final String OSB_EMAIL_FOOTER_IMAGE_NAME = 'OSB_Email_Footer_Image';

    public static IService newInstance() {
        return (IService) ORG_Application.service.newInstance(IService.class);
    }

    public interface IService {
        List<Messaging.SingleEmailMessage> createApAccessApprovedEmail(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createApAccessDeclinedEmail(List<Contact> contacts);
		List<Messaging.SingleEmailMessage> createCommunityEmailAP(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createCommunityEmailDP_NP(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createCommunityReinviteEmailDP_NP(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createDpNpAccessApprovedEmail(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createDpNpAccessDeclinedEmail(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createDpNpAccessRemovedEmail(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createDpNpReinviteAccessApprovedEmail(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createSignUpEmails(List<Contact> contacts);
        List<Messaging.SingleEmailMessage> createCommunitySolutionEmail(List<Contact> contacts,String solutionName);
    }

    /**
     * Creates the invite email for Ap contact
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage>createCommunityEmailAP(List<Contact> contacts) {
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();  
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(AP_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        List <String> contactEmails;
        String htmlBody;
        
        for(Contact contact: contacts){
            contactEmails = new List <String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_INVITE_URL, OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_INVITE_URL).Value__c);
            
            String encryptedId = OSB_SRV_EncryptionHelper.encryptString(contact.Id, OSB_MAIL_ENCRKEY);
            htmlBody = htmlBody.replace(OSB_RECORD_ID_PLACEHOLDER, encryptedId);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }
        
        return mails;
    }
    
    /**
     * Creates the invite email for Ap contact
     *
     * @param contacts List<Contact> List of Objects of type Contact
     * @param solutionName Solution name to send email to
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createCommunitySolutionEmail (List<Contact> contacts,String solutionName) {
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        String namePlaceholder = 'OSB_Name';
        String emailPlaceholder = 'OSB_Email';
        String phonePlaceholder = 'OSB_Phone';
        String companyPlaceholder = 'OSB_company';
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(SOLUTION_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        List <String> contactEmails; 
        String htmlBody;
        for(Contact contact: contacts){
            contactEmails = new List <String>();
            if(solutionName == AUTHENTIFI){
                contactEmails.add(OSB_URLs__c.getValues(OSB_SOLUTIONEMAIL).Value__c);
            }else if(solutionName==RELYCOMPLY){
                contactEmails.add(OSB_URLs__c.getValues(OSB_RELYCOMPLYSOLUTIONEMAIL).Value__c);
            }else if(solutionName==FIDEM){
                contactEmails.add(OSB_URLs__c.getValues(OSB_FIDEMSOLUTIONEMAIL).Value__c);
            }
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(namePlaceholder, contact.FirstName +' '+ contact.LastName);
            htmlBody = htmlBody.replace(emailPlaceholder, contact.Email);
            htmlBody = htmlBody.replace(phonePlaceholder, contact.Phone);
            htmlBody = htmlBody.replace(companyPlaceholder, contact.Account.Name != null ? contact.Account.Name : '' );
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_INVITE_URL, OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_INVITE_URL).Value__c);
             
            mails.add(setupEmail(htmlBody, 'Registration request '+solutionName , contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }
        
        return mails;
    }
    
    /**
     * Creates the invite email for the Dp/NP
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createCommunityEmailDP_NP(List<Contact> contacts){       
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();  
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(NP_DP_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        List <String> contactEmails;
        String htmlBody;
        
        for(Contact contact: contacts){
            contactEmails = new List <String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_INVITE_URL, OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_INVITE_URL).Value__c);
            
            String encryptedId = OSB_SRV_EncryptionHelper.encryptString(contact.Id, OSB_MAIL_ENCRKEY);
            htmlBody = htmlBody.replace(OSB_RECORD_ID_PLACEHOLDER, encryptedId);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }
        return mails;         
    }
    
    /**
     * Creates email to be sent out to contact (DP/NP) whose access is awaiting approval
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createSignUpEmails(List<Contact> contacts){
        Map<Id, Contact> communityAccessManagers = getCommunityManagerIds(contacts);
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(SIGNUP_CONFIRMATION_EMAIL_TEMPLATE);
        EmailTemplate emailTemplateReinvite = UTL_EmailTemplate.getTemplate(ACCESS_REQUIRED_EMAIL_TEMPLATE);
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlTemplateReinviteMarkup = insertEmailImages(emailTemplateReinvite.Markup);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        Contact accessManager;
		List<String> contactEmails;
        String htmlBody;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
            mails.add(createReinviteInviterSignUpEmail(contact, htmlTemplateReinviteMarkup, emailTemplateReinvite.Subject, orgWideEmailAddressId, communityAccessManagers));
        }

        return mails;
    }
    
    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been declined
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createApAccessDeclinedEmail(List<Contact> contacts){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_DECLINED_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }

        return mails;
    }

    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been approved
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
	public List<Messaging.SingleEmailMessage> createApAccessApprovedEmail(List<Contact> contacts){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_APPROVED_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_URL,OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_URL).Value__c);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }

        return mails;
    }
    
    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been approved
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
	public List<Messaging.SingleEmailMessage> createDpNpAccessApprovedEmail(List<Contact> contacts){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_APPROVED_DP_NP_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_URL,OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_URL).Value__c);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }

        return mails;
    }
    
    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been approved
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
	public List<Messaging.SingleEmailMessage> createDpNpReinviteAccessApprovedEmail(List<Contact> contacts){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_REINVITE_APPROVED_DP_NP_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_URL, OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_URL).Value__c);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }

        return mails;
    }
    
    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been declined
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createDpNpAccessDeclinedEmail(List<Contact> contacts){
        Map<Id, Contact> communityAccessManagers = getCommunityManagerIds(contacts);
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_DECLINED_DP_NP_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        String accessManagerDetails;
        Contact accessManager;

        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            accessManager = communityAccessManagers.get(contact.OSB_Community_Access_Manager__c);
            accessManagerDetails = accessManager.FirstName + ' ' + accessManager.LastName;
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(ACCESS_MANAGER_PLACEHOLDER, accessManagerDetails);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }
        
        return mails;
    }
	
    /**
     * Creates email to be sent out to contact (DP/NP) whose access has been removed/deactivated
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createDpNpAccessRemovedEmail(List<Contact> contacts){
        Map<Id, Contact> communityAccessManagers = getCommunityManagerIds(contacts);
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>(); 
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(ACCESS_REMOVED_EMAIL_TEMPLATE);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlBody;
        List <String> contactEmails;
        String accessManagerDetails;
        Contact accessManager;
        
        for(Contact contact: contacts){
            contactEmails = new List<String>();
            contactEmails.add(contact.Email);
            
            accessManager = communityAccessManagers.get(contact.OSB_Community_Access_Manager__c);
            accessManagerDetails = accessManager.FirstName + ' ' + accessManager.LastName;
            
            htmlBody = htmlTemplateMarkup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(ACCESS_MANAGER_PLACEHOLDER, accessManagerDetails);
            
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
        }

        return mails;
    }

    /**
     * Creates the re-invite email for the nominated/designated persons
     *
     * @param contacts List<Contact> List of Objects of type Contact
     *
     * @return List of Messaging.SingleEmailMessage
     **/
    public List<Messaging.SingleEmailMessage> createCommunityReinviteEmailDP_NP(List<Contact> contacts){ 
        Map<Id, Contact> communityAccessManagers = getCommunityManagerIds(contacts);
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        EmailTemplate emailTemplate = UTL_EmailTemplate.getTemplate(NP_DP_REINVITE_EMAIL_TEMPLATE);
        EmailTemplate emailTemplateReinvite = UTL_EmailTemplate.getTemplate(ACCESS_REQUIRED_EMAIL_TEMPLATE);
        String htmlTemplateMarkup = insertEmailImages(emailtemplate.Markup);
        String htmlTemplateReinviteMarkup = insertEmailImages(emailTemplateReinvite.Markup);
        Id orgWideEmailAddressId = getOrgWideEmailAddressId();
        Contact accessManager;
        String htmlBody;
        List <String> contactEmails;

        for(Contact contact: contacts){
            htmlBody = htmlTemplateMarkup;
            contactEmails = new List <String>();
            accessManager = communityAccessManagers.get(contact.OSB_Community_Access_Manager__c);
            
            htmlBody = emailTemplate.Markup;
            htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
            htmlBody = htmlBody.replace(ACCESS_MANAGER_PLACEHOLDER, accessManager.FirstName + ' ' + accessManager.LastName);
            
            contactEmails.add(contact.Email);
            mails.add(setupEmail(htmlBody, emailTemplate.Subject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId));
            mails.add(createReinviteInviterSignUpEmail(contact, htmlTemplateReinviteMarkup, emailTemplateReinvite.Subject, orgWideEmailAddressId, communityAccessManagers));
        }

        return mails;
    }
    
    /**
     * Creates email to be sent out to contact (AP) when NP/DP has been reinvited
     *
     * @param Contact contact for reinvite
     * @param htmlBody htmlBody Email body in html format as a string
     * @param emailSubject email Subject as a string
     * @param orgWideEmailAddressId Id of Org Wide Email Address that will be used as from address
     * @param communityAccessManagers Map<Id, Contact> map of community acess managers
     *
     * @return Messaging.SingleEmailMessage
     **/
    private static Messaging.SingleEmailMessage createReinviteInviterSignUpEmail(Contact contact, String htmlBody, String emailSubject, Id orgWideEmailAddressId, Map<Id, Contact> communityAccessManagers){
    	List<String> contactEmails = new List<String>();
        Contact accessManager = communityAccessManagers.get(contact.OSB_Community_Access_Manager__c);
        
        contactEmails.add(accessManager.Email);
        
        htmlBody = htmlBody.replace(ACCESS_MANAGER_PLACEHOLDER, accessManager.FirstName);
        htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_OSB_URL, OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_OSB_URL).Value__c);
        htmlBody = htmlBody.replace(FIRST_NAME_PLACEHOLDER, contact.FirstName);
        
        Messaging.SingleEmailMessage mail = setupEmail(htmlBody, emailSubject, contact.Id, contactEmails,contact.AccountId, orgWideEmailAddressId);
        
        return mail;
    }
    
    /**
     * Setup values for email 
     *
     * @param htmlBody String htmlBody Email body in html format as a string
     * @param emailSubject String emailSubject email Subject as a string
     * @param contactId Id contactId contact Id
     * @param toAddresses List<String> List of addresses to which the email is being sent
     * @param whatId Id Id of record which task must be created against
     * @param orgWideEmailAddressId Id Id of Org Wide Email Address that will be used as from address
     *
     * @return Messaging.SingleEmailMessage generated email
     **/
    private static Messaging.SingleEmailMessage setupEmail(String htmlBody, String emailSubject, Id contactId, List<String> toAddresses, Id whatId, Id orgWideEmailAddressId){
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setHtmlBody(htmlBody);
        mail.setSubject(emailSubject);
        mail.setSaveAsActivity(true);
        mail.setTargetObjectId(contactId);
        mail.setTreatTargetObjectAsRecipient(false);
        mail.setToAddresses(toAddresses);
        mail.setWhatId(whatId); 
        mail.setOrgWideEmailAddressId(orgWideEmailAddressId);

        return mail;
    }
    
    private static Id getOrgWideEmailAddressId(){
        OrgWideEmailAddress oneHubEmailAddress = UTL_OrgWideEmailAddress.getAddressRecord(OSB_URLs__c.getValues(OSB_CUSTOM_SETTING_EMAIL_ADDRESS).Value__c);
        
        return oneHubEmailAddress.Id;
    }

    /**
     * Used to retrieve the banner/footer image used in the templates
     *
     * @param htmlBody HTML message as a string
     *
     * @return htmlBody with images
     **/
    private static String insertEmailImages(String htmlBody){
        htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_EMAIL_BANNER, SRV_Document.newInstance().getImageLink(OSB_EMAIL_BANNER_IMAGE_NAME));
        htmlBody = htmlBody.replace(OSB_CUSTOM_SETTING_EMAIL_FOOTER, SRV_Document.newInstance().getImageLink(OSB_EMAIL_FOOTER_IMAGE_NAME));

        return htmlBody;
    }

    /**
     * Used to retrieve the banner/footer image used in the templates
     * 
     * @param contactList List<Contact> List of Objects of type Contact
     *
     * @return Map<Id, Contact> map of ids to community access managers
     **/
    private static Map<Id, Contact> getCommunityManagerIds(List<Contact> contactList){
        Map<Id, Contact> communityAccessManagers;
        Set<Id> accessManagerIds = new Set<Id>();
        for(Contact contact : contactList){
            accessManagerIds.add(contact.OSB_Community_Access_Manager__c);
        }
        if(!accessManagerIds.isEmpty()) {
            communityAccessManagers = new Map<Id, Contact>(SEL_Contacts.newInstance().selectByIdWoSharing(accessManagerIds));
        }

        return communityAccessManagers;
    }
}