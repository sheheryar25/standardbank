({
    doClick : function(cmp) {
        var event = cmp.getEvent('optionSelected');

        event.setParam('data', cmp.get('v.data'));
        event.fire();
    }
})