/**
 *
 * Service class for checking permissions on Financial_Account__c
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date January 2021
 */
public with sharing class OSB_SRV_FinancialAccPermissionHandler {

    public static final String BALANCE_INQUIRY = 'Balance inquiry';
    public static final String STATEMENT_INQUIRY = 'Statement inquiry';
    public static final String PAYMENT_TRACKING = 'Payment tracking';

    /**
     *
     * DTO class checkPermissions method
     *
     * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
     * @date January 2021
     */
    public class CheckPermissionsInput {
        @InvocableVariable(required=true)
        public String permissionType;
        @InvocableVariable(required=true)
        public String contactId;
        @InvocableVariable
        public String accountNumber;
    }

    /**
     * Method checks if Contact with given Id has access to specified
     *
     * @param inputs
     *
     * @return List<Boolean> true for contacts with access, false for contacts without access
     */
    @InvocableMethod
    public static List<Boolean> checkPermissions(List<CheckPermissionsInput> inputs) {
        List<Boolean> result = new List<Boolean>();
        for (CheckPermissionsInput input : inputs) {
            if (input.accountNumber != null) {
                result.add(hasServiceAccessPermissionForAccount(input.contactId, input.accountNumber, input.permissionType));
            } else {
                result.add(hasServiceAccessPermission(input.contactId, input.permissionType));
            }
        }
        return result;
    }

    private static Boolean hasServiceAccessPermission(String contactId, String permissionType) {
        Integer permissionsCount = (Integer) [
                SELECT
                        COUNT(Id) numOfPermissions
                FROM Financial_Account_Permission__c
                WHERE Permission__r.Name = :permissionType AND Authorized_Person__r.Id = :contactId
                AND Active__c = true
        ].get(0).get('numOfPermissions');
        return permissionsCount > 0;
    }

    /**
     * Method checks if Contact has access to the specified DCS service for given account number
     *
     * @param contactId
     * @param accountNumber - bank account number
     * @param permissionType - name of the service
     *
     * @return true for contact with access, false for contact without access
     */
    public static Boolean hasServiceAccessPermissionForAccount(String contactId, String accountNumber, String permissionType) {
        if(accountNumber == null){
            return false;
        }
        Integer permissionsCount = (Integer) [
                SELECT
                        COUNT(Id) numOfPermissions
                FROM Financial_Account_Permission__c
                WHERE Financial_Account__r.External_Id__c = :accountNumber AND Authorized_Person__r.Id = :contactId
                AND Permission__r.Name = :permissionType AND Active__c = true
        ].get(0).get('numOfPermissions');
        return permissionsCount > 0;
    }
}