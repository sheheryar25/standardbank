({
	init: function (component, event, helper)
	{
	    let globalActionName = 'New_Cross_Border_Case';
        let myPageRef = component.get("v.pageReference");
        let nullString = 'null';
        let accountId;
        let inputVariables;
        let amazonConnectId;
        let origin;
        let calledFrom;
        let sourceCaseId;

        if(myPageRef){
            accountId = myPageRef.state.c__accountId;
            amazonConnectId = myPageRef.state.c__amazonConnectId;
            origin = myPageRef.state.c__origin;
            calledFrom = myPageRef.state.c__calledFrom;
            sourceCaseId = myPageRef.state.c__recordId != null ?  myPageRef.state.c__recordId : nullString;
        }
		let destinationFlow = 'SVC_CaseManualCaseCreation';
		let flow = component.find("flowData");
        if(calledFrom === 'CTI')
        {
            inputVariables = [
                { name : "SVC_CalledFrom", type : "String", value: 'NewManualCase' },
                { name : "SVC_AmazonConnectContactId", type : "String", value: amazonConnectId },
                { name : "SVC_Origin", type : "String", value: origin },
                { name : "SVC_CHNWCaseId", type : "String", value: sourceCaseId }];
        }
        else if(calledFrom === 'NewCase')
        {
            inputVariables = [
                { name : "SVC_CalledFrom", type : "String", value: 'NewManualCase' },
                { name : "SVC_AccountRecordId", type : "String", value: accountId}];
        }else{
            inputVariables = [
                { name : "SVC_CalledFrom", type : "String", value: 'NewManualCase' }];
        }
        flow.startFlow(destinationFlow,inputVariables);
	},
	statusChange : function (component, event)
	{
		if (event.getParam('status') === "FINISHED")
		{
			// Prep the navigate to the case list view
			let navService = component.find('navService');
	        let pageReference = {
    	    	type: 'standard__objectPage',
        		attributes: {
        			objectApiName: 'Case',
        			actionName: 'list'
        		},
        		state: {
        			filterName: 'MyCases'
        		}
        	};
			// Remove the "New Case" tab
			let workspaceAPI = component.find("newManualCaseWorkspace");
			workspaceAPI.getFocusedTabInfo().then(function(response)
			{
				let focusedTabId = response.tabId;
				workspaceAPI.closeTab({tabId: focusedTabId});
			})
            // Execute the navigate
        	navService.navigate(pageReference);
		}
	}
});