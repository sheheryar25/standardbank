/**
 * Domain class for the Call_Report_Attendees__c object
 *
 * @author Omar Berraj
 * @Date August 2020
 *
 */
public class DMN_CallReportAttendee {

    public static final String STATUS_ATTENDED = 'Attended';
    public static final String STATUS_INVITED = 'Invited';

    /**
     * Method is updating a Call_Report__c C_Suite_Attendance__c field based on the related attendee contact's contact category
     *
     * @param attendees : list of attendees that have been changed
     */
    public static void updateEventReportCSuiteFlag(List<Call_Report_Attendees__c> attendees) {

        Map<Id, Contact> id2contact = getContactsWithContactCategories(getContactIds(attendees));

        if (!id2contact.isEmpty()) {

            Set<Id> eventReportsToUpdate = new Set<Id>();

            for (Call_Report_Attendees__c attendee : attendees) {

                Contact contact = id2Contact.get(attendee.Contact_id__c);
                if (contact.Contact_Category__c != null && DMN_Contact.CONTACT_CATEGORIES.contains(contact.Contact_Category__c))
                    eventReportsToUpdate.add(attendee.Call_Report__c);
            }

            if (!eventReportsToUpdate.isEmpty())
                updateEventReports(eventReportsToUpdate);
        }
    }

    private static Set<Id> getContactIds(List<Call_Report_Attendees__c> attendees) {

        Set<Id> contactIds = new Set<Id>();

        for (Call_Report_Attendees__c attendee : attendees) {
            contactIds.add(attendee.Contact_id__c);
        }

        return contactIds;
    }

    private static Map<Id, Contact> getContactsWithContactCategories(Set<Id> contactIds) {

        if (contactIds.isEmpty()) return new Map<Id, Contact>();

        return new Map<Id, Contact>(SEL_Contacts.newInstance().selectById(contactIds));
    }

    private static void updateEventReports(Set<Id> eventReportsToUpdate) {

        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();

        for (Id eventReportId : eventReportsToUpdate) {
            uow.registerDirty(new Call_Report__c(Id = eventReportId, C_Suite_Attendance__c = true));
        }

        uow.commitWork();
    }
}