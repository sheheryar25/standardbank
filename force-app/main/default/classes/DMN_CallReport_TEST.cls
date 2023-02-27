@isTest
private class DMN_CallReport_TEST {
	
	private static ABS_ObjectBuilderBase accBld;
	private static ABS_ObjectBuilderBase conBld;
	private static ABS_ObjectBuilderBase oppBld;
	private static ABS_ObjectBuilderBase eveBld;
	private static ABS_ObjectBuilderBase callBld;
	private static User testUsr;
	public static final String TEST_USER_NAME = 'test.DMN_CallReport_TEST@test.com';

	@TestSetup
	private static void createDate(){
		System.runAs(new User(Id = UserInfo.getUserId())){
			TEST_DataFactory.generateConfiguration();
		}
		Test.startTest();
			System.runAs(new User(Id = UserInfo.getUserId())){
				new BLD_USER(TEST_USER_NAME).useCommB().syncContact().setField(User.Outlook_Exchange_System_ID__c, '11')
				.commitWork().getRecord(); 
			}
		Test.stopTest(); 
	}

	private static void fetchData(){

		for(User usr : [SELECT Contact_Sync_ID__c, UserName, Sync_with_Contact__c
						FROM User
						WHERE UserName =: TEST_USER_NAME]){
			if(usr.UserName == TEST_USER_NAME){
				testUsr = usr;
			}
		}
	}

	private static testmethod void eventCreationTest() {

		fetchData();
		System.assertNotEquals(null, testUsr.Contact_Sync_ID__c);
		System.runAs(testUsr){
			Test.startTest();
				accBld = new BLD_Account().useCommB().useGroupParent().commitWork(); 
				
				callBld = new BLD_CallReport().internal().meetingPurpose(DMN_CallReport.DAY_TO_DAY_MEETING)
									.startDate(System.now()).endDate(System.now().addHours(1))
									.assign(testUsr.Id).linkWithParent(accBld.getRecordId()).commitWork();

			Test.stopTest(); 
		} 
	}
	
	private static testmethod void removeRelatedToEvents_NoDml() {

		fetchData();
		System.runAs(testUsr){
			accBld = new BLD_Account().useCommB().useGroupParent().commitWork(); 

			eveBld = new BLD_Event()
								.internalMeeting().meetingPurpose(DMN_Event.CORE_TEAM_MEETING)
								.startDate(System.now()).stopDate(System.now().addHours(1))
								.linkToParent(accBld.getRecordId()).commitWork();
		} 

		Event eve = (Event)eveBld.refreshFromDB(new Set<String>{'WhatId', 'WhoId'}).getRecord();

		Event[] events = [	SELECT Id, WhatId, WhoId, Related_Event_Report__c
							FROM Event 
							WHERE Id =: eve.Id];

		Call_Report__c[] eveMeetings = [SELECT Id, EventId__c 
										FROM Call_Report__c
										WHERE EventId__c =: eve.Id];

		System.assertEquals(accBld.getRecordId(), eve.WhatId); 
		System.assertEquals(null, eve.WhoId);
		System.assertEquals(1, eveMeetings.size());
		System.assertEquals(1, events.size()); 
		System.assertEquals(events[0].Id, eveMeetings[0].EventId__c);
		System.assertEquals(eveMeetings[0].Id, events[0].Related_Event_Report__c); 

		System.runAs(testUsr){
			Test.startTest();
				DMN_CallReport.removeRelatedToEvents(new Event[]{eve});
			Test.stopTest();
		} 

		events = [	SELECT Id, WhatId, WhoId, Related_Event_Report__c
					FROM Event 
					WHERE Id =: eve.Id];

		eveMeetings = [	SELECT Id, EventId__c 
						FROM Call_Report__c
						WHERE EventId__c =: eve.Id];

		System.assertEquals(0, eveMeetings.size());
		System.assertEquals(0, events.size());  
	}

	private static testmethod void removeRelatedToEvents_Dml() {

		fetchData();
		System.runAs(testUsr){
			accBld = new BLD_Account().useCommB().useGroupParent().commitWork(); 

			eveBld = new BLD_Event()
								.internalMeeting().meetingPurpose(DMN_Event.CORE_TEAM_MEETING)
								.startDate(System.now()).stopDate(System.now().addHours(1))
								.linkToParent(accBld.getRecordId()).commitWork();
		}

		Event eve = (Event)eveBld.refreshFromDB(new Set<String>{'WhatId', 'WhoId'}).getRecord();

		Event[] events = [	SELECT Id, WhatId, WhoId, Related_Event_Report__c
							FROM Event 
							WHERE Id =: eve.Id];

		Call_Report__c[] eveMeetings = [SELECT Id, EventId__c 
										FROM Call_Report__c
										WHERE EventId__c =: eve.Id];

		System.assertEquals(accBld.getRecordId(), eve.WhatId); 
		System.assertEquals(null, eve.WhoId);
		System.assertEquals(1, eveMeetings.size());
		System.assertEquals(1, events.size()); 
		System.assertEquals(events[0].Id, eveMeetings[0].EventId__c);
		System.assertEquals(eveMeetings[0].Id, events[0].Related_Event_Report__c); 

		System.runAs(testUsr){
			Test.startTest();
				delete eve;
			Test.stopTest();
		} 

		events = [	SELECT Id, WhatId, WhoId, Related_Event_Report__c
					FROM Event 
					WHERE Id =: eve.Id];

		eveMeetings = [	SELECT Id, EventId__c 
						FROM Call_Report__c
						WHERE EventId__c =: eve.Id];

		System.assertEquals(0, eveMeetings.size());
		System.assertEquals(0, events.size()); 
	}
	
	private static testmethod void buildReport_Account() {

		fetchData();
		Datetime startTime = System.now();
		Datetime endTime = System.now().addHours(1);

		System.runAs(testUsr){
			accBld = new BLD_Account().useCommB().useGroupParent().commitWork(); 

			eveBld = new BLD_Event()
								.internalMeeting().meetingPurpose(DMN_Event.CORE_TEAM_MEETING)
								.startDate(startTime).stopDate(endTime)
								.linkToParent(accBld.getRecordId()).commitWork();
		}

		Event eve = (Event)eveBld.refreshFullFromDB().getRecord();
		Account acc = (Account)accBld.refreshFullFromDB().getRecord();
		Call_Report__c callRep;
		Map<Id, Sobject> id2Sobject = new Map<Id, Sobject>{acc.Id => acc};
		

		System.runAs(testUsr){
			Test.startTest();
				callRep = DMN_CallReport.buildReport(eve, id2Sobject);
			Test.stopTest();
		} 

		//System.assertEquals(eve.WhoId, 						callRep.Relate_to_Client__c);
		System.assertEquals(eve.OwnerId, 					callRep.OwnerId);
		System.assertEquals(eve.Subject + ' - '+ acc.Name, 	callRep.Name);
		System.assertEquals(eve.Meeting_Purpose__c, 		callRep.Meeting_Purpose__c);
		System.assertEquals(eve.Id, 						callRep.EventId__c);
		System.assertEquals(eve.Subject, 					callRep.Subject__c);
		System.assertEquals(eve.Meeting_Audience__c, 		callRep.Meeting_Audience__c);
		System.assertEquals(eve.Description, 				callRep.Description__c);
		System.assertEquals(eve.Visible_to_Internal_Attendees_only__c, 	callRep.Visible_to_Internal_Attendees_only__c);

		System.assertEquals(startTime, 						callRep.Start__c);
		System.assertEquals(endTime, 						callRep.End__c);
	}
}