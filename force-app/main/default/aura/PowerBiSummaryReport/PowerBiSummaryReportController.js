/**
 * Created by mpesko on 8/10/2021.
 */

({
    doInit: function(component, event, helper) {
        var iframeUrl = component.get('v.iframeUrl') + '&amp;config=' + $A.get("$Label.c.PowerBi_Config");
        component.set('v.iframeUrl', iframeUrl);
    }
});