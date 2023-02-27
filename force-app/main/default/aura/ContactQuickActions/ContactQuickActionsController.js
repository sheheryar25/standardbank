({
    openSmailDialog: function(component, event, helper) {
        window.open('/apex/SingletrackCMS__SendEmail?popup=true&origin=contact&contactId='+component.get("v.recordId"), '_blank', 'location=yes,height=800,width=1200,scrollbars=yes,status=yes');
    },
    openLogActivityDialog: function(component, event, helper) {
        window.open('/apex/SingletrackCMS__LogCall2?isdtp=p1&popup=true&id='+component.get("v.recordId"), '_blank', 'location=yes,height=800,width=1200,scrollbars=yes,status=yes');
    }
})