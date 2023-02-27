({
    notifyAnalytics: function(tabName) {
        let appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },

    toggleMenu : function(menuOpened){
        component.set('v.mobileMenuToggled', menuOpened);
    },

    toggleTeamProfileMenu : function(component, tpClicked) {
        component.set("v.teamProfileClicked", !tpClicked);
    },

    toggleOverview : function(component, ovClicked) {
        component.set("v.overviewClicked", !ovClicked);
    },

    logout : function() {
        window.location.replace("/secur/logout.jsp?retUrl=/s/");
    },

    handleSelect : function(component, selectedMenuItem) {
        let pageName;
        switch(selectedMenuItem) {
            case 'editProfileAndSettings':
                pageName = 'Profile_and_Settings__c';
                break;
            case 'changePasswordPing':
                this.changePasswordPing(component);
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
                this.logout();
                break;
        }

        if(pageName) {
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

    changePasswordPing : function(component) {
        let action = component.get("c.getChangePasswordUrlPing");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let strURL = response.getReturnValue();
                strURL = encodeURI(strURL);
                window.open(strURL,'_top');
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },

    setAuthorisation : function(component) {
        component.set("v.showTeamProfile",false);
    },

    toggleTeamProfileMenu : function(component, tpClicked) {
        component.set("v.teamProfileClicked", !tpClicked);
    },

    toggleOverview : function(component, ovClicked) {
        component.set("v.overviewClicked", !ovClicked);
    },

    openSolutionShowcase: function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Solutions_Showcase_OPTL__c"
            }
        };

        this.closeMenuEvent(component);
        navService.navigate(pageReference);
    },

    openInsights : function(component) {
        let insightsUrl = component.get("v.InsightUrl");
        this.closeMenuEvent(component);
        window.location.replace(insightsUrl);
    },

    openProduct : function(component) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "API_Products_OPTL__c"
            }
        };
        
        this.closeMenuEvent(component);
        navService.navigate(pageReference);
   },

   openDashboard : function(component) {
    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "Home"
        }
    };
    
    this.closeMenuEvent(component);
    navService.navigate(pageReference);
},

   openTeamProfile : function(component) {
    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "team_profile__c"
        }
    };

    this.closeMenuEvent(component);
    navService.navigate(pageReference);
   },

   redirectOnTeamProfile : function(component, option) {

    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "team_profile__c",
        },
        state : {
            "activeTab" : option
        }
    };

    let appEvent = $A.get("e.c:OSBMarketplaceTabEvent");
        appEvent.setParams({
            "marketplaceTab" : option
        });
    appEvent.fire();

    navService.navigate(pageReference);
    this.closeMenuEvent(component);    
   },

   redirecttoDeviceManagement : function(component, option) {
        
    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "Profile_and_Settings__c",
        },
        state : {
            "activeTab" : option
            
        }
        
    };
    let appEvent = $A.get("e.c:OSBProfileAndSettingsEvent");
    appEvent.setParams({
        "selectedNavItem" : option
    });
    
    appEvent.fire();
    navService.navigate(pageReference);
    this.closeMenuEvent(component);
    
},
   setAuthorisation : function(component) {
    component.set("v.showTeamProfile",false);
},

toggleCommunity : function(component, comClicked) {
    component.set("v.communityClicked", !comClicked);
},

setNotifications : function(component, notifications) {
    let displayedNotifications = notifications > 99 ? '99+' : notifications;
    component.set("v.displayedUnreadNotifications", displayedNotifications);
    component.set("v.unreadNotificationsNumber", notifications);
},

toggleCollaborate : function(component, colClicked) {
    component.set("v.collaborateClicked", !colClicked);
},

sendMarketPlaceTabEvent : function(component, option) {
    let appEvent = $A.get("e.c:OSBMarketplaceTabEvent");
    appEvent.setParams({
        "marketplaceTab" : option
    });

    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "Home",
        },
        state : {
            "activeTab" : option,
            "section" : "MarketPlace"
        }
    };
    
    navService.navigate(pageReference);
    appEvent.fire();
    this.closeMenuEvent(component);
},

closeMobileMenu : function(component) {
    component.set('v.mobileMenuToggled', false);
    this.closeMenuEvent(component);
},

closeMenuEvent : function(component){
    let notificationNum = component.get("v.unreadNotificationsNumber")
    let appEvent = $A.get("e.c:OSBMobileMenuToggledEvent");
    appEvent.setParams({
        "menuOpened": false ,
        "isMobileView": true,
        "unreadNotificationsNumber" : parseInt(notificationNum),
        "showTeamProfile" : component.get("v.showTeamProfile")
    });
    appEvent.fire();
},

dispatchTabEvent : function(tabName) {
    let tabEvent = $A.get("e.c:OSBChangeTabEvent");
    tabEvent.setParams({
        "tabName" : tabName
    });
    tabEvent.fire(); 
},

navigateNotifications : function(component) {
    let navService = component.find("navService");
    let pageReference = {
        type: "comm__namedPage",
        attributes: {
            name: "Notifications__c"
        }
    };
    navService.navigate(pageReference);
},

loadInsightsUrl : function(component) {        
    let action = component.get("c.getInsights");  
    action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === "SUCCESS") { 
            let urlValue = response.getReturnValue()["WebUrl"];
            component.set("v.InsightUrl", urlValue); 
        }    
        else if (state === "ERROR") {
            let errors = response.getError();
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