/**
 * Created by Accenture
 * Date Sep 2021
 * @description Aura component used to open the tab for newly created case and close the new case flow
 * input recordId, accountId
 */

({
    // Initialized
    doInit: function (component,event)
    {
        try {
            let spinner = component.find("spinnerCase");
            let calledFrom = component.get("v.calledFrom");
            const caseRecordId = component.get("v.caseRecordId");
            if(calledFrom == 'NewManualCase'){
            const workspaceAPI = component.find('caseRecordWorkspace');
            const accountRecordId = component.get("v.accountRecordId");
            workspaceAPI.getFocusedTabInfo().then(function (response) {
                const focusedTabId = response.tabId;
                workspaceAPI.openTab({
                    recordId: accountRecordId,
                    focus: true
                }).then(function (response) {
                      workspaceAPI.openSubtab({
                        parentTabId: response,
                        recordId: caseRecordId,
                        focus: true
                    }).then(function () {
                        workspaceAPI.closeTab({tabId: focusedTabId});
                        $A.util.toggleClass(spinner, "slds-hide");
                    }).catch(function (error) {
                          $A.util.toggleClass(spinner, "slds-hide");
                    });
                }).catch(function (error) {
                    $A.util.toggleClass(spinner, "slds-hide");
                });
            }).catch(function (error) {
                 $A.util.toggleClass(spinner, "slds-hide");
            });
        }
            else{
                $A.util.toggleClass(spinner, "slds-hide");
                const navigate = component.get('v.navigateFlow');
                navigate('FINISH');
            }
        }catch (e){
            $A.util.toggleClass(spinner, "slds-hide");
        }
    },
});