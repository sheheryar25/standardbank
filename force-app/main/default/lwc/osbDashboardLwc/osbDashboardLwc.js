import { LightningElement, api, track ,wire} from 'lwc';
import Id from '@salesforce/user/Id';
import getOnboardingDetails from '@salesforce/apex/OSB_Dashboard_CTRL.getOnboardingDetails';
import hasRegisteredDevices from '@salesforce/apex/OSB_Dashboard_CTRL.hasRegisteredDevices';
import messageChannel from '@salesforce/messageChannel/osbMenuEvents__c';
import { subscribe, MessageContext } from 'lightning/messageService';

export default class OsbDashboardlwc extends LightningElement {
    @track showDashboard;
    @track showApplicationMarketPlace;
    @track showInsights;
    @track isMobile = false;
    @track showMiniMall = false;
    @track showFeature = true;

    subscription = null;
    isDashboard;
    isApplicationMarketPlace;
    isApplicationGallery;
    showToast;
    showToastFail;
    deviceNotRegistered;
    isLoading;
    userContactId;
    isAdditionalOnboardingRequired;

    userId = Id;

    @wire(MessageContext)
    MessageContext;

    handleSubscribe() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.MessageContext, messageChannel, (message) => {
            if(message.ComponentName === 'Header'){
                if(message.Details.tabName === 'Dashboard'){
                    this.showDashboard = true;
                    this.showApplicationMarketPlace = false;
                    this.showApplicationGallery = false;
                    this.showMiniMall = false;
                    this.showFeature = false;
                    this.showInsights = false;
                }
                if(message.Details.tabName === 'Application Marketplace'){
                    this.showApplicationMarketPlace = true;
                    this.showDashboard = false;
                    this.showApplicationGallery = false;
                    this.showFeature = true;
                    this.showInsights = false;
                }
                if(message.Details.tabName === 'Insights'){
                    this.showInsights = true;
                    this.showApplicationMarketPlace = false;
                    this.showDashboard = false;
                    this.showMiniMall = false;
                    this.showFeature = false;
                }
            }else if(message.ComponentName === 'Bread crumb'){
                this.showApplicationMarketPlace = true;
                this.showDashboard = false;
                this.showApplicationGallery = false;
                this.showFeature = true;
            }
            if(message.ComponentName === 'Header Mobile'){
                this.isMobile = message.Details.isMobile; 
            }
        });
    }

    handleRefresh(event){
        this.dispatchEvent( new CustomEvent('refreshrecords', {detail:event.detail}));
    }

    connectedCallback() {
      this.handleSubscribe();
      this.showDashboard = true;
      this.isDashboard = true;
      this.isApplicationMarketPlace = false;
      this.showInsights = false;
      this.deviceNotRegistered = false;
      document.cookie = "firstTimeUser=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax;";
      let sPageURL = decodeURIComponent(window.location);
      let sURLVariables = sPageURL.split("?");
      if (sURLVariables.length > 1) {
        let sURLVariableName = sURLVariables[1].split("=");
        if (sURLVariableName[0] === "success" && sURLVariableName[1] === "true") {
          this.showToast = true;
          setTimeout(function () {
            this.showToast = false;
          }, 5000);
        }
      }
  
      this.isLoading = false;
      getOnboardingDetails()
      .then(data => {
          let contact = JSON.parse(JSON.stringify(data));
          if(contact){
              if(!contact.OSB_HideMFA__c){
                  let visited = sessionStorage.getItem('visited');
                  if(!visited){
                      sessionStorage.setItem('visited', true);
                  }
                  hasRegisteredDevices()
                  .then(data => {
                      let responseMap = JSON.parse(JSON.stringify(data));
                      if(responseMap){
                          if("DeviceMap1" in responseMap){
                              this.deviceNotRegistered = false;
                          }else{
                            if(!visited){
                              this.deviceNotRegistered = true;
                            }
                          }
                      }
                  })
              }
              else{
                  this.deviceNotRegistered = false;
              }
          }
          if(contact && contact.Onboarding_Tour_Date__c == null) {
              this.userContactId = contact.Id;
              let userRole = contact.OSB_Community_Access_Role__c;
              let AdditionalOnboardingRequired = (userRole === 'Authorised Person' || userRole === 'Designated Person');
              this.isAdditionalOnboardingRequired = AdditionalOnboardingRequired;
          }
      })
    }

    handleErrorFired(event){
        var errorCode = event.getParam("errorCode");
        if(errorCode === "4401"){
            this.showToastFail = true;
        }
        else{
            this.showToastFail = true;
        }

    }

    handleEventAdd(){
        this.showApplicationMarketPlace = true;
        this.showDashboard = false;
        this.showApplicationGallery = false;
        this.dispatchEvent(new CustomEvent('addapps', {
            detail: 'All Applications'
          }));
        this.showMiniMall = true;
        this.showFeature = false;
    }

    handleDisplay(event){
        this.showFeature = event.detail;
    }

    callAddApp(){
        this.template.querySelector("c-osb-add-applications").addapp();
    }

    handleDeviceRegistered(){
        this.deviceNotRegistered = false;
    }

}