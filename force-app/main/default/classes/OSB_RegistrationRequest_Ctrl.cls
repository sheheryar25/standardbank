/**
 * Controller class for OSBRegistrationRedirect component
 *
 * @author Wayde Fagan (wayde.fagan@tetrad.co.za)
 * @date April 2020
 *
 **/
public without sharing class OSB_RegistrationRequest_Ctrl {

    /**
     * Creates a case to allow the marketplace manager to register a new user 
     *
     * @param Case for registration request
     *      
     * @return Case
     **/
    @AuraEnabled
    public static Case saveCase(Case regCase) {
        Id QueueId = UTL_Queue.getQueueId(DMN_Group.GROUP_DEVELOPER_NAME_ONE_HUB);
        Case newCase = regCase;
        try{
            newCase.Priority = DMN_Case.PRIORITY_LOW;
            newCase.RecordTypeId = UTL_RecordType.getRecordTypeId(DMN_Case.OBJ_NAME, DMN_Case.RT_CIB_CLIENT_CASE);
            newCase.OwnerId = QueueId;
            insert newCase;
            return newCase;
        }catch(Exception e){
            System.debug(e.getMessage());
            return null;
        }
    }
    
    /**
     * decodes base64 string 
     *
     * @param base64 String
     *      
     * @return Case
     **/
    @AuraEnabled
    public static String decodeBase64String(String base64String){
        try{
            Blob base64Blob = EncodingUtil.base64Decode(base64String);
            base64String = base64Blob.toString();
            return base64String;
        }
        catch(Exception e){
            SRV_Logger.newInstance().log(e, DMN_Log.AREA_ONEHUB, OSB_RegistrationRequest_Ctrl.class.getName());
            return null;
        }
    }
}