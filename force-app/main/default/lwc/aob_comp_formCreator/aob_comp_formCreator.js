import { LightningElement, track, api } from 'lwc';
/*Apex Actions */
import getFields from '@salesforce/apex/AOB_CTRL_FormCreator.getFields';
import { FlowNavigationNextEvent, FlowAttributeChangeEvent, FlowNavigationBackEvent } from 'lightning/flowSupport';
export default class Aob_comp_formCreator extends LightningElement {
    displayMSError = false;
    @track getMsError = false;
    @track multiselectError = "";
    @api isSales = false;
    @api isCurr = false;
    @api availableActions = [];
    constants = {
        NEXT: 'NEXT',
        BACK: 'BACK'
    }
    @api applicationId;
    @api screenName;
    screenTitle;
    screenSubtitle;
    isLoaded;
    @track form;
    @track taxInputs;
    taxListError;
    @track sections;
    //This attribute would contain all the values of the fields of the form
    @track formDetails = {};
    //stringified data of the form
    @api jsonData;
    gridClass;
    /**
    * @description connectedcallback to set inital config
    */
    connectedCallback() {
        this.getFieldsF();
    }
    /**
     * @description handles changes to tax section
     */
    handletaxvaluechange(event) {
        this.taxInputs = event.detail;
        this.taxListError = '';
    }
    /**
   * @description handles changes to child components
   */
    genericComponentChange(event) {
        let value = event.detail.value;
        let name = event.detail.target;
        this.formDetails[name] = value;
        this.removeFieldErrors(name);
    }

    /**
   * @description sets MS error msg
   */
    multiselectCompChange(event) {
        if (event.detail.text == 0) {
            this.multiselectError = "Please complete this field.";
            this.displayMSError = true;
        }else{
            this.multiselectError = "";
        }
    }

    /**
   * @description handles changes to input fields
   */
    genericFieldChange(event) {
        let value = event.target.value;
        let name = event.target.dataset.name;
        this.formDetails[name] = value;
        this.removeFieldErrors(name);
        console.log(JSON.stringify(this.formDetails));
    }

    getFieldsF() {
        getFields({
            'applicationId': this.applicationId,
            'screenName': this.screenName
        })
            .then(result => {
                this.isLoaded = true;
                console.log(result);
                this.form = result;
                this.screenTitle = result.title;
                this.screenSubtitle = result.subtitle;
                this.sections = result.sections.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
                console.log(JSON.stringify(this.sections));
                this.gridClass = 'aob_form_input slds-col slds-m-top_small slds-small-size_1-of-' + this.smallDeviceColumns + ' slds-medium-size_1-of-' + this.mediumDeviceColumns + ' slds-large-size_1-of-' + this.largeDeviceColumns;
            })
            .catch(error => {
                console.log(error);
            });

    }
    genericRadioChange(event) {
        let name = event.target.dataset.name;
        let value = event.target.dataset.value;
        this.formDetails[name] = value;
        let id = event.target.dataset.id;
        this.removeFieldErrors(name);
        for (let j in this.sections) {
            let fields = this.sections[j].fields;
            for (let i in fields) {
                if (fields[i].parent == id) {
                    if (event.target.dataset.value == fields[i].parentControllingValue) {
                        fields[i].isHidden = false;

                    }
                    else {
                        fields[i].isHidden = true;
                        //Level 1 : Hide also this field's children
                        for (let l in fields) {
                            if (fields[l].parent == fields[i].id) {
                                fields[l].isHidden = true;
                            }
                        }
                    }
                }
            }
            this.sections[j].fields = fields;
            fields.sort(function (a, b) {
                return parseFloat(a.sequence) - parseFloat(b.sequence);
            });
        }
    }
    /**
     * @description Method to remove errors
     */
     removeFieldErrors(name) {
        for (let j in this.sections) {
            for (let i in this.sections[j].fields) {
                if (name === this.sections[j].fields[i].name) {
                    this.sections[j].fields[i].showError = false;
                }

            }
        }
    }
    /**
     * @description Method to remove errors
     */
    removeError(element) {
        element.setCustomValidity("");
        element.reportValidity();
        for (let j in this.sections) {
            for (let i in this.sections[j].fields) {
                if (element.dataset.id === this.sections[j].fields[i].id) {
                    this.sections[j].fields[i].showError = false;
                }

            }
        }
    }
    /**
    * @description method to check if there are any unfilled fields
    */
    checkForm(){
        let isValid=true;
        for (let j in this.sections) {
            for (let i in this.sections[j].fields) {
                this.sections[j].fields[i].showError=false;
                if(!this.sections[j].fields[i].isHidden && this.sections[j].fields[i].isRequired ){
                    if(!this.formDetails[this.sections[j].fields[i].name] ){
                        this.sections[j].fields[i].showError=true;
                        isValid=false;
                    }
                }
            }
        }
        return isValid;

    }

    /**
    * @description method to move to next screen
    */
    continueToNextPage() {
        if (this.checkForm()) {
            // check if NEXT is allowed on this screen
            if (this.availableActions.find(action => action === this.constants.NEXT)) {
                // navigate to the next screen
                const attributeChangeEvent = new FlowAttributeChangeEvent('jsonData', JSON.stringify(this.formDetails));
                this.dispatchEvent(attributeChangeEvent);
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }
        }
    }

    /**
    * @description method to move to previous screen
    */
    backToPreviousPage() {
        // check if NEXT is allowed on this screen
        if (this.availableActions.find(action => action === this.constants.BACK)) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationBackEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }

    /**
   * @description Method to check if all required fields are filled
   */
    validateForm() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input').forEach(element => {
            this.removeError(element);
            if (element.required && !element.value) {
                element.setCustomValidity(element.dataset.errorMessage);
                element.reportValidity();
                element.focus();
                isValid = false;
            } else if (!element.reportValidity()) {
                isValid = false;
            }
        });
        this.template.querySelectorAll('lightning-combobox').forEach(element => {
            this.removeError(element);
            if (element.required && !element.value) {
                element.setCustomValidity(element.dataset.errorMessage);
                element.reportValidity();
                element.focus();
                isValid = false;
            } else if (!element.reportValidity()) {
                isValid = false;
            }
        });
        this.template.querySelectorAll('input').forEach(element => {
            for (let j in this.sections) {
                for (let i in this.sections[j].fields) {
                    if (element.dataset.id === this.sections[j].fields[i].id && !this.formDetails[element.dataset.name]) {
                        this.sections[j].fields[i].showError = true;
                        isValid = false;
                    }

                }
            }
        });
        //check MS
        if (this.displayMSError){
            this.getMsError = true;
            isValid = false;
        }
        return isValid;
    }
}