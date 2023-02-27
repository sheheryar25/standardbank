/**
 * Created by zwalczewska on 19.02.2020.
 */

({
     doInit: function (component, event, helper) {
            helper.getData(component, event);
            component.set('v.Phones', [
                              {label: 'Phone Number', fieldName: 'value', type: 'text'},
                              {label: 'Contact Period', fieldName: 'contactPeriod', type: 'text'},
                           ]);
           component.set('v.Emails', [
                             {label: 'Email', fieldName: 'value', type: 'text'},
                             {label: 'Contact Period', fieldName: 'contactPeriod', type: 'text'},
                          ]);
        },
        handleSectionToggle: function (cmp, event) {
                var openSections = event.getParam('openSections');

                if (openSections.length === 0) {
                    cmp.set('v.activeSectionsMessage', "All sections are closed");
                } else {
                    cmp.set('v.activeSectionsMessage', "Open sections: " + openSections.join(', '));
                }
            }
});