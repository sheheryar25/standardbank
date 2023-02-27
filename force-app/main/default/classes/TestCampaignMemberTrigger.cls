/*****************************************************************************************************\
    @ Author        : Rudolf Niehaus
    @ Date          : 111/2011
    @description   : Case# 1168 : Test class for CampaignMemberTriggerFunctions.cls
                   
    @ Last Modified By  : Wayne Gray
    @ Last Modified On  : June 2012
    @ Last Modified Reason  :  Case #6521- Change contact to use TestFatcory    
                               API Version moved from 20 to 25  
    
    @ Last Modified By  : Nitish Kumar
    @ Last Modified On  : 17/01/13
    @ Last Modified Reason  : EN - 0008 - Adding best practices to the test class
                                          Updated the API version to 27
    
******************************************************************************************************/
@IsTest
public class TestCampaignMemberTrigger {

    //Static data Member
    public static list < CampaignMember > olstCampaignMember;

    /**
     * @author Nitish Kumar
     * @date 17/01/2013
     * @description Sets up the test data
     */
    static void setupTest() {
        insert TEST_DataFactory.getErrorMessages();

        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();

        BLD_Account accBld = new BLD_Account(uow);

        BLD_Contact conBld = new BLD_Contact(uow).useClientContact()
            .account(accBld);

        BLD_Campaign campBld = new BLD_Campaign(uow)
            .addMemberHost(
                new BLD_CampaignMemberHost(uow)
                    .member(conBld)
                    .addHost(
                        new BLD_CampaignHost(uow)
                            .bankContact(conBld)
                    )
            );

        olstCampaignMember = new List<CampaignMember> {
            (CampaignMember)new BLD_CampaignMember(uow).campaign(campBld).contact(conBld).getRecord()
        };
        BLD_CampaignMember campMemberToDelete = new BLD_CampaignMember(uow)
            .campaign(campBld)
            .contact(new BLD_Contact(uow).useClientContact());
        BLD_CampaignMember campMemberToChangeWave = new BLD_CampaignMember(uow)
            .campaign(campBld)
            .contact(new BLD_Contact(uow).useClientContact());

        BLD_Campaign campToLock = new BLD_Campaign(uow);

        uow.commitWork();

        try {
            CampaignMember cmRec = (CampaignMember) new BLD_CampaignMember(uow)
                .campaign(campBld)
                .getRecord();
            Lead leadRec = new Lead(LastName = 'test', Company = 'test');
            uow.registerNew(leadRec);
            uow.registerRelationship(cmRec, CampaignMember.LeadId, leadRec);
            uow.commitWork();
        } catch (Exception ex) {
            System.assert(ex.getMessage().contains(ErrorMessages__c.getValues('Campaign_AddLeadValidation').Error_String__c));
        }

        campToLock.lock(true);
        uow.registerDirty(campToLock);

        uow.registerDeleted(campMemberToDelete);

        campMemberToChangeWave.wave('2');
        uow.registerDirty(campMemberToChangeWave);

        uow.commitWork();
    }


    /**
     * @author Nitish Kumar
     * @date 17/01/2013
     * @description Tests the functionality
     */
    @IsTest
    public static void testCampaignMemTrigger() {
        setupTest();
        try {
            Test.startTest();
            CampaignMemberTriggerFunctions cf;
            cf = new CampaignMemberTriggerFunctions(olstCampaignMember);
            cf.validateRecordLock();
            cf.setContactRecordType();
            cf.addToMemberHostObject();
            cf.updateMemberHostObject();
            cf.deleteFromMemberHostObject();
            cf.validateMemberType();
            cf.sendErrorMail('This is a test');
            Test.stopTest();
        }
        catch (Exception ex) {
            System.assert(false, ex.getMessage());
        }
    }
}