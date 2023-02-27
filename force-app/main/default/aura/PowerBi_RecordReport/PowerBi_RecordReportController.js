/**
 * Created by mpesko on 05.07.2021.
 */

({
    doInit: function(component, event, helper) {
        let powerBiReport = component.get('c.getPowerBiReportId');
        let id = component.get("v.recordId");
        powerBiReport.setParam('reportId', id);
        powerBiReport.setCallback(this, function(response) {
            var state = response.getState();
                if (state === "SUCCESS") {
                    let powerBiReportId = response.getReturnValue();
                    component.set('v.powerBiReportId', powerBiReportId);
                    let iframeUrl = component.get('v.iframeUrl') + component.get('v.powerBiReportId') + component.get('v.urlParams');
                    component.set('v.iframeUrl', iframeUrl)

                }
            });
        $A.enqueueAction(powerBiReport);

    }
});