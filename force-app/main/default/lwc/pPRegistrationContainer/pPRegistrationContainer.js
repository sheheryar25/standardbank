/**
* @description  : Partner Portal Registration From Component
* User Story : SFP-5159
*
* @author Syed Ovais Ali (syed.ali@standardbank.co.za)
* @date July 2021
*/
import { LightningElement, track, api } from 'lwc';
import Assets from '@salesforce/resourceUrl/PP_Assets';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import partnershipRegistration from '@salesforce/apex/PP_RegistrationForm_CTRL.partnershipRegistration';
import { trackLink } from 'c/ppEventUtils'

export default class PPRegistrationContainer extends LightningElement {

  @api termsAndConditionText;
  logo;
  backgroundImage;
  currentStep = 1;
  backBtnFlag = false;
  nextBtn = true;
  objRegistrationDetails;
  @track
  registrationDataMap = new Map();
  isProcessing = false;
  guid;
  stepDetailNext;
  stepDetailBack;

  connectedCallback() {
    this.backgroundImage = Assets + '/images/reg-bg.jpg';
    this.logo = Assets + '/logos/logo.png';
    this.stepDetailNext = 'your company details | next button click';
    this.generateGuid();

    //Adobe Analytics
    this.adobeAnalyticsPageView();

    document.dispatchEvent(new CustomEvent('triggerInteraction', {
      'detail': {
        eventName: 'triggerApplicationStart',
        pageName: "Registration:Step 1",
        pageSubSection1: "Registration:Step 1",
        application: {
          applicationID: this.guid,
          applicationStep: 'Step 1',
          applicationName: 'Register for PartnerConnect',
          applicationStart: true,
          applicationComplete: false
        },
        loginStatus: "guest",
        userLoginSuccess: "false",
        userRegistrationSuccess: "false"
      }
    }));

  }

  handleNext(event) {
    this.tracker(event);
    if (this.currentStep == 1) {
      if (this.validate('c-pp-Company-Information')) {
        this.currentStep = 2;
        this.backBtnFlag = true;
        this.setorUpdateRegistrationData('c-pp-Company-Information');
        let nextBtn = this.template.querySelector('[data-id="next-btn"]');
        nextBtn.className = 'slds-button slds-button_neutral btn btn-next';
        this.stepDetailNext = 'your partnership goal | next button click';
        this.stepDetailBack = 'your partnership goal | back button click';
        //Adobe Analytics
        this.adobeAnalyticsPageView();
        this.adobeAnalyticsFormCompleted();
        document.dispatchEvent(new CustomEvent('triggerInteraction', {
          'detail': {
            eventName: '',
            pageName: "Registration:Step 2",
            pageSubSection1: "Registration:Step 2",
            application: {
              applicationID: this.guid,
              applicationStep: 'Step 2',
              applicationName: 'Register for PartnerConnect',
              applicationStart: true,
              applicationComplete: false
            }
          }
        }));

      }

    }
    else if (this.currentStep == 2) {
      if (this.validate('c-pp-partnership-goal')) {
        this.currentStep = 3;
        this.setorUpdateRegistrationData('c-pp-partnership-goal');
        this.stepDetailNext = 'your business idea | next button click';
        this.stepDetailBack = 'your business idea | back button click';

        //Adobe Analytics
        this.adobeAnalyticsPageView();
        this.adobeAnalyticsFormCompleted();
        document.dispatchEvent(new CustomEvent('triggerInteraction', {
          'detail': {
            eventName: '',
            pageName: "Registration:Step 3",
            pageSubSection1: "Registration:Step 3",
            application: {
              applicationID: this.guid,
              applicationStep: 'Step 3',
              applicationName: 'Register for PartnerConnect',
              applicationStart: true,
              applicationComplete: false
            }
          }
        }));

      }

    }
    else if (this.currentStep == 3) {
      if (this.validate('c-pp-brief-description')) {
        this.currentStep = 4;
        this.setorUpdateRegistrationData('c-pp-brief-description');
        this.stepDetailNext = 'communication details | next button click';
        this.stepDetailBack = 'communication details | back button click';


        //Adobe Analytics
        this.adobeAnalyticsPageView();
        this.adobeAnalyticsFormCompleted();
        document.dispatchEvent(new CustomEvent('triggerInteraction', {
          'detail': {
            eventName: '',
            pageName: "Registration:Step 4",
            pageSubSection1: "Registration:Step 4",
            application: {
              applicationID: this.guid,
              applicationStep: 'Step 4',
              applicationName: 'Register for PartnerConnect',
              applicationStart: true,
              applicationComplete: false
            }
          }
        }));
      }
    }
    else if (this.currentStep == 4) {
      if (this.validate('c-pp-communication-details')) {
        this.setorUpdateRegistrationData('c-pp-communication-details');
        this.registration();
      }

    }
  }

  handleBack(event) {
    this.tracker(event);
    if (this.currentStep !== 2) {
      let nextBtn = this.template.querySelector('[data-id="next-btn"]');
      nextBtn.className = 'slds-button slds-button_neutral btn btn-next';
    }

    if (this.currentStep == 4) {
      this.stepDetailNext = 'your business idea | next button click';
      this.stepDetailBack = 'your business idea | back button click';
      this.currentStep = 3;
    }
    else if (this.currentStep == 3) {
      this.stepDetailNext = 'your partnership goal | next button click';
      this.stepDetailBack = 'your partnership goal | back button click';
      this.currentStep = 2;
    }
    else if (this.currentStep == 2) {
      this.stepDetailNext = 'your company details | next button click';
      let nextBtn = this.template.querySelector('[data-id="next-btn"]');
      nextBtn.className = 'slds-button slds-button_neutral btn next-btn';
      this.currentStep = 1;
      this.backBtnFlag = false;
    }
  }

  setorUpdateRegistrationData(cmpName) {
    const updatedDetails = this.template.querySelector(cmpName);
    this.registrationData = updatedDetails.updatedRegistrationDetails();
  }

  registration() {

    this.isProcessing = true;

    let partnership = { 'sobjectType': 'PP_PartnerApplication__c' };
    partnership.Name = this.registrationData.get('business_name');
    partnership.PP_RegistrationNumber__c = this.registrationData.get('registration_no');
    partnership.PP_Industry__c = this.registrationData.get('industry');
    partnership.PP_Capabilities__c = this.registrationData.get('capabilities');
    partnership.PP_PartnershipGoal__c = this.registrationData.get('partnershipValues');
    partnership.PP_OperatingCountry__c = this.registrationData.get('country');
    partnership.PP_SolutionDetails__c = this.registrationData.get('description');
    partnership.PP_FirstName__c = this.registrationData.get('fistName');
    partnership.PP_LastName__c = this.registrationData.get('lastName');
    partnership.PP_EmailAddress__c = this.registrationData.get('emailId');
    partnership.PP_Website__c = this.registrationData.get('companyWebsite');
    partnership.PP_LinkedInProfile__c = this.registrationData.get('linkedInProfile');
    partnership.PP_TermsConditionsAccepted__c = this.registrationData.get('termsAndCondition');
    partnership.PP_PartnershipGoalOther__c = this.registrationData.get('partnershipGoalOther');
    partnership.PP_Currency__c = this.registrationData.get('currency');
    partnership.PP_AnnualBusinessTurnover__c = this.registrationData.get('turnover');

    let fileDate = this.registrationData.get('fileData');
    let base64;
    let filename;
    if (fileDate) {
      base64 = fileDate.base64;
      filename = fileDate.filename;
    }
    partnershipRegistration({ registrationDetails: partnership, base64: base64, filename: filename }).then(response => {
      this.isProcessing = false;
      this.currentStep = 5;
      this.nextBtn = false;
      this.backBtnFlag = false;


      //Adobe Analytics
      this.adobeAnalyticsPageView();
      this.adobeAnalyticsFormCompleted();
      document.dispatchEvent(new CustomEvent('triggerInteraction', {
        'detail': {
          eventName: 'triggerApplicationComplete',
          pageName: "Registration:Step 5",
          pageSubSection1: "Registration:Step 5",
          formName: 'Group | Register | Thank You',
          userRegistrationSuccess: true,
          application: {
            applicationID: this.guid,
            applicationStep: 'Step 5',
            applicationName: 'Register for PartnerConnect',
            applicationStart: true,
            applicationComplete: true
          }
        }
      }));

    }).catch(error => {
      this.isProcessing = false;
      this.toast('Server Error', 'error');
    });

  }

  validate(cmpName) {
    const validatation = this.template.querySelector(cmpName);
    return validatation.validateFields();
  }

  toast(title, toastVariant) {
    const toastEvent = new ShowToastEvent({
      title,
      variant: toastVariant
    })
    this.dispatchEvent(toastEvent)
  }


  generateGuid() {
    let lut = [];
    for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
    let d0 = Math.random() * 0xffffffff | 0;
    let d1 = Math.random() * 0xffffffff | 0;
    let d2 = Math.random() * 0xffffffff | 0;
    let d3 = Math.random() * 0xffffffff | 0;
    this.guid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }

  adobeAnalyticsPageView() {
    document.dispatchEvent(new CustomEvent('triggerInteraction', {
      'detail': {
        eventName: 'globalVirtualPageView',
        pageName: "Registration",
        pageCategory: "Personal",
        pageSubSection1: "Registration"
      }
    }));
  }


  adobeAnalyticsFormCompleted() {
    document.dispatchEvent(new CustomEvent('triggerInteraction', {
      'detail': {
        eventName: 'globalFormComplete',
        formIsSubmitted: true,
        formStatus: "submitted"
      }
    }));
  }

  tracker(event) {
    trackLink(event);
  }
}