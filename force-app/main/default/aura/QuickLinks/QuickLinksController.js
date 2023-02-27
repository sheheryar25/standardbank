({
    doInit: function(component, event, helper) {
        helper.generateLinks(component);
    },
    openDialog: function(component, event, helper) {
        var path = event.srcElement.attributes.getNamedItem('data-path').value;
        window.open(path, '_blank', 'location=yes,height=800,width=1200,scrollbars=yes,status=yes');
    }
})