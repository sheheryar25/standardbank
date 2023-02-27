({
    doInit : function(component, event, helper) {
        var hostName = 'https://' + window.location.hostname;
        // Add message listener
        window.addEventListener("message", $A.getCallback(function(event) {
            var state = event.data.state;
            var action = event.data.action;
            var iFrameLoaded = component.get('v.iFrameLoaded');
            if(state === 'LOADED' && action === 'initial' && !iFrameLoaded){
                // Not the expected origin: reject message!
                if (hostName !== event.origin) {
                    return;
                }
                // Set the iFrame loaded to indicate that visualforce page is loaded
                component.set('v.iFrameLoaded', true);
            }
        }, false));
    },

    setInitialWebAnalytics:function(component, event, helper){
        //Send all the messages which are queued up to the VF page via postmessage
        helper.sendQueuedMessages(component);
    },


    handleNavigation : function(component, event, helper) {
        let url = event.getParam("pageUrl");
        let isSinglePage = event.getParam("isSinglePageApp");
        let productName = event.getParam("productName");
        var action = component.get("c.getPageData");
        action.setParams({
            "pageUrl" : url,
            "isSinglePageApp" : isSinglePage
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let dataLayer = response.getReturnValue();
                dataLayer.registrationSuccess = event.getParam("userRegistrationSuccess");
                dataLayer.loginSuccess = event.getParam("userLoginSuccess");
                if(dataLayer.pageDetails) {
                    if(productName) {
                        helper.addProductName(dataLayer.pageDetails, productName);
                    }
                    helper.sendToVF(component, dataLayer);
                } else {
                    console.log("Missing dataLayer for url:", url);
                }
            } else if (state === "ERROR") {
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
})