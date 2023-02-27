/**
* @description  : Partner Portal Regisrtaion Form Sub Component
* User Story : SFP-5159
*
* @author Syed Ovais Ali (syed.ali@standardbank.co.za)
* @date July 2021
*/
import { LightningElement, api } from 'lwc';
import Assets from '@salesforce/resourceUrl/PP_Assets';
import { trackLink } from 'c/ppEventUtils'

export default class PpCommunicationDetails extends LightningElement {

    @api registrationData = new Map();
    @api pageIndex;
    @api termsAndConditionText;
    firstName;
    lastName;
    emailId;
    companyWebsite;
    linkedInProfile;
    termsAndCondition = false;
    isValid;
    icon;
    isModalOpen = false;
    adobeEventFired = false;

    connectedCallback() {
        this.icon = Assets + '/Icons/reg-contact-icon.png';
    }

    @api
    updatedRegistrationDetails() {

        this.registrationData.set('fistName', this.firstName);
        this.registrationData.set('lastName', this.lastName);
        this.registrationData.set('emailId', this.emailId);
        this.registrationData.set('companyWebsite', this.companyWebsite);
        this.registrationData.set('linkedInProfile', this.linkedInProfile);
        this.registrationData.set('termsAndCondition', this.termsAndCondition);

        return this.registrationData;
    }

    handleInputChange(event) {
        
        if (this.adobeEventFired === false) {
            //Adobe Analytics Event
            document.dispatchEvent(new CustomEvent('triggerInteraction', {
                'detail': {
                    eventName: 'globalFormStart',
                    formName: 'Group | Register | Contact Details',
                    formIsSubmitted: false,
                    formStatus: ""
                }
            }));
            this.adobeEventFired =  true;
        }

        if (event.target.name == 'FirstName') {
            this.firstName = event.detail.value;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
        else if (event.target.name == 'LastName') {
            this.lastName = event.detail.value;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
        else if (event.target.name == 'Email') {
            this.emailId = event.detail.value;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
        else if (event.target.name == 'Website') {
            this.companyWebsite = event.detail.value;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
        else if (event.target.name == 'LinkedIn') {
            this.linkedInProfile = event.detail.value;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
        else if (event.target.name == 'TC') {
            this.termsAndCondition = event.detail.checked;
            var inputCmp = this.template.querySelector('.' + event.target.name);
            inputCmp.setCustomValidity("");
        }
    }

    @api
    validateFields() {

        this.isValid = true;
        this.formValidation('lightning-input');
        this.formValidation('input');
        return this.isValid;
    }

    formValidation(inputType) {

        let fieldErrorMsg = "Please Enter";

        this.template.querySelectorAll(inputType).forEach(item => {
            let fieldValue = item.value;
            let fieldLabel = item.label;
            let fieldName = item.name;

            if (fieldName !== "LinkedIn" && fieldName !== "Website") {
                if (item.type === "checkbox") {

                    if (item.checked === false) {
                        this.isValid = false;
                        item.setCustomValidity('This field is required');
                    }
                }
                else if (!fieldValue) {
                    item.setCustomValidity(fieldErrorMsg + ' ' + fieldLabel);
                    this.isValid = false;
                }
                else {
                    item.setCustomValidity("");
                }
                item.reportValidity();
            }
        });

    }

    get renderFlag() {
        return this.pageIndex == 4 ? true : false;
    }

    openModal(event) {
        this.tracker(event);
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    accept() {
        this.termsAndCondition = true;
        this.isModalOpen = false;
    }

    tracker(event) {
        trackLink(event);
    }

}