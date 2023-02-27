({
    init : function(component,event,helper) {        
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;        
        if( userAgent.match( /Android/i ) || userAgent.match( /iPhone/i ) )
        {
            component.set("v.isMobile",true);   
            component.set("v.isNotMobile",false);
        }             
        component.get("v.onDashboard");
        let mfaRequired = component.get("v.mfaRequired");
        if(mfaRequired==false){component.set("v.step1",true);}
        component.set("v.isOpen", true);
        component.set("v.reloadQr", false);    
    },
    
    notNow: function(component,event,helper) {        
        let onDashboard = component.get("v.onDashboard");
        if(onDashboard){
            component.set("v.showtutorial",true);
            component.set("v.step1",false);
            component.set("v.isOpen", true);
        }
        else{
            component.set("v.isOpen", false);
            document.body.style.overflow = "auto";
        }
    },
    
    goToLinkDevice: function(component,event,helper){
        helper.linkDevice(component, event, helper);
    },
    goToStep1 : function(component,event,helper){
        component.set("v.isAppInstalled",false);
        component.set("v.showtutorial",false);
        component.set("v.step1",true);
        component.set("v.isOpen", true);
        component.set("v.reloadQr", false);
        helper.cancelTimers(component);
    },
    
    handleCancel : function(component, event, helper){
        helper.cancelTimers(component);
        if(component.get("v.onDashboard") === true){
            component.set("v.showtutorial",true);
            component.set("v.isAppInstalled",false);
            component.set("v.isOpen", true);            
        }
        else {
            component.set("v.isOpen", false);
        }
    },
    
    goToHome:function(component,event,helper){        
        let dontShow = component.find("dontshow");
        if(dontShow != null && dontShow.get("v.checked") === true ){ 
                let dontShowaction = component.get("c.flagContact");
                $A.enqueueAction(dontShowaction);
        }
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navService.navigate(pageReference);  
        component.set("v.isOpen", false);
        document.body.style.overflow = "auto";
        component.get("v.onDashboard");
        helper.cancelTimers(component);
        
    },
    goToDeviceManagement :function(component,event,helper){       
        component.set("v.isOpen", false);
        let selectedMenuItem = "DeviceManagement";
        let appEvent = $A.get("e.c:OSBProfileAndSettingsEvent");
        appEvent.setParams({
            "selectedNavItem" : selectedMenuItem
        });
        appEvent.fire();
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Profile_and_Settings__c",
            },
            state : {
                "activeTab" : selectedMenuItem
            }
        };
        navService.navigate(pageReference);
    },
    
    reload : function(component, event, helper){
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;        
        if( userAgent.match( /Android/i ) || userAgent.match( /iPhone/i ) )
        {
            component.set("v.isMobile",true);   
            component.set("v.isNotMobile",false);
        }             
        component.get("v.onDashboard");        
        component.set("v.step1",true);       
        component.set("v.isOpen", true);
        component.set("v.isAppInstalled",false);
        component.set("v.error", false);
    },
    
    handleFinishTimer : function(component, event, helper){
        if(event.getParam("timerState") === "FIN"){
            component.set("v.reloadQr", true);
            clearInterval(component.get("v.intervalId"));
        }        
    },
    
    reloadQrCode : function(component, event, helper){
        component.set("v.reloadQr", false);
        clearInterval(component.get("v.intervalId"));     
        helper.linkDevice(component, event, helper);        
        let timerEvent = $A.get("e.c:OSBTimerEvent");
        timerEvent.setParams({
            "isQrCode" : component.get("v.qrCodePage"),
            "timerState" : "RST"
        });
        timerEvent.fire();
    },
    closeErrorScreen:function(component,event,helper){
        component.set("v.error",false);
        component.set("v.isOpen", false);
        component.set("v.mfaRequired", false);
    },
    logout : function(component, event, helper) {
        window.location.replace("/secur/logout.jsp?retUrl=/s/");
    },
})