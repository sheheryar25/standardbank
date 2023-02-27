({
	handleRedirect: function (component, event, helper) {
		var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then(function (enclosingTabId) {
            console.info('enclosingTabId', enclosingTabId);
            workspaceAPI.openSubtab({
                parentTabId: enclosingTabId,
                pageReference: {
                    "type": "standard__component",
                    "attributes": {
                        "componentName": "c__PBB_Lifestyle_ConversationMassEdit"
                    },
                    "state": {
                        "uid": "1",
                        "c__recordId": component.get("v.recordId")
                    }
                }
            }).then(function (subtabId) {
                console.info('subtabId', subtabId);

                workspaceAPI.setTabIcon({
                    tabId: subtabId,
                    icon: 'utility:moneybag',
                    iconAlt: 'Notes'
                });
                workspaceAPI.setTabLabel({
                    tabId: subtabId,
                    label: 'Action Many'
                });
                workspaceAPI.focusTab({
                    tabId: enclosingTabId
                });
                workspaceAPI.focusTab({
                    tabId: subtabId
                });
            }).then(function (subtabId) {
                console.log("The new subtab ID is:" + subtabId);
            }).catch(function (error) {
                console.log("error");
            });
        });
	}
})