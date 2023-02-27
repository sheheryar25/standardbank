/**
 * Utility methods for AOB project
 *
 * <p></p>
 *
 * @author Salesforce
 *
 * @date Oct 2021
 */
public with sharing class AOB_Utils {
    private static final String NAMED_CREDENTIAL_URL_FORMAT = 'callout:{0}{1}';
    public static final String SERVICE_NAME = AOB_Utils.class.getName();
    /**
     * @description method to fetch the picklist values from the refrenced Data Table
     * @param   sapFields List<String> containing Object Names
     * @return  List<AOB_DTO_SelectOption>
     */
    @AuraEnabled
    public static Map<String, List<AOB_DTO_SelectOption>> getAllPicklistEntriesCodes(List<String> sapFields) {
        Map<String, List<AOB_DTO_SelectOption>> result = new Map<String, List<AOB_DTO_SelectOption>>();

        List<AOB_ReferencedData__c> referencedDataList = [
            SELECT Id, AOB_Code__c, Name, AOB_Default__c, AOB_SAPField__c
            FROM AOB_ReferencedData__c
            WHERE AOB_SAPField__c IN :sapFields AND AOB_Language__c = :UserInfo.getLanguage() AND AOB_isActive__c = TRUE
            WITH SECURITY_ENFORCED
            ORDER BY AOB_Sequence__c ASC
        ];
        for (AOB_ReferencedData__c data : referencedDataList) {
            if (result.containskey(data.AOB_SAPField__c)) {
                result.get(data.AOB_SAPField__c).add(new AOB_DTO_SelectOption(data.AOB_Code__c, data.Name, data.AOB_Default__c));
            } else {
                result.put(data.AOB_SAPField__c, new List<AOB_DTO_SelectOption>{ new AOB_DTO_SelectOption(data.AOB_Code__c, data.Name, data.AOB_Default__c) });
            }
        }
        return result;
    }
    
    
    /**
     * @description method used to transert String to date Time
     * @param dateString
     * @return  String
     */
    public static DateTime formatDateTime(String dateString) {
        datetime dateObj = null;
        if (dateString.contains('T')) {
            dateString = dateString.replace('T', ' ');
            if (dateString.contains('.')) {
                dateString = dateString.subString(0, dateString.indexOf('.'));
            }
            dateObj = datetime.valueof(dateString);
        } else {
            dateObj = datetime.valueof(dateString);
        }
        return dateObj;
    }
    /**
     * @description method used to transert DateTime format to M Month Y
     * @param dateT
     * @return  String
     */
    public static String formatDate(String dateT) {
        DateTime dt = formatDateTime(dateT);
        String monthName = dt.format('MMMMM');
        Integer day = dt.day();
        Integer year = dt.year();
        return day + ' ' + monthName + ' ' + year;
    }
    /**
     * @description method used to transert DateTime format to M Month Y
     * @param dateT
     * @return  String
     */
    public static Integer remainingDays(String dateT) {
        DateTime d = formatDateTime(dateT);
        Date dt = (d).date();
        Date currentDate = system.today();
        Integer numberDaysDue = currentDate.daysBetween(dt);
        return numberDaysDue;
    }
    /**
     * @description method used to generate a GUID
     * @return  String
     */
    public static String generateGUID() {
        Blob b = Crypto.GenerateAESKey(128);
        String h = EncodingUtil.ConvertTohex(b);
        return h.SubString(0, 8) + '-' + h.SubString(8, 12) + '-' + h.SubString(12, 16) + '-' + h.SubString(16, 20) + '-' + h.subString(20);
    }
    
     
    /**
     * @description method used to parse jwt
     * @param jwtToken String
     * @return  String
     */
    public static String parseJWT(String jwtToken) {
        if (String.isNotBlank(jwtToken)) {
            String base64Url = jwtToken.split('\\.')[1];
            String base64 = base64Url.replace('-', '+').replace('_', '/');
            String jsonPayload = EncodingUtil.base64Decode(base64).toString();
            return jsonPayload;
        }
        return '';
    }

    /**
     * @description method to read through the XML
     * @param reader XmlStreamReader
     * @param sxmltag String
     * @return  String
     */
    public static String readXMLResponse(XmlStreamReader reader, String sxmltag) {
        String retValue;
        while (reader.hasNext()) {
            if (reader.getEventType() == XmlTag.START_ELEMENT) {
                if (reader.getLocalName() == sxmltag) {
                    reader.next();
                    if (reader.getEventType() == XmlTag.characters) {
                        retValue = reader.getText();
                    }
                }
            }
            reader.next();
        }
        return retValue;
    }
    
    /**
     * Method used to determine if its an existing to bank or new to bank
     * @return	Boolean
     */
    public static Boolean isUserExistingToBank() {
        //check ping token and check for BPID in it
        return true;
    }

    /**
     * @description method to format GUID
     * @param   h String  unFormatted Guid String
     * @return  String
     */
    public static String formatGUID(String h) {
        h = h.replace('-', '');
        String guid = h.SubString(0, 8) + '-' + h.SubString(8, 12) + '-' + h.SubString(12, 16) + '-' + h.SubString(16, 20) + '-' + h.subString(20);
        return guid.toLowerCase();
    }
    
    /**
     * @description method to fetch an object url
     * @param   sfobject salesforce object record
     * @return  String containing the url to access that object via api
     */
    public static String getObjectUrl(object sfobject) {
        String appjson = JSOn.serialize(sfobject);
        Map<String, object> deserializedApp = (Map<String, Object>) System.JSON.deserializeUntyped(appjson);
        Map<String, Object> attributes = (Map<String, Object>) deserializedApp.get('attributes');
        return (String) attributes.get('url');
    }
}