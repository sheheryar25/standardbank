public with sharing class OSB_VA_RequestFactory
{
    public final static String SWIFT_GPI_CONNECTION_MTD_NAME = 'SWIFT_GPI_connection';
    
    private final static String GET_METHOD = 'GET';
    private final static String CONTENT_TYPE = 'Content-Type';
    private final static String APPLICATION_JSON = 'application/json';
    private final static String AUTH_HEADER = 'Authorization';
    private final static String HMAC_SHA256 = 'hmacSHA256';
    private final static String DOT = '.';
    private final static String BEARER = 'Bearer ';
    private final static String DOUBLE_QUOTE = '"';
    private final static String COMA = ',';
    private final static String JWT_PROP_STRING = '{0}"{1}":{2}';
    private final static String CURLY_BRACE_OPEN = '{';
    private final static String CURLY_BRACE_CLOSE = '}';
    private final static String JTI = 'jti';
    private final static String EXP = 'exp';
    private final static String ISS = 'iss';
    private final static String PROFILE_ID = 'profileId';
    private final static String IAT = 'iat';
    private final static String ABS_PATH = 'absPath';
    private final static String EMPTY_STRING = '';
    private final static String UTF_8 = 'UTF-8';
    
	public static HttpRequest createiTrackPaySearchRequest(String query, String type)
    {
        iTrackPay__mdt connectionDetails = getiTrackPayData(type);
        HttpRequest request = new HttpRequest();
        request.setEndpoint(connectionDetails.Named_Credential__c + connectionDetails.Path__c + '/' + query);
        request.setMethod(GET_METHOD);
        request.setHeader('X-IBM-Client-Id', connectionDetails.X_IBM_Client_Id__c);
        request.setHeader('X-IBM-Client-Secret', connectionDetails.X_IBM_Client_Secret__c);
        request.setTimeout(7500);
        return request;
    }

    public static iTrackPay__mdt getiTrackPayData(String type)
    {
        return
        [
            SELECT
                X_IBM_Client_Id__c,
                X_IBM_Client_Secret__c,
                Path__c,
                Named_Credential__c
            FROM iTrackPay__mdt
            WHERE DeveloperName = :type
        ];
    }
    
    public static HttpRequest createSwiftGPIPaymentTrackingRequest(String uetr)
    {
        SWIFT_connection_details__mdt credentials = getSWIFTCredentials(SWIFT_GPI_CONNECTION_MTD_NAME);
        String path = credentials.Path__c.replace(':uetr', uetr);
        String endpoint = credentials.Named_Credential__c + path;
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod(GET_METHOD);
        request.setHeader(CONTENT_TYPE, APPLICATION_JSON);
        String jwt = createSwiftJWT(path, credentials);
        request.setHeader(AUTH_HEADER, jwt);
        request.setTimeout(7500);
        return request;
    }
    
    private static SWIFT_connection_details__mdt getSWIFTCredentials(String developerName)
    {
        return
        [
            SELECT
                Application_Name__c,
                DeveloperName,
                Host_SWIFT__c,
                Id,
                JWT_Header__c,
                Path__c,
                Profile_Id_Tracker__c,
                QualifiedApiName,
                Shared_Secret__c,
                Named_Credential__c
            FROM SWIFT_connection_details__mdt
            WHERE DeveloperName = :developerName
        ];
    }
    
    private static String createSwiftJWT(String path, SWIFT_connection_details__mdt credentials)
    {
        String unsignedJws = createUnsignedSwiftJWT(path, credentials);
        String signatureJws = EncodingUtil.base64Encode(Crypto.generateMac(HMAC_SHA256, Blob.valueOf(unsignedJws), Blob.valueOf(credentials.Shared_Secret__c))).remove('=');
        return BEARER + unsignedJws + DOT + signatureJws;
    }
    
    private static String createUnsignedSwiftJWT(String path, SWIFT_connection_details__mdt credentials)
    {
        String headerJwt = EncodingUtil.urlEncode(EncodingUtil.base64Encode(Blob.valueOf(credentials.JWT_Header__c)), 'UTF-8');
        Datetime currentDatetime = Datetime.now();
        Long currentDatetimeNumber = currentDatetime.getTime() / 1000;
        Long datetimeIn30Minutes = currentDatetime.addMinutes(30).getTime() / 1000;
        Long jtiValue = (Long) (Math.random() * 10000000000000000L);
        String payload = String.format(JWT_PROP_STRING, new List<String>
        {
            CURLY_BRACE_OPEN, JTI, DOUBLE_QUOTE
        }) + String.valueOf(jtiValue) +
                String.format(JWT_PROP_STRING, new List<String>
                {
                    DOUBLE_QUOTE + COMA, ISS, DOUBLE_QUOTE
                }) + credentials.Application_Name__c +
                String.format(JWT_PROP_STRING, new List<String>
                {
                    DOUBLE_QUOTE + COMA, PROFILE_ID, DOUBLE_QUOTE
                }) + credentials.Profile_Id_Tracker__c +
                String.format(JWT_PROP_STRING, new List<String>
                {
                    DOUBLE_QUOTE + COMA, IAT, EMPTY_STRING
                }) + String.valueOf(currentDatetimeNumber) +
                String.format(JWT_PROP_STRING, new List<String>
                {
                    EMPTY_STRING + COMA, EXP, EMPTY_STRING
                }) + String.valueOf(datetimeIn30Minutes) +
                String.format(JWT_PROP_STRING, new List<String>
                {
                    EMPTY_STRING + COMA, ABS_PATH, DOUBLE_QUOTE
                }) + credentials.Host_SWIFT__c + path +
                    DOUBLE_QUOTE + CURLY_BRACE_CLOSE;

        String payloadJws = EncodingUtil.urlEncode(EncodingUtil.base64Encode(Blob.valueOf(payload)).remove('='), UTF_8);
        String unsignedJws = headerJwt + DOT + payloadJws;
        return unsignedJws;
    }
}