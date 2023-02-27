/**
* Controller class for notifications component, used to
* show and maintain notifications
* <br/>
*
* @author Denys Yelchaninov (dyelchaninov@deloittece.com)
* @date January 2021
*/
public with sharing class OSB_Notifications_CTRL {

    private static final String ALL_USERS = 'All Users';

    /**
     * Returns a list of notifications for user
     *
     * @return List<object> feedItems
     **/
    @AuraEnabled(Cacheable=true)
    public static List<Object> getFeedItemsForUser() {
        List<Object> feedItems = SEL_Notifications.newInstance().getFeedItemsForUser();
        return feedItems;
    }

    /**
     * Updates the notification as read
     *
     * @param recordId of Notification__c
     * @return error message if update fails
     **/
    @AuraEnabled(Cacheable=false)
    public static String markReadNotification(Id recordId) {
        fflib_ISObjectUnitOfWork uow = ORG_Application.unitOfWork.newInstance();
        Notification__c notif = new Notification__c(Id =  recordId, Is_Unread__c = false);
        try {
            uow.registerDirty(notif);
            uow.commitWork();
        } catch(Exception ex) {
            return ex.getMessage();
        }
        return '';
    }
}