({
    dispatchNotificationEvent : function(notificationId) {
        var event = $A.get("e.c:OSBNotificationReadEvent");
        event.setParams({
            "notificationId" : notificationId
        });
        event.fire();
    }
});