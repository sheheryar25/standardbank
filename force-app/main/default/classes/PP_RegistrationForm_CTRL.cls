/**
* @description  : Partner Portal Registration From Controller
* User Story :
*
* @author Syed Ovais Ali (syed.ali@standardbank.co.za)
* @date July 2021
*/
public without sharing class PP_RegistrationForm_CTRL {
    
    /**
    * @description Used to Register a Partner
    * User Story : SFP-4874
    * @param registrationDetails
    * @param base64
    * @param filename 
    * @return String
    **/
    @AuraEnabled
    public static String partnershipRegistration(PP_PartnerApplication__c registrationDetails, String base64, String filename){
        String fileExtension;
        Boolean isValid = false;
        
        
        UTL_Security.xssSanitize(registrationDetails, new List<String> { 'PP_Website__c', 'PP_LinkedInProfile__c',
            'PP_FirstName__c', 'PP_LastName__c', 'Name' , 'PP_PartnershipGoalOther__c', 'PP_RegistrationNumber__c',
            'PP_SolutionDetails__c'});
        
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new List<SObjectType> { PP_PartnerApplication__c.SObjectType });
        PP_SRV_PartnerApplication.newInstance().savePartnerApplication(new List<PP_PartnerApplication__c>{ registrationDetails }, uow);
        if(filename != null) {
            fileExtension = filename.substring(filename.lastIndexOf('.') + 1);
            isValid = UTL_Security.isValidFile(fileExtension,  EncodingUtil.base64Decode(base64));
            if(isValid){
                filename = 'Solution Details.'+fileExtension;
                ContentVersion cv = createContentVersion(base64, filename);
                ContentDocumentLink cdl = createContentLink(cv.Id, registrationDetails.Id);  
            }
        }
        
        return 'Success'; 
    }
    
    /**
    * @description Used to Update Partner Details
    * 
    * @param partnerDetails 
    * @return String
    **/
    @AuraEnabled
    public static String updatePartnerDetails(PP_PartnerApplication__c partnerDetails){
        
        UTL_Security.xssSanitize(partnerDetails, new List<String> { 'PP_Website__c', 'PP_LinkedInProfile__c'});
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new List<SObjectType> { PP_PartnerApplication__c.SObjectType });
        uow.registerDirty(partnerDetails);
        uow.commitWork();
        
        return 'Success'; 
    }
    
    /**
    * @description Used to Create Content Version
    *
    * @param base64 
    * @param filename
    * @return ContentVersion
    **/     
    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        insert cv;
        return cv;
    }
    
    /**
    * @description Used to Create Content Link
    *
    * @param contentVersionId 
    * @param recordId
    * @return ContentDocumentLink
    **/
    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
            SELECT ContentDocumentId 
            FROM ContentVersion 
            WHERE Id =: contentVersionId
        ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V';
		insert cdl;
        return cdl;
        
    }
    
    /**
    * @description Used to Get Partner Details
    * User Story : SFP-4874
    * @return PP_PartnerApplication__c
    **/
    @AuraEnabled
    public static PP_PartnerApplication__c getPartnerDetails(){
        PP_PartnerApplication__c partner = new PP_PartnerApplication__c();
        Id userId = UserInfo.getUserId();
        List<Contact> contacts = SEL_Contacts.newInstance().selectByUserId(new Set<Id>{userId});
        if(!contacts.isEmpty()){
            partner = SEL_PartnerApplication.newInstance().selectByPrimaryContactId(new Set<Id>{contacts[0].id})[0]; 
        }    
        
        return partner; 
    }
    
}