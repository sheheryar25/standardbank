/**
 * @description BLD_USER Test class
 */
@isTest
public without sharing class BLD_USER extends ABS_ObjectBuilderBase{

	public  String name 	= 'TestName';
	public  String email 	= 'unit.tester@test.com';
	private String userName;
	public static String USER_LASTNAME = 'Administration';

	private static final Integer TEST_SETUP_COUNTER_VALUE = 1000;

	// Local admin  user to create data (Acc && Con) and avoid MIXED_DML.
	private static User adminUser {
									get{
										if(adminUser == null){
											adminUser = (User)new BLD_USER().useSysAdmin().commitWork().getRecord();
										}
										return adminUser;
									}
									set;
								}

	private static Integer usrCounter = 1;

	public BLD_USER(String userName){
		this(userName, getNewUnitOfWork());
	}

	public BLD_USER(String userName, fflib_SObjectUnitOfWork workUnit){
		this(workUnit);
		this.userName = userName;
		setDefaultData();
	}

	public BLD_USER() {
		this(getNewUnitOfWork());
	}

    public BLD_USER(fflib_SObjectUnitOfWork workUnit) {
        super(User.SObjectType, workUnit);
    }

    private BLD_USER(User sObj, fflib_SObjectUnitOfWork workUnit) {
        super(sObj,workUnit);
    }

	public static void useInTestSetup(){
		usrCounter = TEST_SETUP_COUNTER_VALUE;
	}

	protected override void setDefaultData(){

		String shortName = (String.isNotBlank(userName) ? userName : usrCounter + name).substring(0, 7);
		String fullName = String.isNotBlank(userName) ? userName :  usrCounter + email;


		setField(User.UserName, fullName)
		.setField(User.LastName, USER_LASTNAME)//USR_NAME + usrCounter)
		.setField(User.Email, fullName)
		.setField(User.Alias, shortName)
		.setField(User.CommunityNickname, shortName)
		.setField(User.TimeZoneSidKey, 'Europe/Berlin')
		.setField(User.LocaleSidKey, 'en_US')
		.setField(User.EmailEncodingKey, 'UTF-8')
		.setField(User.LanguageLocaleKey, 'en_US')
		.setField(User.Sync_with_Contact__c, false)
		.setField(User.User_CIB_Global_Area__c, 'CIBSA')
		.setField(User.User_Division__c, 'Client Coverage')
		.setField(User.Business_Unit__c, 'Client Coverage')
		.setField(User.city, 'Smallville')
		.setField(User.country, 'South Africa')
		.setField(User.state, 'Test State')
		.setField(User.Outlook_Exchange_System_ID__c, String.valueOf(usrCounter))
		.setField(User.RecieveBirthdayReminderTasks__c, true);
		usrCounter++;
	}

	public BLD_USER useSysAdmin(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.SYS_ADMIN));
	}
	
    public BLD_USER useBusinessAdmin(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.BUSINESS_ADMIN));
	}
    
	public BLD_USER useCommB(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.COMMB_STD))
						.setField(User.User_CIB_Global_Area__c, 'BCC')
						.setField(User.User_Division__c, 'Commercial Banking');
	}
	public BLD_USER useBB(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.BUSINESS_BANKNG))
						.setField(User.User_CIB_Global_Area__c, 'BCC')
						.setField(User.User_Division__c, 'Business Banking');
	}
	public BLD_USER useAPIUser(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.API_USER));
	}
    public BLD_USER useAPIONLYUser(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.API_ONLY_USER));
	}
	public BLD_USER useCib(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DCN_Profile.CUSTOM_STANDARD))
						.setField(User.User_CIB_Global_Area__c, 'CIBI')
						.setField(User.User_Division__c, 'Client Coverage');
	}

	public BLD_USER useInsightsExec(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.CLIENT_COVERAGE_EXEC_MOBILE_USER_INSIGHTS));
	}

	public BLD_USER useKyc(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.KYC_USER));
	}

	public BLD_USER useReadOnly(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.READ_ONLY));
	}

	public BLD_USER useReadOnlyMobile(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.READ_ONLY_MOBILE));
	}

	public BLD_USER usePbb(){
		return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.PERSONAL_BUSINESS_BANKING_CUSTOM_STD_USER_MOBILE));
	}

	public BLD_USER profile(String profileName) {
		return(BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(profileName));
	}

	public BLD_USER useOneHub() {
		return (BLD_USER) setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.ONE_HUB_COMMUNITY));
	}

	public BLD_USER useOneHubAdmin() {
		return (BLD_USER) setField(User.UserPermissionsKnowledgeUser, true)
				.setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.ONE_HUB_ADMINISTRATOR));
	}

	public BLD_USER useClientServiceUser(){
            return (BLD_USER)setField(User.ProfileId, UTL_Profile.getProfileId(DMN_Profile.CLIENT_SERVICE_USER))
						.setField(User.User_CIB_Global_Area__c, 'CIBSA')
						.setField(User.User_Division__c, 'Transactional Products and Services')
            			.setField(User.Business_Unit__c, 'International Trade Services')
            			.setField(User.User_Team__c, 'Cross Border CoE');
	}

	public BLD_USER employeeNumber(String value){
		return (BLD_USER)setField(User.EmployeeNumber, value);
	}

	public BLD_USER ae_number(String value) {
		return (BLD_USER)setField(User.AE_Number__c, value);
	}

	public BLD_USER email(String value){
		return (BLD_USER)setField(User.Email, value);
	}

	public BLD_USER role(Id roleId){
		return (BLD_USER)setField(User.UserRoleId, roleId);
	}

	public BLD_USER delegatedApproverId(Id delegatedUserId){
		return(BLD_USER) setField(User.DelegatedApproverId, delegatedUserId);
	}

	public BLD_USER syncContact(){
		return (BLD_USER)setField(User.Sync_with_Contact__c, true);
	}

	public BLD_USER title(String title){
		return (BLD_USER) setField(User.Title, title);
	}

	public BLD_USER userName(String userName){
		setField(User.UserName, userName);
		return this;
	}

	public BLD_USER division(String divName){
		setField(User.User_Division__c, divName);
		return this;
	}

	public BLD_USER contactId(Id contactId) {
		return (BLD_USER) setField(User.ContactId, contactId);
	}

	public BLD_USER contact(BLD_Contact contact) {
		return (BLD_USER) setRelation(User.ContactId, contact);
	}

	public BLD_USER country(String countryName){
		setField(User.Country, countryName);
		return this;
	}

	public BLD_USER cibGlobalArea(String cibGlobalArea){
		setField(User.User_CIB_Global_Area__c, cibGlobalArea);
		return this;
	}

	public BLD_USER firstName(String firstName){
		setField(User.FirstName, firstName);
		return this;
	}

	public BLD_USER useTeam(String team){
		setField(User.User_Team__c, team);
		return this;
	}

	public BLD_USER lastName(String lastName){
		setField(User.LastName, lastName);
		return this;
	}

	public BLD_USER managerId(String managerId){
		setField(User.ManagerId, managerId);
		return this;
	}

	public BLD_USER outlookId(String outlookId){
		setField(User.Outlook_Exchange_System_ID__c, outlookId);
		return this;
	}

	public BLD_USER businessUnit(String businessUnit){
		return (BLD_USER) setField(User.Business_Unit__c, businessUnit);
	}

	public BLD_USER userTeam(String userTeam){
		return (BLD_USER) setField(User.User_Team__c, userTeam);
	}

	public BLD_USER contactSyncId(Id contactSId){
		return (BLD_USER) setField(User.Contact_Sync_ID__c, contactSId);
	}

    public BLD_USER phone(String phone){
		return (BLD_USER) setField(User.Phone, phone);
	}

    public BLD_USER dialingCode(String dialingCode){
		return (BLD_USER) setField(User.Dialing_code__c, dialingCode);
	}

	public override ABS_ObjectBuilderBase commitWork(){
		super.commitWork();

		Boolean isCreateConatact = getRecord().get(User.Sync_with_Contact__c) == true;

		if(isCreateConatact){
			System.runAs(adminUser){
						User_BankContact_Sync_Future.CreateContacts(new Id[]{getRecordId()},
												UTL_RecordType.getRecordTypeId(DMN_Contact.OBJ_NAME, DMN_Contact.RTD_BANK),
												TEST_DataFactory.stdBankEmpAcc.Id);
						}
		}
		return this;
	}
}