({
	handleUserRemoved : function(component, sPageURL) {
        var urlParams = String(sPageURL).split('?');
        var urlParamValueArray = String(urlParams[1]).split('&');
        var apDpContactId = '';
        
        for(var i = 0; i < urlParamValueArray.length; i++){
            if(urlParamValueArray[i].includes('contactid')){
                var urlParamArray = urlParamValueArray[i].split('=');
                apDpContactId = urlParamArray[1];
            }
        }
        
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Access_Removed__c"
            },
            state : {
                "contactid" : apDpContactId
            }
        };
        navService.navigate(pageReference);
	},
    handleUserDeclined : function(component, sPageURL){
        var urlParams = String(sPageURL).split('?');
        var urlParamValueArray = String(urlParams[1]).split('&');
        var apDpContactId = '';
        
        for(var i = 0; i < urlParamValueArray.length; i++){
            if(urlParamValueArray[i].includes('contactid')){
                var urlParamArray = urlParamValueArray[i].split('=');
                apDpContactId = urlParamArray[1];
            }
        }
        
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Approval_Denied__c"
            },
            state : {
                "contactid" : apDpContactId
            }
        };
        navService.navigate(pageReference);
    },
    handleAMTUser : function(component, sPageURL){
        var urlParams = String(sPageURL).split('?');
        var urlParamValueArray = String(urlParams[1]).split('&');
        var extraDetails = '';
        
        for(var i = 0; i < urlParamValueArray.length; i++){
            if(urlParamValueArray[i].includes('encodeDetails')){
                var urlParamArray = urlParamValueArray[i].split('=');
                extraDetails = urlParamArray[1];
            }
        }
        
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "login_problem__c"
            },
            state : {
                "encodeDetails" : extraDetails
            }
        };
        navService.navigate(pageReference);
    },
    handleUserPendingApproval : function(component, sPageURL){
        if(sPageURL.includes('contactid')){
            var urlParams = String(sPageURL).split('?');
            var urlParamValueArray = String(urlParams[1]).split('&');
            var apDpContactId = '';
            
            for(var i = 0; i < urlParamValueArray.length; i++){
                if(urlParamValueArray[i].includes('contactid')){
                    var urlParamArray = urlParamValueArray[i].split('=');
                    apDpContactId = urlParamArray[1];
                }
            }

            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "Welcome_back__c"
                },
                state : {
                    "contactid" : apDpContactId
                }
            };
            navService.navigate(pageReference);
        }
        else{
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "CongratulationsPage__c"
                }
            };
            navService.navigate(pageReference);
        }
    },
    
    handleAccessDenied :function(component, sPageURL){
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
            
        };
        navService.navigate(pageReference);

    }
})