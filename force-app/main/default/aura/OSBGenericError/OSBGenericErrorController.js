({
	init : function(component) {
        var context = component.get("v.context");
        var requiresLogout = component.get("v.requiresLogout");
        
        if(requiresLogout){
            var action = component.get("c.getLogoutUrl");
            
            action.setCallback(this, function(response){ 
            	var state = response.getState();
            	
                if (state === "SUCCESS"){
                    component.set("v.logoutURL", String(response.getReturnValue()));
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {                        
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
        	$A.enqueueAction(action);
        }

        if(context == "NoAccess"){
            var apDpName = '';
            var content = String(component.get("v.subtitle"));
            var sPageURL = decodeURIComponent(window.location);
            var urlParams = String(sPageURL).split('?');
            var urlParamValueArray = String(urlParams).split('=');
            var apDpContactId = urlParamValueArray[1];
            
            var action = component.get("c.getApDpName");
            action.setParams({
                "apDpContactId": apDpContactId
            });
            
            action.setCallback(this, function(response){ 
            	var state = response.getState();
            	
                if (state === "SUCCESS"){
                	apDpName = String(response.getReturnValue());
                    content = String(content).replace("OSB_ApDpName", apDpName);
                    component.set("v.subtitle", content);
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {                        
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
        	$A.enqueueAction(action);
        }
	},
    handleActionPrimary : function(component) {
        var context = component.get("v.context");

        if(context == "signUp"){
            window.close();
        }
        else if(context == "NoAccess" || context == "NearlyThere"){
            window.location.replace(component.get("v.logoutURL"));
        }
        else {
            var navPage = component.get("v.navPage");
            
            let navService = component.find("navService");
            var sPageURL = decodeURIComponent(window.location);
            
            if(sPageURL.includes('encodeDetails')){
                var urlParams = String(sPageURL).split('?');
                var urlParamValueArray = String(urlParams[1]).split('=');
                
                var extraDetails = urlParamValueArray[1];
                
                let pageReference = {
                    type: "comm__namedPage",
                    attributes: {
                        name: navPage
                    },
                    state : {
                        "encodeDetails" : extraDetails,
                        "logoutUrl"     : component.get("v.logoutURL")
                    }
                };
                
                navService.navigate(pageReference);
            }
            else{
                let pageReference = {
                    type: "comm__namedPage",
                    attributes: {
                        name: navPage
                    }
                };
                
                navService.navigate(pageReference);
            }
        }
    },  
    
    handleActionSecondary : function(component) {
        var requiresLogout = component.get("v.requiresLogout");
        var context = component.get("v.context");
        
        if(requiresLogout){
            window.location.replace(component.get("v.logoutURL"));
        }
        else{
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "Home"
                }
            };
            navService.navigate(pageReference);
        }
    }    
})