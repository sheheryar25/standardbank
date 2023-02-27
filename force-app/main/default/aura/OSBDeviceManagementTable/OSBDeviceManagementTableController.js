({
    init:function(component,event,helper){
        let allDeviceAuthList = component.get("v.allDeviceAuthList");
    },
    confirmationPopupRemove:function(component,event,helper) {
        component.set("v.removeDevice", false);
        let authIdToDelete = event.getSource().get("v.value");
        if(authIdToDelete){
            component.set("v.removeDevice", true);
            let devicesToDeleteList = component.get("v.devicesToDeleteList");
            devicesToDeleteList.splice(0,devicesToDeleteList.length);
            if(devicesToDeleteList.length==0){
                devicesToDeleteList.push(authIdToDelete);
            }
        }else{
            component.set("v.removeDevice", false);
        }
    },
    handlePopupClose:function(component,event,helper){
        let optionSelected = event.getParam("optionSelected");
        if(optionSelected==="Yes"){
            let devicesToDeleteList = component.get("v.devicesToDeleteList");
            let deviceManagementEvent = $A.get("e.c:OSBDeviceManagementEvent");
            deviceManagementEvent.setParams({
                "selectedOption" : optionSelected,
                "devicesToDeleteList" : devicesToDeleteList
            });         
            deviceManagementEvent.fire();
            
        }
        
    } 
})