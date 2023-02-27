({
	notifyAnalytics: function(selectedNavItem) {
         let appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl": "DeviceManagement",
            "selectedNavItem" : "DeviceManagement"
        });
        appEvent.fire();
    },

    makeRegistrationCallout : function(component){
        let helper = this;       
        let actionStatus = component.get("c.getStatusofRegistration");
        actionStatus.setParams({  oobStatusHandle : component.get("v.oobStatusHandle")  });
        actionStatus.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let respInfo = response.getReturnValue();
                if(respInfo.hasOwnProperty("deviceInfo")){
                    component.set("v.deviceInfo", respInfo.deviceInfo.toUpperCase());
                }
                if(helper.manageRegistrationStatus(component, respInfo.responseStatusCode,respInfo)==='-1') {
                  
                } 
            } 
        })
        $A.enqueueAction(actionStatus);
    },

    testRegistrationCallout : function(component, helper, time){
        let statusCode = "4004";
       if(time > 27){
           statusCode = "4401";
       }
        if(time > 33){}
        let deviceInfo = {};
        deviceInfo.responseStatusCode = statusCode;
        helper.manageRegistrationStatus(component, deviceInfo.responseStatusCode, deviceInfo);
    },
    
    manageRegistrationStatus : function(component, statusCode, regData){
        if(statusCode === '4004') {
            return '4004';
           
        }
        else if(statusCode === '4005'){
            component.set("v.qrLoading", true);
            component.set("v.waitingForAuth", true);
        }
        else if(statusCode === '4000'){
            component.set("v.isAppInstalled",false);
            component.set("v.deviceAuthenticated", true);
            component.set("v.waitingForAuth", false);
            this.cancelTimers(component);
        }
        else if(statusCode === '4401' || statusCode === '4402' || statusCode === '4404'
            || statusCode === '4407' || statusCode === '4450'){
            if(component.get("v.deviceAuthenticated"))
                return;
            this.cancelTimers(component);
            if(statusCode === '4401'){
                component.set("v.reloadQr", true);
                return;
            }
            let errorEvent = component.getEvent("errorEvent");
            errorEvent.setParams({
                "errorCode" : statusCode
            });
            errorEvent.fire();
            component.set("v.deviceAuthenticated", false);
            component.set("v.waitingForAuth", false);
            component.set("v.isAppInstalled",false);
            component.set("v.error", true);
        }
        else if(statusCode === '1'){
            return '1';
        }
    },

    handleRegistration : function(component){
        let helper = this;
        let intervalTime = 0;
        let intervalId = window.setInterval(function(){
            intervalTime = intervalTime + 3; 
            if(intervalTime === component.get('v.timeLeft')){
                helper.manageRegistrationStatus('-1');
                clearInterval(intervalId);
            }
                helper.makeRegistrationCallout(component);
        }, 3000);
        component.set("v.intervalId", intervalId);
    },

    cancelTimers : function(component){
        let timerEvent = $A.get("e.c:OSBTimerEvent");
        timerEvent.setParams({
            "isQrCode" : true,
            "timerState" : "CNL"
        });
        timerEvent.fire();
        clearInterval(component.get("v.intervalId"));
    },

    linkDevice: function(component,event,helper){
        let isAppInstalled = component.set("v.isAppInstalled",true);
        let step1 = component.set("v.step1",false);
        let onDashboard = component.get("v.onDashboard");
        component.set("v.isOpen", true);        
        component.set("v.showtutorial",false);
        let action = component.get("c.getQrCodeDetails");
        action.setCallback(this, function(response) {
            let state = response.getState();            
            if (state === "SUCCESS") {
                component.set("v.qrLoading",false);
                let qrCode = "data:image/png;base64,"+response.getReturnValue().qrImage;
                component.set("v.qrCodeBase64",qrCode);
                component.set("v.oobStatusHandle",response.getReturnValue().oobStatusHandle);
                if(response.getReturnValue().qrImage === undefined){
                    helper.cancelTimers(component);
                    let errorEvent = component.getEvent("errorEvent");
                    errorEvent.setParams({
                        "errorCode" : state
                    });
                    errorEvent.fire();

                    component.set("v.deviceAuthenticated", false);
                    component.set("v.waitingForAuth", false);
                    component.set("v.error", true);
                }
                helper.handleRegistration(component);
            } else if (state === "ERROR") {
                helper.cancelTimers(component);
                let errorEvent = component.getEvent("errorEvent");
                errorEvent.setParams({
                    "errorCode" : state
                });
                errorEvent.fire();
                component.set("v.deviceAuthenticated", false);
                component.set("v.waitingForAuth", false);
                component.set("v.error", true);
               
            }
        })
        $A.enqueueAction(action);
    }
})