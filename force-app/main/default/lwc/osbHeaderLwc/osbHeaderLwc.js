import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getUnreadFeedItemsNo from "@salesforce/apex/OSB_Header_CTRL.getUnreadFeedItemsNumberForUser";
import contactAuth from "@salesforce/apex/OSB_Header_CTRL.getContactAuth";
import getChangePasswordUrl from "@salesforce/apex/OSB_Header_CTRL.getChangePasswordUrlPing";
import getTermsLink from "@salesforce/apex/OSB_Header_CTRL.getTermsLink";
import getUserNameIfLoggedIn from "@salesforce/apex/OSB_Header_CTRL.getUserNameIfLoggedIn";
import getApiLink from "@salesforce/apex/OSB_Header_CTRL.getApiLink";
import badge from "@salesforce/resourceUrl/OSB_logoBadge";
import icon from "@salesforce/resourceUrl/OSB_icons";
import getIELoginURL from "@salesforce/apex/OSB_Header_CTRL.getIELoginURL";
import getLoginURL from "@salesforce/apex/OSB_Header_CTRL.getLoginURL";
import Id from '@salesforce/user/Id';
import { publish, MessageContext } from 'lightning/messageService';
import eventChannel from '@salesforce/messageChannel/osbMenuEvents__c';
import { subscribe } from 'lightning/messageService';
import eventChannelReceived from '@salesforce/messageChannel/osbInterCompEvent__c';

export default class OsbHeaderLwc extends NavigationMixin(LightningElement) {

    @track displayedUnreadNotifications;
    @track unreadNotificationsNumber = 0;
    @track autorisation;
    @track showTeamProfile;
    @track isUserLoggedIn;
    @track isGuestUser;
    @track showCookieDisclaimer = true;
    @track loginUrl;
    @track tcLink;
    @track apiSetting;
    @track mobileMenuToggled;
    @track currentTab = 'Dashboard';
    @track mobileDisplayMenu = false;
    @track showDashboard = true;
    @track showApplicationMarketPlace = false;
    @track showApplicationGallery = false;

    @api withMenu;
    @api withUserName;
    @api noOverlay;
    @api showBannerMessage;
    @api withMenuStyle;
    @api menuOpened;

    OSB_logoBadge = badge;
    iconBell = icon+'/ms-icn_bell';
    subscription = null;
    currentTabName = 'Dashboard';

    @wire(MessageContext)
    MessageContextSub;
    handleSubscribe() {
        if (this.subscription) {
          return;
        }
        this.subscription = subscribe(this.MessageContextSub,eventChannelReceived,(message) => {
            if (message.ComponentName == "Notifcations") {
                this.getUnreadNotifications();
            }else{
                let allTabs = this.template.querySelectorAll(".tab");
                allTabs.forEach((element) => {
                    if(element.dataset.id == message.Details.Tab) {
                        element.classList.add("tab-menu-selected");
                        this.notifyAnalyticsTab(message.Details.Tab);
                    }else{
                        element.classList.remove("tab-menu-selected");
                    }
                });
            }
          });
    }

    connectedCallback() {
        this.handleSubscribe();
        getUserNameIfLoggedIn()
        .then(data => {
            if(data){
                this.isUserLoggedIn = 'true';
                this.userName = data.FirstName;
                this.getUnreadNotifications();
                this.getAuthorisation();
            }else{
                this.isGuestUser = 'true';
            }
            this.notifyAnalytics();
        })
    }

    @wire(MessageContext)
    messageContext;
    handleTabChange(tabNameValue){
        const payload = {
            ComponentName: 'Header',
            Details: {
                tabName: tabNameValue
            }
        };
        publish(this.messageContext, eventChannel, payload);
        window.scroll(0,0);
    }

    @wire (getTermsLink)
    tcLink;

    @wire (getApiLink)
    getApiLink({ error, data}){
        if(data){
            this.apiSetting = data;
        }
    }

    renderedCallback(){
        this.setClasses();
        if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  
        {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'unsupportedInternetExplorer__c'
                }
            });
            getIELoginURL().then(data => {
                this.loginUrl = data;
            })
        }else{
            getLoginURL().then(data => {
                this.loginUrl = data;
            })
        }
        if (document.cookie.replace(/(?:(?:^|.*;\s*)firstTimeUser\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true") {
            this.showCookieDisclaimer = false;
        }    
        window.addEventListener('scroll', () => this.handleScroll());
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pageUrl = window.location.pathname;
        let pageUrls = pageUrl.split('/');
        let tabName = urlParams.get('tab') !== null ? urlParams.get('tab') : pageUrls[2];
        if(tabName !== '' && tabName !== this.currentTabName){
            this.handleTabs(tabName);
        }
    }

    handleScroll(){
        if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
            if(this.template.querySelector('[data-id="Dashboard"]') != undefined){
                this.template.querySelector('[data-id="Dashboard"]').classList.add('tab-menu-scroll');
            }
            if(this.template.querySelector('[data-id="Application Marketplace"]') != undefined){
                this.template.querySelector('[data-id="Application Marketplace"]').classList.add('tab-menu-scroll');
            }
            if(this.template.querySelector('[data-id="Insights"]') != undefined){
                this.template.querySelector('[data-id="Insights"]').classList.add('tab-menu-scroll');
            }
            if(this.template.querySelector('[data-id="notifications"]') != undefined && this.unreadNotificationsNumber >= 1){
                this.template.querySelector('[data-id="notifications"]').classList.add('tab-menu-scroll-notif');
            }else{
                this.template.querySelector('[data-id="notifications"]').classList.add('tab-menu-scroll-notif-None');
            }
            if(this.template.querySelector('[data-id="full_terms"]') != undefined){
                this.template.querySelector('[data-id="full_terms"]').style.display = "none";
            }
            if(this.template.querySelector('[data-id="part_terms"]') != undefined){
                this.template.querySelector('[data-id="part_terms"]').style.display = "block";
            }
            if(this.template.querySelector('[data-id="wholeHeader"]') != undefined) {
                this.template.querySelector('[data-id="wholeHeader"]').style.position = "fixed";
                this.template.querySelector('[data-id="wholeHeader"]').style.top = 0;
                this.template.querySelector('[data-id="wholeHeader"]').style.left = 0;
                this.template.querySelector('[data-id="wholeHeader"]').style.width = "100%";
            }
            if(this.template.querySelector('[data-id="banner-message"]') != undefined) {
                this.template.querySelector('[data-id="banner-message"]').classList.add("mobile__banner-message");
            }
            if(this.template.querySelector('[data-id="breadCrumbs"]') != undefined){
                this.template.querySelector('[data-id="breadCrumbs"]').style.marginTop = "-20px";
            }
            if(this.template.querySelector('[data-id="sbLogoContainer"]') != undefined){
                this.template.querySelector('[data-id="sbLogoContainer"]').style.width = "160px";
            }
            if(this.template.querySelector('[data-id="sbLogo"]') != undefined){
                this.template.querySelector('[data-id="sbLogo"]').style.height = "35px";
                this.template.querySelector('[data-id="sbLogo"]').style.width = "140px";
            }
            if(this.template.querySelector('[data-id="sbBadgeLogoContainer"]') != undefined){
                this.template.querySelector('[data-id="sbBadgeLogoContainer"]').style.width = "160px";
            }
            if(this.template.querySelector('[data-id="sbBadgeLogo"]') != undefined){
                this.template.querySelector('[data-id="sbBadgeLogo"]').style.height = "35px";
                this.template.querySelector('[data-id="sbBadgeLogo"]').style.width = "140px";
            }
            if(this.template.querySelector('[data-id="headerNav"]') != undefined){
                this.template.querySelector('[data-id="headerNav"]').style.height = "20px";
                this.template.querySelector('[data-id="headerNav"]').style.padding = "20px 0px";
            }
            if(this.template.querySelector('[data-id="contactUs"]') != undefined){
                this.template.querySelector('[data-id="contactUs"]').style.paddingLeft = "0px";
            }
            if(this.template.querySelector('[data-id="contactUsLink"]') != undefined){
                this.template.querySelector('[data-id="contactUsLink"]').style.paddingLeft = "0px";
            }
            if(this.template.querySelector('[data-id="header-check"]') != undefined){
                this.template.querySelector('[data-id="header-check"]').style.height = "60px";
            }
            if(this.template.querySelector('[data-id="headerButton"]') != undefined){
                this.template.querySelector('[data-id="headerButton"]').style.fontSize = "8px";
                this.template.querySelector('[data-id="headerButton"]').style.lineHeight = "16px";
                this.template.querySelector('[data-id="headerButton"]').style.padding = "0px 0px 20px 34px";
                this.template.querySelector('[data-id="headerButton"]').style.height = "60px";
                this.template.querySelector('[data-id="headerButton"]').style.width = "90px";
                this.template.querySelector('[data-id="headerButton"]').innerHTML = "<div class=\"header__button--right\"> <i style=\"margin-top:20px;\" class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
            }
        } 
        else {
            if(this.template.querySelector('[data-id="Dashboard"]') != undefined){
                this.template.querySelector('[data-id="Dashboard"]').classList.remove('tab-menu-scroll');
            }
            if(this.template.querySelector('[data-id="Application Marketplace"]') != undefined){    
                this.template.querySelector('[data-id="Application Marketplace"]').classList.remove('tab-menu-scroll');
            }
            if(this.template.querySelector('[data-id="Insights"]') != undefined){
                this.template.querySelector('[data-id="Insights"]').classList.remove('tab-menu-scroll');      
            }
            if(this.template.querySelector('[data-id="notifications"]') != undefined && this.unreadNotificationsNumber >= 1){
                this.template.querySelector('[data-id="notifications"]').classList.remove('tab-menu-scroll-notif');
            }else{
                this.template.querySelector('[data-id="notifications"]').classList.remove('tab-menu-scroll-notif-None');
            }
            if(this.template.querySelector('[data-id="full_terms"]') != undefined){
                this.template.querySelector('[data-id="full_terms"]').style.display = "block";
            }
            if(this.template.querySelector('[data-id="part_terms"]') != undefined){
                this.template.querySelector('[data-id="part_terms"]').style.display = "none";
            }
            if(this.template.querySelector('[data-id="wholeHeader"]') != undefined) {
                this.template.querySelector('[data-id="wholeHeader"]').style.position = "relative";
                this.template.querySelector('[data-id="wholeHeader"]').style.top = "unset";
                this.template.querySelector('[data-id="wholeHeader"]').style.left = "unset";
            }
            if(this.template.querySelector('[data-id="banner-message"]') != undefined){
                this.template.querySelector('[data-id="banner-message"]').classList.remove("mobile__banner-message");
            }
            if(this.template.querySelector('[data-id="breadCrumbs"]') != undefined){
                this.template.querySelector('[data-id="breadCrumbs"]').style.marginTop = "";
            }
            if(this.template.querySelector('[data-id="sbLogoContainer"]') != undefined){
                this.template.querySelector('[data-id="sbLogoContainer"]').style.width = "";
            }
            if(this.template.querySelector('[data-id="sbLogo"]') != undefined){
                this.template.querySelector('[data-id="sbLogo"]').style.height = "";
                this.template.querySelector('[data-id="sbLogo"]').style.width = "";
            }
            if(this.template.querySelector('[data-id="sbBadgeLogoContainer"]') != undefined){
                this.template.querySelector('[data-id="sbBadgeLogoContainer"]').style.width = "";
            }
            if(this.template.querySelector('[data-id="sbBadgeLogo"]') != undefined){
                this.template.querySelector('[data-id="sbBadgeLogo"]').style.height = "";
                this.template.querySelector('[data-id="sbBadgeLogo"]').style.width = "";
            }
            if(this.template.querySelector('[data-id="headerNav"]') != undefined){
                this.template.querySelector('[data-id="headerNav"]').style.height = "";
                this.template.querySelector('[data-id="headerNav"]').style.padding = "";
            }
            if(this.template.querySelector('[data-id="contactUs"]') != undefined){
                this.template.querySelector('[data-id="contactUs"]').style.paddingLeft = "";
            }
            if(this.template.querySelector('[data-id="contactUsLink"]') != undefined){
                this.template.querySelector('[data-id="contactUsLink"]').style.paddingLeft = "";
            }
            if(this.template.querySelector('[data-id="header-check"]') != undefined){
                this.template.querySelector('[data-id="header-check"]').style.height = "";
            }
            if(this.template.querySelector('[data-id="headerButton"]') != undefined){
                this.template.querySelector('[data-id="headerButton"]').style.fontSize = "";
                this.template.querySelector('[data-id="headerButton"]').style.lineHeight = "";
                this.template.querySelector('[data-id="headerButton"]').style.padding = "";
                this.template.querySelector('[data-id="headerButton"]').style.height = "";
                this.template.querySelector('[data-id="headerButton"]').style.width = "";
                this.template.querySelector('[data-id="headerButton"]').innerHTML = "<div class=\"header__button--left\" id=\"buttonLeft\"> <span id=\"signIntoYour1\">Sign into your</span> <span id=\"signIntoYour2\">dashboard</span> </div><div class=\"header__button--right\"> <i class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
            }    
        }
    }

    setClasses(){
        let elementHeader = this.template.querySelector('[data-id="header-check"]');
        let elementAcc = this.template.querySelector('[data-id="header-acc"]');
        if(this.mobileMenuToggled){
            this.template.querySelector('[data-id="mobile-menu"]').classList.remove('closed_mobile-menu');
            this.template.querySelector('[data-id="mobile-menu"]').classList.add('hidden');
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.add('header-dropdown');
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.add('mobile__menu');
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.remove('hidden');
        }else{
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.remove('header-dropdown');
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.remove('mobile__menu');
            this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.add('hidden');
            this.template.querySelector('[data-id="mobile-menu"]').classList.remove('hidden');
            this.template.querySelector('[data-id="mobile-menu"]').classList.add('closed_mobile-menu');
        }
        if(!this.withMenu){
            let element = this.template.querySelector('[data-id="with-menu"]');
            element.classList.remove(...element.classList);
            element.classList.add('header-container');  
        }
        if(this.isUserLoggedIn){
            elementHeader.classList.remove(...elementHeader.classList);
            let element2 = this.template.querySelector('[data-id="mobile-sec"]');
            element2.classList.remove(...element2.classList);
            element2.classList.add('header__mobile-menu');    
            if(this.withMenu){
                elementHeader.classList.add('header'); 
                elementHeader.classList.add('withMenu');
            }else{
                elementHeader.classList.add('header');
            }   
        }else{
            this.template.querySelector('[data-id="logged-check"]').classList.remove('header__icon-cont');
            this.template.querySelector('[data-id="mobile-sec"]').classList.add('hidden_nonmobile');
            elementAcc.classList.remove(...elementAcc.classList);
            elementAcc.classList.add('header__account');
            if(!this.withMenu){
                elementHeader.classList.add('header'); 
                elementHeader.classList.add('withMenu'); 
                elementHeader.classList.add('cancel_reverse'); 
            }else{
                elementHeader.classList.add('header');
                elementHeader.classList.add('cancel_reverse');  
            }
        }      
    }

    handleMobielNav(event){
        event.target.dataset.id = event.detail;
        this.handleNav(event);
    }

    handleMobileMenuEvent(event){
        let toggle = event.getParam("menuOpened");
        this.toggleMobileMenu(toggle);
    }

    closeMenu(){
       this.closeMobileMenu();
    }

    hideMobileMenu(){
        this.mobileDisplayMenu = false;
    }

    displayMobileMenu(){
        this.mobileDisplayMenu = true;
    }

    navigateNotifications(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Notifications__c'
            }
        });
    }

    navigateContactUs(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'OPTL_Contact_Us__c'
            }
        });
    }

    handleReadNotification(){
        let notifications = this.unreadNotificationsNumber;
        this.setNotifications(--notifications);
    }

    handleNav(event){
        let url = window.location.pathname.split("/");
        if (url[2] == "") {
            let tabName = event.target.dataset.id;
            event.preventDefault();
            this.handleTabs(tabName);
        }else{
            let tabName = event.target.dataset.id;
            this[NavigationMixin.Navigate]({
            type: "comm__namedPage",
            attributes: {
                name: "Home",
            },
            state: {
                tab: tabName,
            },
            });
        }   
    }

    handleTabs(tabName){
        let allTabs = this.template.querySelectorAll('.tab');
        if(tabName === 'Dashboard'){
          this.showDashboard = true;
          this.showApplicationMarketPlace = false;
          this.showApplicationGallery = false;
        }else if(tabName === 'Application Marketplace'){
            this.showApplicationMarketPlace = true;
            this.showDashboard = false;
            this.showApplicationGallery = false;
        }else if(tabName === 'Insights'){
            this.showApplicationGallery = true;
            this.showApplicationMarketPlace = false;
            this.showDashboard = false;
        }
        allTabs.forEach(element => {
            if(element.dataset.id === tabName){
                element.classList.add('tab-menu-selected');
                if(tabName === 'notifications'){
                    element.classList.remove('tab-menu-selected');
                    if(this.unreadNotificationsNumber >= 1){
                        element.classList.add('tab-menu-selected-notif');
                        element.classList.remove('tab-menu-selected-notif-None');
                    }else{
                        element.classList.add('tab-menu-selected-notif-None');
                        element.classList.remove('tab-menu-selected-notif');
                    }
                }else{
                    element.classList.remove('tab-menu-selected-notif');
                }
            }else{
                element.classList.remove('tab-menu-selected');
            }
        });
        const selectedEvent = new CustomEvent("tabSelected", {
            detail: tabName,
          });
          this.dispatchEvent(selectedEvent);
          this.handleTabChange(tabName);
          this.notifyAnalyticsTab(tabName);
    }

    handleSelect(event){
        let pageName;
        let selectedMenuItem = event.detail.value;
        switch(selectedMenuItem) {
            case 'editProfile':
                pageName = 'Profile_and_Settings__c';
                break;
            case 'changePasswordPing':
                this.changePasswordPing();
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
        if(pageName !== undefined) {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: pageName
                }
            });
        }
    }

    testAdobe(){
       core._satellite.track('LoginSuccess');
    }

    handleCloseEvent(event){
        this.mobileMenuToggled = event.detail.menuOpened;
        this.menuOpened = event.detail.menuOpened;
        this.isMobileView = event.detail.isMobileView;
        this.unreadNotificationsNumber = event.detail.unreadNotificationsNumber;
        this.showTeamProfile = event.detail.showTeamProfile;
        this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.add('hidden');
        const payload = {
            ComponentName: 'Header Mobile',
            Details: {
                isMobile: false
            }
        };
        publish(this.messageContext, eventChannel, payload);
    }

    closeMobileMenu(){
        this.closeMobileMenu();
        document.body.style.overflow = "auto";
    }

    openMobileMenu(){
        this.toggleVisibilityForMobileMenu();
    }

    logout(){
        window.location.replace("/secur/logout.jsp?retUrl=/s/");
    }

    getUnreadNotifications(){
        getUnreadFeedItemsNo()
        .then(data => {
            if(data){
                let displayedNotifications = data > 99 ? '99+' : data; 
                this.displayedUnreadNotifications = data > 1 ? true : false;
                this.unreadNotificationsNumber = displayedNotifications;
            }else{
                this.template.querySelector('[data-id="mobile-sec"]').style.marginTop = "3%";
                this.template.querySelector('[data-id="menu-notifications"]').style.marginTop = "2px";
            }
        })
    }

    getAuthorisation(){
        contactAuth().then(data => {
            this.autorisation = data;
            if(data === 'Nominated Person'){
                this.showTeamProfile = false;
            }else{
                this.showTeamProfile = true;
            }
        })
    }

    changePasswordPing(){
        getChangePasswordUrl().then(data => {
            let strURL = data;
            strURL = encodeURI(strURL);
            window.open(strURL, "_top");
        })
    }

    notifyAnalytics(){
        let loginSuccess = document.referrer.includes('/apex/CommunitiesLanding')  ? "true" : "false";
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        document.dispatchEvent(new CustomEvent('triggerInteraction', {
            'detail': {
                eventName: 'globalVirtualPageView',
                siteCountry : "South Africa",
                siteErrorCode : "",
                siteLanguage : "English",
                pageName : "Dashboard",
                pageCategory : "",
                pageSubSection1 : "Dashboard",
                pageSubSection2 : "",
                pageSubSection3 : "",
                pageSubSection4 : "",
                userLogin: {
                    loginTime: dateTime, 
                    loginSuccess: loginSuccess,
                    loginSuccessPersist: "true",
                    userID: Id
                }
            }
          }));
    }

    toggleVisibilityForMobileMenu(){
        this.menuOpened = true;
        this.mobileMenuToggled = true;
        this.template.querySelector('c-osb-mobile-menu-lwc').handleMenuToggled(this.menuOpened);
        this.template.querySelector('[data-id="Mobile-menu-toggled"]').classList.remove('hidden');
        const payload = {
            ComponentName: 'Header Mobile',
            Details: {
                isMobile: true
            }
        };
        publish(this.messageContext, eventChannel, payload);

    }

    dispatchTabEvent(tabName){
        const selectedEvent = new CustomEvent('selected', { detail: this.contact.Id });
        this.dispatchEvent(selectedEvent);
    }

    notifyAnalyticsTab(tabName){
        let loginSuccess = document.referrer.includes('/apex/CommunitiesLanding')  ? "true" : "false";
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        document.dispatchEvent(new CustomEvent('triggerInteraction', {
            'detail': {
                eventName: 'globalVirtualPageView',
                siteCountry : "South Africa",
                siteErrorCode : "",
                siteLanguage : "English",
                pageName : tabName,
                pageCategory : "",
                pageSubSection1 : tabName,
                pageSubSection2 : "",
                pageSubSection3 : "",
                pageSubSection4 : "",
                userLogin: {
                    loginTime: dateTime, 
                    loginSuccess: loginSuccess,
                    loginSuccessPersist: "true",
                    userID: Id
                }
            }
          }));
    }

    toggleMobileMenu(toggle){
        this.mobileMenuToggled = toggle;
    }

}