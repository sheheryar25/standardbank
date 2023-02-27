/**
 * @description Main application factory class which is responsible for returning the correct business implementation for the unit
 * of work, service, selector and domain layers within the application.
 *
 * NOTE: Please add values to selector and service in ALPHABETICAL order, to prevent duplicates
 * Values for unitOfWork have to to be in execution order
 *
 * @author		Bartosz Sliwinski (bsliwinski@deloittece.com)
 * @date		March 2020
 */
public without sharing class ORG_Application {

	@SuppressWarnings('PMD.FieldNamingConventions')
	public static final fflib_Application.SelectorFactory selector = new fflib_Application.SelectorFactory(
			new Map<SObjectType, Type> {
					Account.SObjectType                                    => SEL_Accounts.class,
                    AccountContactRelation.SObjectType                     => SEL_AccountContactRelation.class,
                    CMN_Account_Contact_Relationship_Detail__c.SObjectType => SEL_CMN_AccountContactRelationshipDetail.class,
					Account_Information__c.SObjectType			           => SEL_AccountInformations.class,
					AKILI_Insights_API__mdt.SObjectType			           => SEL_AkiliInsightApiMetadatas.class,
					Application_Document__c.SObjectType			           => SEL_ApplicationDocuments.class,
					Assessment_Opportunity__c.SObjectType		           => SEL_AssessmentOpportunities.class,
					Business_Assessment__c.SObjectType   	               => SEL_BusinessAssessments.class,
					Call_Report__c.SObjectType					           => SEL_CallReports.class,
					Call_Report_Attendees__c.SObjectType		           => SEL_CallReportAttendees.class,
					Campaign_Hosts__c.SObjectType                          => SEL_CampaignHosts.class,
					CampaignMember.SObjectType         			           => SEL_CampaignMember.class,
					Campaign_Member_Host__c.SObjectType                    => SEL_CampaignMemberHosts.class,
					Case.SObjectType 							           => SEL_Cases.class,
					Client_Plan__c.SObjectType                             => SEL_ClientPlans.class,
					Consent_Configuration__c.SObjectType                   => SEL_ConsentConfiguration.class,
					Contact.SObjectType							           => SEL_Contacts.class,
					Conversation__c.SObjectType   				           => SEL_Conversations.class,
					Conversation_Value__c.SObjectType                      => SEL_ConversationValues.class,
					CurrencyType.SObjectType					           => SEL_CurrencyTypes.class,
					Custom_Client_Team__c.SObjectType			           => SEL_ClientTeams.class,
					CustomNotificationType.SObjectType			           => SEL_CustomNotificationTypes.class,
					CustomPermission.SObjectType                           => SEL_CustomPermissions.class,
					Child_products__c.SObjectType 				           => SEL_ChildProducts.class,
					Document.SObjectType						           => SEL_Documents.class,
					Draw_Down_Profile__c.SObjectType			           => SEL_DrawdownProfiles.class,
					Entitlement.SObjectType                                => SEL_Entitlement.class,
					Report.SObjectType							           => SEL_Report.class,
					FeedItem.SObjectType						           => SEL_FeedItems.class,
					GroupMember.SObjectType						           => SEL_GroupMember.class,
					Global_Client_Revenue__c.SObjectType		           => SEL_GlobalClientRevenue.class,
					Financial_Account__c.SObjectType                       => SEL_FinancialAccounts.class,
					Financial_Account_Permission__c.SObjectType            => SEL_FinancialAccountPermissions.class,
					FinServ__Revenue__c.SObjectType				           => SEL_Revenue.class,
					Insight__c.SObjectType 						           => SEL_Insights.class,
					Investor_Participation__c.SObjectType		           => SEL_InvestorParticipations.class,
					Knowledge_Entitlement_Exception__c.SObjectType         => SEL_KnowledgeExceptions.class,
					Notification__c.SObjectType					           => SEL_Notifications.class,
					Onboarding_Application__c.SObjectType		           => SEL_OnboardingApplications.class,
					Option_List_Item__c.SObjectType				           => SEL_Option_List_Item.class,
					Opportunity.SObjectType		                           => SEL_Opportunities.class,
					OpportunityTeamMember.SObjectType		               => SEL_OpportunityTeamMembers.class,
					OSB_AdobeAnalyticsData__mdt.SObjectType		           => SEL_AdobeAnalyticsData.class,
					Profile.SObjectType							           => SEL_Profiles.class,
					Product_Distribution__c.SObjectType			           => SEL_ProductDistributions.class,
					PP_PartnerApplication__c.SObjectType                   => SEL_PartnerApplication.class,
					PP_PartnershipOpportunity__c.SObjectType               => SEL_PartnershipOpportunities.class,
					Resourcing__c.SObjectType					           => SEL_Resourcing.class,
					SB_Product__c.SObjectType					           => SEL_Products.class,
					Service_Type__c.SObjectType					           => SEL_ServiceTypes.class,
					Subscribed_Solutions__c.SObjectType			           => SEL_SubscribedSolutions.class,
					Task.SobjectType							           => SEL_Tasks.class,
					User.SObjectType							           => SEL_Users.class,
	                UserRole.SObjectType						           => SEL_UserRole.class,
	                PermissionSetAssignment.SObjectType			           => SEL_PermissionSetAssignments.class
			}
	);

	@SuppressWarnings('PMD.FieldNamingConventions')
	public static final fflib_Application.ServiceFactory service = new fflib_Application.ServiceFactory(
			new Map<Type, Type> {
					OAuth_ESB_Gateway.IService.class 				        => OAuth_ESB_Gateway.class,
					OSB_SRV_ActionFailureHandler.IService.class				=> OSB_SRV_ActionFailureHandler.class,
					OSB_SRV_ApiConnect.IService.class						=> OSB_SRV_ApiConnect.class,
					OSB_SRV_NewCase.IService.class							=> OSB_SRV_NewCase.class,
					OSB_SRV_NoknokIntegration.IService.class                => OSB_SRV_NoknokIntegration.class,
					OSB_SRV_OnboardingHandler.IService.class				=> OSB_SRV_OnboardingHandler.class,
					OSB_SRV_PingIntegration.IService.class					=> OSB_SRV_PingIntegration.class,
					OSB_SRV_ActionFailureHandler.IService.class				=> OSB_SRV_ActionFailureHandler.class,
					OSB_SRV_ApiConnect.IService.class						=> OSB_SRV_ApiConnect.class,
					OSB_SRV_EmailBuilder.IService.class						=> OSB_SRV_EmailBuilder.class,
					OSB_SRV_EmailSender.IService.class						=> OSB_SRV_EmailSender.class,
					OSB_SRV_NewCase.IService.class							=> OSB_SRV_NewCase.class,
					OSB_SRV_OnboardingHandler.IService.class				=> OSB_SRV_OnboardingHandler.class,
					OSB_SRV_PingIntegration.IService.class					=> OSB_SRV_PingIntegration.class,
					PBB_SRV_GatewayApi_AccountInformation.IService.class	=> PBB_SRV_GatewayApi_AccountInformation.class,
					PBB_SRV_GatewayApi_Conversations.IService.class 		=> PBB_SRV_GatewayApi_Conversations.class,
					PBB_SRV_GatewayApi_GetCustomers.IService.class 			=> PBB_SRV_GatewayApi_GetCustomers.class,
					PBB_SRV_GatewayAPI_GetNotes.IService.class 				=> PBB_SRV_GatewayAPI_GetNotes.class,
					PBB_SRV_GatewayAPI_GetTransactions.IService.class       => PBB_SRV_GatewayAPI_GetTransactions.class,
					PBB_SRV_GatewayAPI_RelatedParties.IService.class 		=> PBB_SRV_GatewayAPI_RelatedParties.class,
					PBB_SRV_GatewayAPI_RiskAndFacilities.IService.class		=> PBB_SRV_GatewayAPI_RiskAndFacilities.class,
					PBB_SRV_GatewayRequestProvider.IService.class 			=> PBB_SRV_GatewayRequestProvider.class,
					PP_SRV_PartnerApplication.IService.class                => PP_SRV_PartnerApplication.class,
					PP_SRV_NewCase.IService.class	                        => PP_SRV_NewCase.class,
					SRV_Customer1ClientSynchronizer.IService.class			=> SRV_Customer1ClientSynchronizer.class,
					SRV_Document.IService.class								=> SRV_Document.class,
					SRV_Entitlement.IService.class							=> SRV_Entitlement.class,
					SRV_HttpRequestSender.IService.class 					=> SRV_HttpRequestSender.class,
					SRV_Logger.IService.class 								=> SRV_Logger.class,
					SRV_User.IService.class                                 => SRV_User.class
			}
	);

	@SuppressWarnings('PMD.FieldNamingConventions')
	public static final List<SObjectType> unitOfWorkRegisteredTypes = new List<SObjectType> {
			User.SObjectType,
			UserRole.SObjectType,
			Account.SObjectType,
			KYC_Status__c.SObjectType,
			Client_Capital_and_Revenue__c.SObjectType,
			Client_Operating_Countries__c.SObjectType,
			Contact.SObjectType,
			Child_products__c.SObjectType,
			Gift_Expense_Log__c.SObjectType,
			Key_Client_Contact__c.SObjectType,
			Knowledge_Entitlement_Exception__c.SObjectType,
			Lead.SObjectType,
			Campaign.SObjectType,
			CampaignMember.SObjectType,
			Campaign_Member_Host__c.SObjectType,
			Campaign_Hosts__c.SObjectType,
			Service_Type__c.SObjectType,
			Case.SObjectType,
			Call_Report__c.SObjectType,
			Call_Report__Share.SObjectType,
			Agenda__c.SObjectType,
			Call_Report_Attendees__c.SObjectType,
			Topic__c.SObjectType,
			Opportunity.SObjectType,
			OpportunityTeamMember.SObjectType,
			SB_Product__c.SObjectType,
			Resourcing__c.SObjectType,
			Cashflow__c.SObjectType,
			Distribution_Client__c.SObjectType,
			Credit_Line__c.SObjectType,
			Custom_Client_Team__c.SObjectType,
			Non_User_Client_Team__c.SObjectType,
			SA_Contact_Team_Member__c.SObjectType,
			Event.SObjectType,
			Task.SObjectType,
			Business_Assessment__c.SObjectType,
			NBAC_Financial_Analysis__c.SObjectType,
			Assessment_Opportunity__c.SObjectType,
			Ecosystem__c.SObjectType,
			Ecosystem_Entity__c.SObjectType,
			Estimated_Revenue_Schedule__c.SObjectType,
			Revenue_and_Profitability__c.SObjectType,
			Client_Plan__c.SObjectType,
			Global_Client_Revenue__c.SObjectType,
			FinServ__Revenue__c.SObjectType,
			Credit_Risk_Appetite__c.SObjectType,
			Client_Financial_Analysis__c.SObjectType,
			Draw_Down_Profile__c.SObjectType,
			Client_Satisfaction_Index__c.SObjectType,
			Account_Information__c.SObjectType,
			Share_Wallet__c.SObjectType,
			Share_of_Wallet_Product__c.SObjectType,
			Account_Application__c.SObjectType,
			AOB_Products__c.SObjectType,
			ArticleNews__c.SObjectType,
			PermissionSet.SObjectType,
			NewsBookmark__c.SObjectType,
			Onboarding_Application__c.SObjectType,
			Client_Data_Change__c.SObjectType,
			Notification__c.SObjectType,
			Vote.SObjectType,
			Document.SObjectType,
			Subscribed_Solutions__c.SObjectType,
			Log__c.SObjectType,
			Log_Event__e.SObjectType,
			Conversation__c.SObjectType,
			PBB_Note_Types__c.SObjectType,
			CI_Gem__c.SObjectType,
			CI_News_Cache__c.SObjectType,
			Option_List_Item__c.SObjectType,
			Investor_Participation__c.SObjectType,
			Product_Distribution__c.SObjectType,
			Application_Document__c.SObjectType,
			CurrencyType.SObjectType,
			Conversation_Value__c.SObjectType,
			Report.SObjectType,
			CustomNotificationType.SObjectType,
			PP_PartnerApplication__c.SObjectType,
			PP_PartnershipOpportunity__c.SObjectType,
            AccountContactRelation.SObjectType,
            CMN_Account_Contact_Relationship_Detail__c.SObjectType
	};
	@SuppressWarnings('PMD.FieldNamingConventions')
	public static final fflib_Application.UnitOfWorkFactory unitOfWork = new fflib_Application.UnitOfWorkFactory(
			unitOfWorkRegisteredTypes
	);

	@SuppressWarnings('PMD.FieldNamingConventions')
	public static final fflib_Application.DomainFactory domain = new fflib_Application.DomainFactory(
			ORG_Application.selector,
			new Map<SObjectType, Type> {
					Resourcing__c.SObjectType                  => DMN_Resourcing.Constructor.class,
					SB_Product__c.SObjectType                  => DMN_SB_Product.Constructor.class,
					Assessment_Opportunity__c.SObjectType      => DMN_Assessment_Opportunity.Constructor.class,
					Business_Assessment__c.SObjectType         => DMN_BusinessAssessment_Injectable.Constructor.class
			}
	);
}