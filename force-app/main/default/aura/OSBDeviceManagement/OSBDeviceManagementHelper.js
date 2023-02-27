({
getDeviceList : function(component) {
    let action = component.get("c.getDeviceDetails");
    action.setCallback(this, function(response) {
        let stateDetails = response.getState();
        let arrayToStoreKeys=[];
        if (stateDetails === "SUCCESS") {
            component.set("v.loading", false);
            let responseMap = response.getReturnValue();
            if(Object.entries(responseMap).length != 0){
                let statusCode = Object.values(responseMap.statusAndIdMap)[0];
                if(statusCode ==='4000'){
                    component.set("v.noDevicesLinked",false);
                    delete responseMap.AdditionalDataMap;
                    delete responseMap.statusAndIdMap;
                    for (let key in responseMap){
                        arrayToStoreKeys.push(key);
                    }
                    if(arrayToStoreKeys.length>0){
                        let allDeviceAuthIdList = [];
                        
                        let allDeviceList = [];
                        let responseValues = [];
                        responseValues = Object.values(responseMap);
                        for(let i=0;i<responseValues.length;i++){
                            let authMap = responseValues[i]['authenticatorsMap'];
                            let authList = [];
                            authList = Object.values(authMap);
                            
                            if(authList.length>1){
                                component.set("v.rowSpan",authList.length);
                            }
                            for(let j =0;j<authList.length;j++){
                                responseValues[i]['authList'[j]]=[authList][j];
                                authList[j]['deviceInfo'] = responseValues[i]['deviceInfo'];
                                authList[j]['deviceType'] = responseValues[i]['deviceType'];
                                authList[j]['deviceOs'] = responseValues[i]['deviceOs'];
                                authList[j]['deviceModel'] = (responseValues[i]['deviceModel']).replaceAll('+',' ');
                                authList[j]['deviceManufacturer'] = responseValues[i]['deviceManufacturer'];
                                authList[j]['deviceId'] = responseValues[i]['deviceId'];
                                let osTypeAndroid = responseValues[i].deviceType.includes("android");
                                authList[j]['osTypeAndroid']=osTypeAndroid; 
                                authList[j]['rowSpan']=authList.length;
                                allDeviceList.push(authList[j]);
                                allDeviceAuthIdList.push(authList[j]['authenticatorsHandle']);
                            }
                        }
                        component.set("v.allDeviceAuthList",allDeviceList);
                        component.set("v.allDeviceAuthIdList",allDeviceAuthIdList);
                        component.set("v.noOfAuthenticators",allDeviceList.length);
                        
                        if(allDeviceList.length !==null){
                            component.set("v.kickinPagination",true);
                        }
                        component.set("v.deviceDetailsList",responseValues);
                        component.set("v.deviceDetailsKeyList",arrayToStoreKeys)
                       
                    }
                } 
            }
            
        } else if (stateDetails === "ERROR") {
            console.log("error");
                component.set("v.loading", false);
            
            component.set("v.blankResponse", true);
            document.querySelectorAll('.device-table')[0].classList.remove('device-table'); 
            
        }
    })
    $A.enqueueAction(action);
},
deleteDevice : function(component,devicesToDeleteList){
    let action = component.get("c.deleteDevices");
    action.setParams({ authHandleList : devicesToDeleteList });
    action.setCallback(this, function(response){
        let state = response.getState();
        if (state === "SUCCESS") {
            let responseList = response.getReturnValue();
            if(responseList[0].statusCodeString==="4000"){
                window.scrollTo(0,0);
                component.set("v.loading", true);
                setTimeout(function() {
                    document.location.reload(); 
                    
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
                    component.set("v.loading", false);
                }, 10000);
            }else{
                window.scrollTo(0,0);
                component.set("v.unexpectedError",true);
            }
        }
        
    });
    $A.enqueueAction(action);
}
})