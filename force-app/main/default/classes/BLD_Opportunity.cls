/**
 * @description Builder class for Opportunity object
 *
 * @author unknown
 * @date unknown
 */
@IsTest
public without sharing class BLD_Opportunity extends ABS_ObjectBuilderBase {

	public static final Date DEF_CLOSED = System.today();
	public static final String DEF_NAME = 'name',
	DEF_STAGE = '2 - Develop',
	DEF_SUMMARY = 'test opportunity',
	DEF_CURRENCY = 'ZAR',
	WON_COMMENTS = 'StdBank is the best.',
	LOST_COMMENTS = 'StdBank is average.';

	public BLD_Opportunity() {
		this(getNewUnitOfWork());
	}

	public BLD_Opportunity(fflib_SObjectUnitOfWork workUnit) {
		super(Opportunity.SObjectType, workUnit);
	}

	private BLD_Opportunity(Opportunity sObj, fflib_SObjectUnitOfWork workUnit) {
		super(sObj, workUnit);
	}

	public BLD_Opportunity currency(String currencyCode) {
		return(BLD_Opportunity) setField(Opportunity.CurrencyIsoCode, currencyCode);
	}

	public BLD_Opportunity isPrivate(Boolean isPrivate) {
		return (BLD_Opportunity) setField(Opportunity.IsPrivate, isPrivate);
	}

	public BLD_Opportunity id(Id oppId){
		return (BLD_Opportunity) setField(Opportunity.Id, oppId);
	}

	public BLD_Opportunity stage(String stageName) {
		return(BLD_Opportunity) setField(Opportunity.StageName, stageName);
	}

	public BLD_Opportunity develop() {
		return(BLD_Opportunity) setField(Opportunity.StageName, DMN_Opportunity.ST_DEVELOP);
	}

	public BLD_Opportunity closedLost() {
		return (BLD_Opportunity) setField(Opportunity.StageName, DMN_Opportunity.ST_CLOSED_LOST)
			.setField(Opportunity.Reason_Won_Lost_Comments__c, LOST_COMMENTS);
	}

	public BLD_Opportunity closedWon() {
		return(BLD_Opportunity) setField(Opportunity.StageName, DMN_Opportunity.ST_CLOSED_WON)
		.setField(Opportunity.Reason_Won_Lost_Comments__c, WON_COMMENTS);
	}
	public BLD_Opportunity closeDate(Date closeDate) {
		return(BLD_Opportunity) setField(Opportunity.CloseDate, closeDate);
	}

	public BLD_Opportunity actualCloseDate(Date actualCloseDate) {
		return(BLD_Opportunity) setField(Opportunity.Actual_Close_Date__c, actualCloseDate);
	}

	public BLD_Opportunity name(String name){
		return (BLD_Opportunity) setField(Opportunity.Name, name);
	}

	public override void setDefaultData() {
		setField(Opportunity.Name, DEF_NAME)
		.setField(Opportunity.CloseDate, DEF_CLOSED)
		.setField(Opportunity.StageName, DEF_STAGE)
		.setField(Opportunity.Short_Summary__c, DEF_SUMMARY)
		.setField(Opportunity.CurrencyIsoCode, DEF_CURRENCY);
	}

	public BLD_Opportunity linkAccountId(Id accId) {
		return(BLD_Opportunity) setField(Opportunity.AccountId, accId);
	}
	public BLD_Opportunity ownerId(Id ownerId) {
		return(BLD_Opportunity) setField(Opportunity.OwnerId, ownerId);
	}
	public BLD_Opportunity client(BLD_Account clientBld) {
		return(BLD_Opportunity) setRelation(Opportunity.AccountId, clientBld);
	}
	public BLD_Opportunity gccrStatus(String gccrStatus){
	  return (BLD_Opportunity) setField(Opportunity.GCCR_Status__c, gccrStatus);
	}

	public BLD_Opportunity eventReportSource(BLD_CallReport callReportBuilder) {
		return (BLD_Opportunity) setRelation(Opportunity.Primary_Event_Report_Source__c, callReportBuilder);
	}

	public BLD_Opportunity priceSensitive(Boolean bool) {
		return (BLD_Opportunity) setField(Opportunity.Price_Sensitive__c, bool);
	}

	public BLD_Opportunity addProduct(BLD_Product productBuilder) {
		return (BLD_Opportunity) addChild(SB_Product__c.Opportunity__c, productBuilder);
	}

	public BLD_Opportunity addTeamMember(BLD_OpportunityTeamMember otmBuilder) {
		return (BLD_Opportunity) addChild(OpportunityTeamMember.OpportunityId, otmBuilder);
	}

	public BLD_Opportunity addAssessmentOpportunity(BLD_Assessment_Opportunity assessOppBuilder) {
		return (BLD_Opportunity) addChild(Assessment_Opportunity__c.Opportunity__c, assessOppBuilder);
	}

	public BLD_Opportunity addTask(BLD_Task taskBuilder) {
		return(BLD_Opportunity) addChild(Task.WhatId, taskBuilder);
	}
}