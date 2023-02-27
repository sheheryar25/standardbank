({
    init : function(component, event, helper) {
        let urlSearchString = window.location.search;

        if(urlSearchString != null && urlSearchString != ''){
            let urlParams = String(urlSearchString).split('?');
            let sUrlVarList = urlParams[1].split('&');
            
            sUrlVarList.forEach(function(urlVar, index) {
                let item = urlVar.split('=');
                if(item[0] === 'section'){
                    if(item[1] !== '' && item[1] !== undefined){
                        component.set("v.currentTab", item[1]);
                    }
                }
            });
        }
        helper.loadInsightsUrl(component);
    },
    
    openInsights : function(component, event, helper) {
        helper.openInsights(component);
    },

    handleTabChange : function(component, event, helper) {
        component.set("v.currentTab", event.getParam("tabName"));
        helper.notifyAnalytics(event.getParam("tabName"));
    },

    handleMenuToggled : function(component, event, helper) {
        let menuOpened = event.getParam("menuOpened");
        
        helper.toggleMenu(menuOpened);
    },

    clickedOverview : function(component, event, helper){
        let ovClicked = component.get("v.overviewClicked");
        helper.toggleOverview(component, ovClicked);
    },

    clickedTeamProfile : function(component, event, helper){
        let tpClicked = component.get("v.teamProfileClicked");
        helper.toggleTeamProfileMenu(component, tpClicked);
    },

    clickedNotifications : function(component, event, helper) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Notifications__c"
            }
        };
        navService.navigate(pageReference);
    },


    clickedCodeOfConduct : function(component, event, helper){
        let selectedMenuItem = "codeconduct";
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedChangePassword : function(component, event, helper){
        let selectedMenuItem = "changePasswordPing";
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedTeamProfile : function(component, event, helper){
        let tpClicked = component.get("v.teamProfileClicked");
        helper.toggleTeamProfileMenu(component, tpClicked);
    },

    clickedTeamProfileLink : function(component, event, helper) {
        helper.openTeamProfile(component);
    },

    clickedPandS : function(component, event, helper){
        let pSClicked = component.get("v.profileAndSettingsClicked");
        helper.togglePAndSMenu(component, pSClicked);
    },

    handleReadNotification : function(component, event, helper) {
        let notifications = component.get("v.unreadNotificationsNumber");
        helper.setNotifications(component, --notifications);
    },

    openProduct : function(component, event, helper) {
        helper.openProduct(component, event, helper);
    },

    openDashboard : function(component, event, helper) {
        helper.openDashboard(component, event, helper);
    },

    clickedProfileandSettings: function(component, event, helper) {
        let selectedMenuItem = "editProfileAndSettings";
        
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedProfile : function(component, event, helper) {
        let selectedMenuItem = "editProfile";
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedDeviceManagement: function(component, event, helper) {
        let selectedMenuItem = "DeviceManagement";
        helper.redirecttoDeviceManagement(component, selectedMenuItem);
    },

    clickedConditions : function(component, event, helper){
        let selectedMenuItem = "conditions";
        helper.handleSelect(component, selectedMenuItem);
    },
     
    clickedSignOut : function(component, event, helper){
        let selectedMenuItem = "signOut";
        helper.handleSelect(component, selectedMenuItem);
    },

    handleAuthorization : function(component, event, helper){
        let selectedMenuItem = "changePasswordPing";
        helper.setAuthorisation(component, event);
    },

    clickedOverview : function(component, event, helper){
        let ovClicked = component.get("v.overviewClicked");
        helper.toggleOverview(component, ovClicked);
    },
     
    openSolutionShowcase : function(component, event, helper) {
        helper.openSolutionShowcase(component);
    },

    clickedInviteTeamMembers : function(component, event, helper) {
        let chosenOption = "Invite_Members";
        helper.redirectOnTeamProfile(component, chosenOption);
    },

    clickedPendingApprovals : function(component, event, helper) {
        let chosenOption = "Approvals";
        helper.redirectOnTeamProfile(component, chosenOption);
    },

    clickedTeamDetails : function(component, event, helper) {
        let chosenOption = "Team_Details";
        helper.redirectOnTeamProfile(component, chosenOption);
    },

    clickedBeHeard : function(component, event, helper) {
        let chosenOption = "BeHeard";
        helper.sendMarketPlaceTabEvent(component, chosenOption);
    },

    clickedActivity : function(component, event, helper) {
        let chosenOption = "MyActivity";
        helper.sendMarketPlaceTabEvent(component, chosenOption);
    },

    clickedBookmarks : function(component, event, helper) {
        let chosenOption = "Bookmarks";
        helper.sendMarketPlaceTabEvent(component, chosenOption);
    },

    clickedSubmitIdea : function(component, event, helper) {
        let chosenOption = "SubmitAnIdea";
        helper.sendMarketPlaceTabEvent(component, chosenOption);
    },

    clickedSubmitProblem : function(component, event, helper) {
        let chosenOption = "SubmitABusinessProblem";
        helper.sendMarketPlaceTabEvent(component, chosenOption);
    },

    handleMenuToggled : function(component, event, helper) {
        let notificationsNum = event.getParam("unreadNotificationsNumber");
        let isMobile = event.getParam("isMobileView");
        let showTeamProfile = event.getParam("showTeamProfile");

        helper.setNotifications(component, notificationsNum, isMobile, showTeamProfile);
    },

    clickedNotifications : function(component, event, helper) {
        helper.navigateNotifications(component);
    },

    clickedProfile : function(component, event, helper) {
        let selectedMenuItem = "editProfile";
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedCodeOfConduct : function(component, event, helper){
        let selectedMenuItem = "codeconduct";
        helper.handleSelect(component, selectedMenuItem);
    },

    clickedConditions : function(component, event, helper){
        let selectedMenuItem = "conditions";
        helper.handleSelect(component, selectedMenuItem);
    },
    
    clickedSignOut : function(component, event, helper){
        let selectedMenuItem = "signOut";
        helper.handleSelect(component, selectedMenuItem);
    },
    
    clickedChangePassword : function(component, event, helper){
        let selectedMenuItem = "changePasswordPing";
        helper.handleSelect(component, selectedMenuItem);
    },

    handleAuthorization : function(component, event, helper){
        let selectedMenuItem = "changePasswordPing";
        helper.setAuthorisation(component, event);
    },

    clickedCommunity : function(component, event, helper){
        let comClicked = component.get("v.communityClicked");
        helper.toggleCommunity(component, comClicked);
    },

    clickedCollaborate : function(component, event, helper){
        let colClicked = component.get("v.collaborateClicked");
        helper.toggleCollaborate(component, colClicked);
    },

    clickedContactUs : function(component, event, helper) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "OPTL_Contact_Us__c"
            }
        };
        navService.navigate(pageReference);
    },

    closeMobileMenu: function(component, event, helper) {
        helper.closeMobileMenu(component);
        document.body.style.overflow = "auto";
    }
})