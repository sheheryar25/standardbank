/**
 *
 * Service class for balance inquiry by the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
public with sharing class OSB_SRV_BotBalanceViewHandler {

    private static final Http REQUEST_SENDER = new Http();
    private static final String OCH_AUTHENTICATION_FAILED = 'OCH authentication failed';
    private static final String OCH_TOKEN_REFRESH_FAILED = 'OCH token refresh failed';
    public static final String USER_ID = 'VONEHUB';
    public static final String BANK_ID = 'MU';

    public enum RequestType {
        BALANCE_INQUIRY, ACCOUNTS_INQUIRY
    }

    /**
     * DTO for response from OCH authentication endpoint
     */
    @SuppressWarnings('PMD.FieldNamingConventions')
    public class OCHAuthenticationResponse {
        public String access_token;
        public String refresh_token;
        public Long accessTokenCreatedTime;
    }

    /**
     * Get balance details from OCH for given account number
     *
     * @param accountNumber String - account number
     * @param accessToken String - access token
     *
     * @return HttpResponse
     */
    public static HttpResponse queryOCHForBalanceDetails(String accountNumber, String accessToken) {
        HttpRequest request = OSB_VA_HttpRequestFactory.createOCHBalanceInquiryRequest(USER_ID, BANK_ID, accountNumber, accessToken);
        request.setTimeout(7500);
        HttpResponse response = REQUEST_SENDER.send(request);
        return response;
    }

    /**
     * Get account details for given account number from OCH api
     *
     * @param accountNumber String - account number
     * @param accessToken String - access token for OCH API
     *
     * @return HttpResponse
     */
    public static HttpResponse queryOCHForAccountDetails(String accountNumber, String accessToken){
        HttpRequest request = OSB_VA_HttpRequestFactory.createOCHAccountDetailsInquiryRequest(USER_ID, BANK_ID, accountNumber, accessToken);
        request.setTimeout(7500);
        HttpResponse response = REQUEST_SENDER.send(request);
        return response;
    }

    /**
     * Get access token for OCH API
     *
     * @return HttpResponse
     */
    public static HttpResponse queryOCHForAccessToken() {
        HttpRequest req = OSB_VA_HttpRequestFactory.createOCHAuthenticateRequest();
        req.setTimeout(7500);
        HttpResponse resp = REQUEST_SENDER.send(req);
        if (resp.getStatusCode() == 200) {
            OCHAuthenticationResponse responseBody = (OCHAuthenticationResponse) JSON.deserialize(resp.getBody(), OCHAuthenticationResponse.class);
            responseBody.accessTokenCreatedTime = Datetime.now().getTime();
            return resp;
        } else {
            throw new CalloutException(OCH_AUTHENTICATION_FAILED);
        }
    }

    /**
     * Query OCH for the list of accounts for given client
     *
     * @param customerIdentifier String - customer identifier of a client
     * @param accessToken - String access token for OCH API
     *
     * @return HttpResponse
     */
    public static HttpResponse queryOCHForAccountsList(String customerIdentifier, String accessToken) {
        HttpRequest req = OSB_VA_HttpRequestFactory.createOCHCustomerAccountInquiryRequest(customerIdentifier, 'Corporate', accessToken);
        req.setTimeout(7500);
        HttpResponse resp = REQUEST_SENDER.send(req);
        return resp;
    }

    /**
     * Refresh the authentication token for OCH API
     *
     * @param refreshToken String with refresh token
     *
     * @return HttpResponse
     */
    public static HttpResponse queryOCHForRefreshToken(String refreshToken) {
        HttpRequest req = OSB_VA_HttpRequestFactory.createOCHAuthenticateRequest();
        req.setTimeout(7500);
        HttpResponse resp = REQUEST_SENDER.send(req);
        if (resp.getStatusCode() == 200) {
            OCHAuthenticationResponse responseBody = (OCHAuthenticationResponse) JSON.deserialize(resp.getBody(), OCHAuthenticationResponse.class);
            responseBody.accessTokenCreatedTime = Datetime.now().getTime();
            return resp;
        } else {
            throw new CalloutException(OCH_TOKEN_REFRESH_FAILED);
        }
    }
}