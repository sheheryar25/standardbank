/**
 * Builder class for Contact SObject
 */
@IsTest
@SuppressWarnings('PMD.ExcessivePublicCount')
public without sharing class BLD_Contact extends ABS_ObjectBuilderBase{

    public static final String DEF_FIRST_NAME = 'testFirstName';
    public static final String DEF_LAST_NAME = 'testContact';
    public static final String DEF_EMAIL = 'test@Contact.testcom';
    public static final String DEF_PHONE = '192837465';
    public static final String DEF_PHONE_COUNTRY = 'South Africa';
    public static final String DEF_OPERATING_COUNTRY = 'Angola;South Africa';

    private static Integer counter = 0;

    private static Boolean allowDuplicates = false;

    public BLD_Contact() {
        this(getNewUnitOfWork());
    }

    public BLD_Contact(fflib_SObjectUnitOfWork workUnit) {
        super(Contact.SObjectType, workUnit);
    }

    public BLD_Contact(Contact sObj, fflib_SObjectUnitOfWork workUnit) {
        super(sObj, workUnit);
    }

    protected override void setDefaultData() {
        setField(Contact.LastName,  counter + DEF_LAST_NAME + counter)
                .setField(Contact.Phone, counter + DEF_PHONE + counter)
                .setField(Contact.Email, counter + DEF_EMAIL + counter);
        counter++;
    }

    public BLD_Contact birthDayMonth(String birthDayMonth) {
        return(BLD_Contact) setField(Contact.Birth_Day_Month__c, birthDayMonth);
    }

    public BLD_Contact cifNumber(String cifNumber) {
        return(BLD_Contact) setField(Contact.CIF_Number__c, cifNumber);
    }

    public BLD_Contact email(String email) {
        return(BLD_Contact)setField(Contact.Email, email);
    }

    public BLD_Contact mobilePhone(String mobilePhone) {
        return(BLD_Contact)setField(Contact.MobilePhone, mobilePhone);
    }

    public BLD_Contact phone(String phone) {
        return(BLD_Contact)setField(Contact.Phone, phone);
    }

    public BLD_Contact fax(String fax) {
        return (BLD_Contact) setField(Contact.Fax, fax);
    }

    public BLD_Contact name(String firstName, String lastName) {
        return(BLD_Contact)setField(Contact.LastName, lastName).setField(Contact.FirstName, firstName);
    }

    public BLD_Contact lastName(String lastName) {
        return(BLD_Contact)setField(Contact.LastName, lastName);
    }

    public BLD_Contact mailingAddress(String mailingStreet, String mailingCity, String mailingCountry, String mailingPostalCode){
        return(BLD_Contact)setField(Contact.MailingStreet, mailingStreet).setField(Contact.MailingCity, mailingCity)
                .setField(Contact.MailingCountry, mailingCountry)
                .setField(Contact.MailingPostalCode, mailingPostalCode);
    }

    public BLD_Contact recordTypeId(Id recordTypeId){
        return(BLD_Contact) setField(Contact.RecordTypeId, recordTypeId);
    }

    public BLD_Contact contactCategory(String title) {
        return(BLD_Contact)setField(Contact.Contact_Category__c, title);

    }

    public BLD_Contact icbcContact(Boolean icbcContact) {
        return(BLD_Contact)setField(Contact.ICBC_Contact__c, icbcContact);

    }

    public BLD_Contact inactive(Boolean inactive) {
        return(BLD_Contact)setField(Contact.Inactive__c, inactive);

    }

    public BLD_Contact reasonForInactive(String reasonForInactive) {
        return(BLD_Contact)setField(Contact.Reason_for_Inactive__c, reasonForInactive);

    }

    public BLD_Contact roleAtClient(String role){
        return(BLD_Contact)setField(Contact.Contact_Role_s_at_Client__c, role);
    }

    public BLD_Contact useBankContact(){
        return (BLD_Contact)setField(Contact.RecordTypeId,
                UTL_RecordType.getRecordTypeId(DMN_Contact.OBJ_NAME, DMN_Contact.RTD_BANK));
    }

    public BLD_Contact useClientContact(){
        return (BLD_Contact)setField(Contact.RecordTypeId,
                UTL_RecordType.getRecordTypeId(DMN_Contact.OBJ_NAME, DMN_Contact.RTD_CLIENT));
    }

    public BLD_Contact accountId(Id accountId){
        return (BLD_Contact)setField(Contact.AccountId, accountId);
    }

    public BLD_Contact account(ABS_ObjectBuilderBase accountBld){
        return (BLD_Contact) setRelation(Contact.AccountId, accountBld);
    }

    public BLD_Contact ownerId(Id ownerId){
        return (BLD_Contact) setField(Contact.OwnerId, ownerId);
    }

    public BLD_Contact addKeyClientContact(BLD_KeyClientContact keyClientContactBuilder) {
        return (BLD_Contact) addChild(Key_Client_Contact__c.Contact_Name__c, keyClientContactBuilder);
    }

    public BLD_Contact addResolvedCase(BLD_Case caseBuilder) {
        return (BLD_Contact) addChild(Case.Resolved_By__c, caseBuilder);
    }

    public BLD_Contact addTeamMember(BLD_ContactTeamMember contactBuilder) {
        return (BLD_Contact) addChild(SA_Contact_Team_Member__c.SA_Contact__c, contactBuilder);
    }

    public BLD_Contact addTask(BLD_Task taskBuilder) {
        return (BLD_Contact) addChild(Task.WhoId, taskBuilder);
    }

    public BLD_Contact allowDuplicates(){
        allowDuplicates = true;
        return this;
    }

    public BLD_Contact pingId(String pingId){
        return (BLD_Contact) setField(Contact.Ping_Id__c, pingId);
    }

    public BLD_Contact companyName(String companyName){
        return (BLD_Contact) setField(Contact.OSB_Company_name__c, companyName);
    }

    public BLD_Contact communityAccessManager(Id communityAccessManager){
        return (BLD_Contact) setField(Contact.OSB_Community_Access_Manager__c, communityAccessManager);
    }

    public BLD_Contact communityAccessManager(BLD_Contact communityManager){
        return (BLD_Contact) setRelation(Contact.OSB_Community_Access_Manager__c, communityManager);
    }

    public BLD_Contact communityAccessRole(String communityAccessRole){
        return (BLD_Contact) setField(Contact.OSB_Community_Access_Role__c, communityAccessRole);
    }

    public BLD_Contact identityNumber(String identityNumber){
        return (BLD_Contact) setField(Contact.Identity_Number__c, identityNumber);
    }

    public BLD_Contact communityAccessStatus(String communityAccessStatus){
        return (BLD_Contact) setField(Contact.OSB_Community_Access_Status__c, communityAccessStatus);
    }

    public BLD_Contact operatingCountry(String operatingCountry){
        return (BLD_Contact) setField(Contact.OSB_Operating_Country__c, operatingCountry);
    }

    public BLD_Contact setOSBDefaultData(String communityAccessRole, String communityAccessStatus){
        return (BLD_Contact)
                setField(Contact.FirstName, DEF_FIRST_NAME)
                        .setField(Contact.LastName, DEF_LAST_NAME)
                        .setField(Contact.Email, DEF_EMAIL)
                        .setField(Contact.MobilePhone, DEF_PHONE)
                        .setField(Contact.Phone, DEF_PHONE)
                        .setField(Contact.Phone_Country__c, DEF_PHONE_COUNTRY)
                        .setField(Contact.OSB_Community_Access_Role__c, communityAccessRole)
                        .setField(Contact.OSB_Community_Access_Status__c, communityAccessStatus)
                        .setField(Contact.OSB_Operating_Country__c, DEF_OPERATING_COUNTRY);
    }

    public override ABS_ObjectBuilderBase commitWork(){

        Database.DMLOptions dml = new Database.DMLOptions();
        dml.DuplicateRuleHeader.AllowSave = allowDuplicates;
        dml.OptAllOrNone = false;
        Contact con = (Contact)getRecord();
        if(con.Id == null){
            Database.insert(con, dml);
        }
        else{
            Database.update(con, dml);
        }
        return this;
    }


}