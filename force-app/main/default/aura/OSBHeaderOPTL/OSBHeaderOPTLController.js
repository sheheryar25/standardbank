({
    init : function(component, event, helper) {
        let linkAction = component.get("c.getTermsLink");
        linkAction.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let termsUrl = response.getReturnValue();
                component.set("v.tcLink", termsUrl);
            }
        });
        
        // If the user is on Internet Explorer browser, navigate to unsupported browser error page.
        if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  
        {

            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "unsupportedInternetExplorer__c"
                }
            };

            /* Take the user back to Unsupported Browser Notification page 
            if the user clicks on the button "Sign-in to Onehub" from Internet Explorer
            else go to ping sign in page on other browsers*/

            navService.navigate(pageReference);
            var getLoginUrlAction = component.get('c.getIELoginURL');
            getLoginUrlAction.setCallback(this, function(response) {
                let state = response.getState();
                if (state == "SUCCESS") {
                    
                    let loginUrl = response.getReturnValue();
                    component.set("v.loginUrl", loginUrl);
                }
            });
            
        }else{
            var getLoginUrlAction = component.get('c.getLoginURL');
            getLoginUrlAction.setCallback(this, function(response) {
                let state = response.getState();
                if (state == "SUCCESS") {
                    
                    let loginUrl = response.getReturnValue();
                    component.set("v.loginUrl", loginUrl);
                }
            });
        }
        if (document.cookie.replace(/(?:(?:^|.*;\s*)firstTimeUser\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true") {
            component.set("v.showCookieDisclaimer",false);
            //document.cookie = "firstTimeUser=false; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }
        let getUserNameAction = component.get("c.getUserNameIfLoggedIn");
        getUserNameAction.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                let loggedUser = response.getReturnValue();
                if(loggedUser) {
                    component.set("v.isUserLoggedIn", true);
                    component.set("v.userName", loggedUser.FirstName);
                    
                    helper.getUnreadNotifications(component);
                    helper.getAuthorisation(component);
                } else {
                    component.set("v.isGuestUser", true);
                }
                helper.notifyAnalytics(component, window, loggedUser);
            }
        });
        
               
        $A.enqueueAction(linkAction);
        $A.enqueueAction(getUserNameAction);
        $A.enqueueAction(getLoginUrlAction);
        
    },
    
    openMobileMenu : function(component, event, helper) {
        helper.toggleVisibilityForMobileMenu(component);
    },
    
    closeMobileMenu: function(component, event, helper) {
        helper.closeMobileMenu(component);
        document.body.style.overflow = "auto";
    },
    
    testAdobe :  function(component, event, helper) {
        core._satellite.track('LoginSuccess');
    },
    
    handleSelect : function(component, event, helper) {
        let pageName;
        let selectedMenuItem = event.getParam("value");
        switch(selectedMenuItem) {
            case 'editProfile':
                pageName = 'Profile_and_Settings__c';
                break;
            case 'changePasswordPing':
                helper.changePasswordPing(component,event);
                break;
            case 'teamProfile':
                pageName = 'team_profile__c';
                break;
            case 'codeconduct':
                pageName = 'Code_Of_Conduct__c';
                break;
            case 'conditions':
                pageName = 'Terms_and_Conditions__c';
                break;
            case 'signOut':
                helper.logout();
                break;
        }
        if(pageName !== undefined) {
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: pageName
                }
            };
            navService.navigate(pageReference);
        }
        
    },
    
    handleReadNotification : function(component, event, helper) {
        let notifications = component.get("v.unreadNotificationsNumber");
        helper.setNotifications(component, --notifications);
    },
    
    navigateContactUs : function(component, event, helper) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "OPTL_Contact_Us__c"
            }
        };
        navService.navigate(pageReference);
    },
    
    navigateNotifications : function(component, event, helper) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Notifications__c"
            }
        };
        navService.navigate(pageReference);
    },
    
    displayMobileMenu : function(component) {
        component.set("v.mobileDisplayMenu", true);
    },
    
    hideMobileMenu : function(component) {
        component.set("v.mobileDisplayMenu", false);
    },
    
    handleTabChange : function(component, event, helper) {
        component.set("v.currentTab", event.getParam("tabName"));
        if(event.getParam("tabName")==='Dashboard'){
            document.title = "OneHub";
        }
        else{
            document.title = event.getParam("tabName");
        }
        helper.notifyAnalytics(event.getParam("tabName"));
    },
    
    closeMenu : function(component, event, helper) {
        helper.closeMobileMenu(component);
    },
    
    handleMobileMenuEvent : function(component, event, helper) {
        let toggle = event.getParam("menuOpened");
        helper.toggleMobileMenu(component, toggle);
    }
})