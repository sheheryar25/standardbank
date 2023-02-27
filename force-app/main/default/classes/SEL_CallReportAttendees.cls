/**
 * Selector class for the Call_Report_Attendees object
 *
 * @AUTHOR Omar Berraj
 * @date August 2020
 */
public inherited sharing class SEL_CallReportAttendees extends fflib_SObjectSelector {

    public static SEL_CallReportAttendees newInstance() {
        return (SEL_CallReportAttendees) ORG_Application.selector.newInstance(Call_Report_Attendees__c.SObjectType);
    }

    public SObjectType getSObjectType() {
        return Call_Report_Attendees__c.SObjectType;
    }

    public List<SObjectField> getSObjectFieldList() {

        return new List<SObjectField> {
                Call_Report_Attendees__c.Attendee_Name__c,
                Call_Report_Attendees__c.Client_Name__c,
                Call_Report_Attendees__c.Client_Team_Role__c,
                Call_Report_Attendees__c.CompositeKey__c,
                Call_Report_Attendees__c.Contact_id__c,
                Call_Report_Attendees__c.Contact_Category__c,
                Call_Report_Attendees__c.Contact_Owner_Id__c,
                Call_Report_Attendees__c.Contact_Type__c,
                Call_Report_Attendees__c.ContactRecordType__c,
                Call_Report_Attendees__c.Costs_Per_Attendee__c,
                Call_Report_Attendees__c.CreatedById,
                Call_Report_Attendees__c.CurrencyIsoCode,
                Call_Report_Attendees__c.Send_Email__c,
                Call_Report_Attendees__c.Email__c,
                Call_Report_Attendees__c.Name,
                Call_Report_Attendees__c.ExtContactId__c,
                Call_Report_Attendees__c.LastModifiedById,
                Call_Report_Attendees__c.Related_Agenda__c,
                Call_Report_Attendees__c.Status__c,
                Call_Report_Attendees__c.Title__c,
                Call_Report_Attendees__c.Type_of_Attendee__c
        };
    }

    public List<Call_Report_Attendees__c> selectById(Set<Id> ids) {

        return (List<Call_Report_Attendees__c>) Database.query(
                newQueryFactory()
                .setCondition('Id IN :ids')
                .toSOQL()
        );
    }

    public List<Call_Report_Attendees__c> selectByContactId(Set<Id> contactIds) {

        return (List<Call_Report_Attendees__c>) Database.query(
                newQueryFactory()
                .setCondition('Contact_id__c IN :contactIds')
                .toSOQL()
        );
    }

    public List<Call_Report_Attendees__c> selectByContactIdAndStatus(Set<Id> contactIds, String invited, String attended) {

        return (List<Call_Report_Attendees__c>) Database.query(
                newQueryFactory()
                .setCondition('Contact_id__c IN :contactIds AND (Status__c = :invited OR Status__c = :attended)')
                .selectField('Call_Report__r.CreatedDate')
                .toSOQL()
        );
    }
}