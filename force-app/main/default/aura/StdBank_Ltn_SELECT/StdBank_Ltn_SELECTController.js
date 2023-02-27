({
    doInit : function(component, event, helper) {
        helper.evaluateData(component, helper);

        var selected = component.get('v.selected');

        if (!selected) {
            component.set('v.isOpen', true);
        }
    },
    search : function(component, event, helper) {
        var data 	= component.get('v.data');
        var phrase	= component.get('v.search');

        helper.evaluateSearch(component, phrase);

        console.log('Search got: ' + phrase);

        if (phrase.length < 3) {
            console.log('Need ' + (3 - phrase.length) + ' more chars.');
        } else {
            component.set('v.dataSorted', helper.filterData(phrase, data));
        }
    },
    assignValue : function(component, event) {
        var data = event.getParam('data');

        component.set('v.isOpen', false);
        component.set('v.search', data.Name);
        component.set('v.selected', data);
    },
    searchClear : function(component) {
        //component.set('v.isOpen', true);
        component.set('v.selected', '');
    },
    onChangeInput : function (component, event, helper) {
        helper.evaluateData(component, helper);
    },
    checkCleared: function (component) {
        var data = component.get('v.selected');

        if (!data || data == '' || data == null) {
            component.set('v.search', '');
            component.set('v.isOpen', true);
        }
    }
})