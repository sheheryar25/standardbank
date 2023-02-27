({ 
    init : function(component, event, helper) {
        component.set("v.loading", true);
        let action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let isLoggedIn = response.getReturnValue();
                if(isLoggedIn) {
                    helper.getDeviceList(component); 
                    
                }
                
            }
            else if (state === "ERROR") {
                let cmpTarget = component.get("v.openModal");
                cmpTarget.set("v.openModal",true);
                cmpTarget.set("v.error", true);
                
            }
        });
        $A.enqueueAction(action);
    },
    cancel: function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home"
            }
        };
        navService.navigate(pageReference);
    },
    closeTimedToast : function(component, event, helper){
        if(component.get("v.showMessageToast")){
            setTimeout(function(){
                component.set("v.showMessageToast", false);
            }, 10000);
        }
    },
    closeToast : function(component, event, helper){
        component.set("v.showMessageToast", false);
    },
    handleAddDevice: function(component,event,helper) {
        let noOfAuthenticators = component.get("v.noOfAuthenticators");
        if(noOfAuthenticators<32){
            component.set("v.openModal",false);
            let cmpTarget = component.get("v.openModal");
            if(cmpTarget==false){
                let cmpTarget = component.set("v.openModal",true);
                $A.util.addClass(cmpTarget, 'slds-fade-in-open');
                document.body.style.overflow = "hidden";
            }
            else{
                component.set("v.openModal",false);
            } 
        }else{
            component.set("v.cantAddDevice",true);
        }
    },
    handleRemoveAllDevices:function(component,event,helper) {
        component.set("v.removeAllDevices", false);
        let allDeviceAuthIdList = component.get("v.allDeviceAuthIdList");
        if(allDeviceAuthIdList.length > 0){
            component.set("v.removeAllDevices", true);
            component.set("v.devicesToDeleteList",allDeviceAuthIdList);
            console.log(component.get("v.devicesToDeleteList"));
        }else{
            component.set("v.removeAllDevices", false);
        }
    },
    handleDeleteDevice:function(component,event,helper){
        let optionSelected = event.getParam("selectedOption");
        if(optionSelected==="Yes"){
            let devicesToDeleteList = event.getParam("devicesToDeleteList");
            helper.deleteDevice(component,devicesToDeleteList);
            component.set("v.deviceRemoved",true);
        }
    },
    handleDeleteAllDevices: function(component,event,helper){
        let optionSelected = event.getParam("optionSelected");
        let devicesToDeleteList = component.get("v.devicesToDeleteList");
        if(optionSelected==="Yes" & devicesToDeleteList.length>0){
            if(devicesToDeleteList.length>0 ){
                helper.deleteDevice(component,devicesToDeleteList);
                component.set("v.allDevicesRemoved",true);
            }
            
        }
    }
})