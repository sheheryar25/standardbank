/**
 * Testing of the action items
 * Account <- Opportunity <- Product <- Draw Down Profile
 * Account <- Opportunity
 */
@IsTest
private class StdBank_Ltn_ActionItems_Test {

	private static User standardUser {
		get {
			if (standardUser == null) {
				System.runAs(new User(Id = UserInfo.getUserId()))
				{
					standardUser = (User) new BLD_USER().useCib().syncContact().commitWork().getRecord();
				}
			}
			return standardUser;
		}
		Set;
	}


	@testsetup
	static void prepateData() {
		TEST_DataFactory.generateConfiguration();
		// Client team
		insert new UserProfileId__c(Name = 'UserProfileId', UserProfileId__c = 'Test');
		insert new UserProfileId__c(Name = 'Business Administrator', UserProfileId__c = 'Test');

	}

	private static testmethod void FAISremindersDiffOwner() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		Integer accountCount = 3;
		for (Integer i = 0; i<accountCount; i++) {
			new BLD_Task(uow).linkToParent(new BLD_Account(uow).Name(String.valueOf(1))).itemToAction();
		}
		uow.commitWork();

		Test.startTest();
			System.runAs(standardUser) {
				System.assertEquals(0, StdBank_Ltn_ActionItems.getActionItems().size());
			}
		Test.stopTest();

	}

	private static testmethod void FAISremindersSameOwner() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		Integer accountCount = 3;
		for (Integer i = 0; i<accountCount - 1; i++) {
			new BLD_Task(uow).linkToParent(new BLD_Account(uow).Name(String.valueOf(1))).itemToAction().assignedTo(standardUser).subject(StdBank_Ltn_ActionItems.FAIS_REMINDER_SUBJECT);
		}
		new BLD_Task(uow).linkToParent(new BLD_Account(uow).Name(String.valueOf(1))).itemToAction().Subject(StdBank_Ltn_ActionItems.FAIS_REMINDER_SUBJECT).assignedTo(standardUser);

		uow.commitWork();

		Test.startTest();
			System.runAs(standardUser) {
				System.assertEquals(accountCount, StdBank_Ltn_ActionItems.getActionItems().size());
			}
		Test.stopTest();
	}

	private static testmethod void FAISremindersCCBM() {
		fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		Integer accountCount = 3;
		for (Integer i = 0; i<accountCount; i++) {
			BLD_Account acc = new BLD_Account(uow).Name(String.valueOf(i * 291 + 21));
			new BLD_ClientTeam(uow).account(acc).user(standardUser.Id).ccbm().role(DMN_ClientTeam.ROLE_ANALYST);
			new BLD_Task(uow).linkToParent(acc).itemToAction().assignedTo(UserInfo.getUserId()).subject(StdBank_Ltn_ActionItems.FAIS_REMINDER_SUBJECT);
		}
		uow.commitWork();

		Test.startTest();
			System.runAs(standardUser) {
				System.assertEquals(accountCount, StdBank_Ltn_ActionItems.getActionItems().size());
			}
		Test.stopTest();
	}


	@IsTest
	static void shouldGetAccountRelatedItems() {
		System.runAs(standardUser) {
			fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
			new BLD_Account(uow).useGroupParent()
				.cibTarget(true)
				.selectedCoreCst(true)
				.addClientTeam(
					new BLD_ClientTeam(uow)
						.user(standardUser.Id)
						.ccbm()
						.role(DMN_ClientTeam.ROLE_MANAGER_CLIENT_COVERAGE));
			uow.commitWork();
		}
		Test.startTest();
		List<StdBank_Ltn_ActionItems.ActionItem> actionItems;
		System.runAs(standardUser) {
			actionItems = StdBank_Ltn_ActionItems.getActionItems();
		}
		Test.stopTest();
		System.assertEquals(2, actionItems.size());
	}

	@IsTest
	static void shouldGetExternalMeetingErrorForAccount() {
		System.runAs(standardUser) {
			fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
			new BLD_Account(uow).useGroupParent()
				.cibTarget(true)
				.selectedCoreCst(true)
				.addClientTeam(
					new BLD_ClientTeam(uow)
						.user(standardUser.Id)
						.ccbm()
						.role(DMN_ClientTeam.ROLE_MANAGER_CLIENT_COVERAGE))
				.addEventReport(
					new BLD_CallReport(uow)
						.internal()
						.meetingPurpose(StdBank_Ltn_ActionItems.CORE_CLIENT_TEAM_MEETING)
						.endDate(System.now()));
			uow.commitWork();
		}
		Test.startTest();
		List<StdBank_Ltn_ActionItems.ActionItem> actionItems;
		System.runAs(standardUser) {
			actionItems = StdBank_Ltn_ActionItems.getActionItems();
		}
		Test.stopTest();
		System.assertEquals(1, actionItems.size());
		System.assertEquals(StdBank_Ltn_ActionItems.EXTERNAL_MEETING_ERROR, actionItems[0].header);
	}

	@IsTest
	static void shouldNotGetAnyItemsForAccount() {
		System.runAs(standardUser) {
			fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
			BLD_Contact contactBld = new BLD_Contact(uow);
			new BLD_Account(uow).useGroupParent()
				.cibTarget(true)
				.selectedCoreCst(true)
				.addClientTeam(
					new BLD_ClientTeam(uow)
						.user(standardUser.Id)
						.ccbm()
						.role(DMN_ClientTeam.ROLE_MANAGER_CLIENT_COVERAGE))
				.addEventReport(
					new BLD_CallReport(uow)
						.internal()
						.meetingPurpose(StdBank_Ltn_ActionItems.CORE_CLIENT_TEAM_MEETING)
						.endDate(System.now()))
				.addEventReport(
					new BLD_CallReport(uow)
						.external()
						.clientContact(contactBld)
						.endDate(System.now()));
			uow.commitWork();
		}
		Test.startTest();
		List<StdBank_Ltn_ActionItems.ActionItem> actionItems;
		System.runAs(standardUser) {
			actionItems = StdBank_Ltn_ActionItems.getActionItems();
		}
		Test.stopTest();
		System.assertEquals(0, actionItems.size());
	}
    @IsTest
    static void shouldGetItemsForUsersTasks() {

        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
		BLD_Task taskBuilder = new BLD_Task(uow)
				.subject(StdBank_Ltn_ActionItems.FAIS_REMINDER_SUBJECT)
				.status(DMN_Task.STATUS_IN_PROGRESS)
				.itemToAction()
				.assignedTo(UserInfo.getUserId());
		Task taskItem = (Task) taskBuilder.getRecord();
        new BLD_Account(uow)
                .name('Test Account ActionItem')
                .addClientTeam(new BLD_ClientTeam(uow)
                        .user(UserInfo.getUserId())
                        .coordinator(true)
                        .role(DMN_ClientTeam.ROLE_ANALYST))
				.addTask(taskBuilder)
                .getRecord();
        uow.commitWork();

        Test.startTest();
        List<StdBank_Ltn_ActionItems.ActionItem> actualActionItems = StdBank_Ltn_ActionItems.getTaskBasedActionItems();
        for (StdBank_Ltn_ActionItems.ActionItem actItem : actualActionItems) {
            System.assertEquals(actItem.header, taskItem.Subject);
            System.assertEquals(actItem.item.recordId, taskItem.WhatId);
            System.assertEquals(actItem.item.objectName, StdBank_Ltn_ActionItems.FAIS_REMINDER_ICON);
            System.assertEquals(actItem.footer.size(), 0);
        }
        Test.stopTest();
    }

    @IsTest
    static void shouldGetItemsForOpportunitiesWithZeroRevenue() {

        fflib_SObjectUnitOfWork uow = ABS_ObjectBuilderBase.getNewUnitOfWork();
        Opportunity opp = (Opportunity) new BLD_Opportunity(uow)
                .stage(DMN_Opportunity.ST_DEVELOP)
                .getRecord();
        uow.commitWork();

        Test.startTest();
        for (StdBank_Ltn_ActionItems.ActionItem actItem : StdBank_Ltn_ActionItems.getOpportunityZeroValue()) {
            System.assertEquals(StdBank_Ltn_ActionItems.HEADER_OPP_ZERO_REVENUE, actItem.header);
            System.assertEquals(opp.Id, actItem.item.recordId);
            System.assertEquals(opp.Name, actItem.item.name);
        }
        Test.stopTest();


    }

}