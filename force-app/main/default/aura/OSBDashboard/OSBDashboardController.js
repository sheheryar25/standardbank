({
    init : function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id")
        component.set("v.userId", userId);
        /*Sets cookie for first time users*/
        document.cookie = "firstTimeUser=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax;";
        var sPageURL = decodeURIComponent(window.location);
        var sURLVariables = sPageURL.split('?');
        if(sURLVariables.length>1){
            var sURLVariableName = sURLVariables[1].split('=');
            if(sURLVariableName[0]=='success' && sURLVariableName[1]=='true'){
                component.set("v.showToast",true);
                setTimeout(function(){
                    component.set("v.showToast",false);
                }, 5000);
            }
        }
        var verifyUserFirstSignInAction = component.get("c.getOnboardingDetails");
        verifyUserFirstSignInAction.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                let contact = response.getReturnValue();
                if(contact){
                    if(!contact.OSB_HideMFA__c && contact.Onboarding_Tour_Date__c !== null){
                        let hasRegisteredDevices = component.get("c.hasRegisteredDevices");
                        hasRegisteredDevices.setCallback(this, function(response) {
                            
                            let responseMap = response.getReturnValue();
                            if(responseMap){
                                if("DeviceMap1" in responseMap){
                                    component.set("v.deviceNotRegistered", true);
                                }else{
                                    component.set("v.deviceNotRegistered", false);
                                }
                            }
                        });
                        $A.enqueueAction(hasRegisteredDevices);
                    }
                    else{
                        component.set("v.deviceNotRegistered", true);
                    }
                }
                if(contact && contact.Onboarding_Tour_Date__c == null) {
                    /*Shows the guided tour for first user's signup*/
                    component.set("v.userContactId", contact.Id);
                    let userRole = contact.OSB_Community_Access_Role__c;
                    let isAdditionalOnboardingRequired = (userRole == 'Authorised Person' || userRole == 'Designated Person');
                    component.set("v.isAdditionalOnboardingRequired", isAdditionalOnboardingRequired);
                    helper.handleFirstSignIn(component, document);
                }
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        console.log("Error: " + JSON.stringify(errors[0]));
                    }
                }
            }
        });
        $A.enqueueAction(verifyUserFirstSignInAction);
        /*Returns list of registered apps*/
        helper.getRegisteredApplications(component);
        var urlSearchString = window.location.search;
        var pushStateUrl = String(window.location.pathname).split('?');
        
        if(urlSearchString != null && urlSearchString != ''){
            var urlParams = String(urlSearchString).split('?');
            var sUrlVarList = urlParams[1].split('&');
            sUrlVarList.forEach(function(urlVar, index) {
                let item = urlVar.split('=');
                if(String(item[0]) === 'activeTab'){
                    component.set("v.currentTab", String(item[1]));
                }
                else if(item[0] === 'refreshView'){
                    window.history.pushState({}, document.title, pushStateUrl[0]);
                }
                else if(item[0] === 'section'){
                    if(item[1]){
                        component.set("v.currentTab", item[1]);
                    }
                    else{
                        component.set("v.currentTab", "Dashboard");
                    }
                }
            });
        }
    },

    handlePopupPageChange : function(component, event, helper) {
        var pageNumber = event.getParam("value");
        var isNextPage = pageNumber > event.getParam("oldValue");
        helper.setPopUpContent(component, pageNumber);
        helper.setPopUpPosition(component, pageNumber, window, document);
        helper.highlightTiles(component, pageNumber, isNextPage);
    },

    handlePopupClose : function(component, event, helper) {
        var pageNumber = event.getParam("pageNumber");
        var eventTarget = event.getParam("message");
        if (eventTarget === "startOnboarding" && component.get("v.displaySecondModalButton")) {
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "team_profile__c"
                }
            };
            navService.navigate(pageReference);
        } else if(eventTarget === "startOnboarding") {
            component.set("v.shouldDisplayOnboardingModal", false);
            document.body.setAttribute('style', 'overflow: hidden;');
            helper.displayPopUp(component, document, window);
        } else if (eventTarget === "finishOnboarding") {
            component.set("v.shouldDisplayOnboardingModal", false);
            helper.handleCloseRegularOnboarding(component, pageNumber, document);
        } else {
            helper.handleCloseRegularOnboarding(component, pageNumber, document);
        }
    },

    handleTabChange : function(component, event, helper) {
        component.set("v.currentTab", event.getParam("tabName"));
        if(event.getParam("tabName")=='Dashboard'){
            document.title = "OneHub";
        }
        else{
            document.title = event.getParam("tabName");
        }
        helper.notifyAnalytics(event.getParam("tabName"));
    },

    handleMenuToggled : function(component, event, helper) {
        let isToggled = event.getParam("menuOpened");
        helper.toggleMobileMenu(component, isToggled);
    },

    handleBreadcrumbEvent : function(component, event) {
        var productName = event.getParam("productName");
        // set the handler attributes based on event data
        component.set("v.productName", productName);
        document.title = productName;
    },
    
    handleErrorFired : function(component, event, helper){
        var errorCode = event.getParam("errorCode");
        if(errorCode === "4401"){
            component.set("v.showToastFail", true);
        }
        else{
            component.set("v.showToastFail", true);
        }
    }
})