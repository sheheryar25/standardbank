({
    logout : function() {
        window.location.replace("/secur/logout.jsp?retUrl=/s/");
    },

    getUnreadNotifications : function(component) {
        let action = component.get("c.getUnreadFeedItemsNumberForUser");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                let unreadNotifications = response.getReturnValue();
                this.setNotifications(component, unreadNotifications);
            }
        });
        $A.enqueueAction(action);
    },
    
    getAuthorisation : function(component) {
        let action = component.get("c.getContactAuth");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                let autorisation = response.getReturnValue();
                if(autorisation == 'Nominated Person'){
                    component.set("v.showTeamProfile",false);
                }                 
            }
        });
        $A.enqueueAction(action);
    },
    
    setNotifications : function(component, notifications) {
        let displayedNotifications = notifications > 99 ? '99+' : notifications;
        component.set("v.displayedUnreadNotifications", displayedNotifications);
        component.set("v.unreadNotificationsNumber", notifications);
    },
    
    changePasswordPing : function(component, event) {
        let action = component.get("c.getChangePasswordUrlPing");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let strURL = response.getReturnValue();
                strURL = encodeURI(strURL);
                window.open(strURL,'_top')
            }
        });
        $A.enqueueAction(action);
    },

    notifyAnalytics : function(component, window, user) {
        let registrationSuccess = (user && !user.LastLoginDate);
        let loginSuccess = document.referrer.includes('/apex/CommunitiesLanding')  ? "true" : "false";
        let urlArray = window.location.pathname.split('/');
        let appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : urlArray[urlArray.length - 1],
            "isSinglePageApp" : false,
            'userRegistrationSuccess' : registrationSuccess,
            'userLoginSuccess' : loginSuccess
        });
        appEvent.fire();
    },
    
    toggleVisibilityForMobileMenu : function(component) {

        let notificationNum = component.get('v.unreadNotificationsNumber');
        let showTeamProfile = component.get('v.showTeamProfile');
        component.set('v.mobileMenuToggled', true);

        let event = $A.get("e.c:OSBMobileMenuToggledEvent");
        event.setParams({
            "menuOpened": true ,
            "isMobileView": true,
            "unreadNotificationsNumber" : parseInt(notificationNum),
            "showTeamProfile" : showTeamProfile,
            "currentBreadcrumbItem" : component.get('v.currentTab')
        });
        event.fire();
    },

    closeMobileMenu : function(component) {
        let notificationNum = component.get('v.unreadNotificationsNumber');
        let showTeamProfile = component.get('v.showTeamProfile');
        component.set('v.mobileMenuToggled', false);

        let event = $A.get("e.c:OSBMobileMenuToggledEvent");
        event.setParams({
            "menuOpened": false ,
            "isMobileView": true,
            "unreadNotificationsNumber" : parseInt(notificationNum),
            "showTeamProfile" : showTeamProfile
        });
        event.fire();
    },
    
    dispatchTabEvent : function(tabName) {
        let tabEvent = $A.get("e.c:OSBChangeTabEvent");
        tabEvent.setParams({
            "tabName" : tabName
        });
        tabEvent.fire(); 
    },

    selectTab : function(component, selectedTab) {
        let elements = component.find("section");
        elements.forEach(function(element) {
            if(element.getElement().dataset.tabName == selectedTab) {
               $A.util.addClass(element.getElement(), "breadcrumbs__main-item__selected");
            } else {
               $A.util.removeClass(element.getElement(), "breadcrumbs__main-item__selected");
            }
        });
    },

    notifyAnalyticsTab: function(tabName) {
        let appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },

    toggleMobileMenu : function(component, toggle) {
        component.set("v.mobileMenuToggled", toggle);
    }
})