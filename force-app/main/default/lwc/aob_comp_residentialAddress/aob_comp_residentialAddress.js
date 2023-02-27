import { 
    LightningElement,
    api,
    track
 } from 'lwc';

/**Labels */
import AOB_UnitNumber from '@salesforce/label/c.AOB_ResidentialAddress';
import AOB_ComplexBuildingName from '@salesforce/label/c.AOB_ResidentialAddress_ComplexBuildingName';
import AOB_StreetNumberAndName from '@salesforce/label/c.AOB_ResidentialAddress_StreetNumber_Name'
import AOB_Suburb from '@salesforce/label/c.AOB_ResidentialAddress_Suburb';
import AOB_CityTown from '@salesforce/label/c.AOB_ResidentialAddress_City_Town';
import AOB_Province from '@salesforce/label/c.AOB_ResidentialAddress_Province';
import AOB_PostalCode from '@salesforce/label/c.AOB_ResidentialAddress_Postal';
import AOB_Title from     '@salesforce/label/c.AOB_ResidentialAddress_title';
import AOB_Subtitle from '@salesforce/label/c.AOB_ResidentialAddress_Subtitle';
import AOB_SelectionLabel from '@salesforce/label/c.AOB_SelectPlaceHolder';
import  getAllPicklistEntries from '@salesforce/apex/AOB_CTRL_PersonalDetails.getAllPicklistEntriesCodes';
import { FlowNavigationNextEvent} from 'lightning/flowSupport';
import { FlowNavigationBackEvent} from 'lightning/flowSupport';


//Apex Controllers
//Static Resources
import THEME_OVERRIDES from '@salesforce/resourceUrl/AOB_ThemeOverrides';
import FireAdobeEvents from '@salesforce/resourceUrl/FireAdobeEvents';

//fieldsMap fields names
const SelectionLabel =  'Please select'

const SBG_SUBURB_FIELD = 'suburb';
const SBG_CITY_FIELD = 'CityTown';
const SBG_PROVINCE_FIELD = 'province';
const BUILDING_NAME_FIELD = 'ComplexBuildingName';
const POSTAL_CODE_FIELD = 'postalCode';
const STREET_NUMBER_FIELD = 'StreetNumberAndName';

//MRIField fields names
const MRIFIELD_DISTRICT = 'SUBURB';
const MRIFIELD_CITY = 'CITY';
const MRIFIELD_PROVINCE = 'province';



export default class Aob_comp_residentialAddress extends LightningElement {

 //if there are errors:
 failing = false;
 errorContent = '';

label = {
    AOB_UnitNumber,
    AOB_StreetNumberAndName,
    AOB_ComplexBuildingName,
    AOB_Suburb,
    AOB_CityTown,
    AOB_Province,
    AOB_PostalCode,
    AOB_Title,
    AOB_Subtitle,
    AOB_SelectionLabel,
}


@api applicationId;
@api personalDetails;
@api isShowingCloseButton;
@api pageName;
@api isFiringScreenLoad;
@track cityOptions = [];
@track provinceOptions = [];
@track countryOptions = [];
@track error;


@api availableActions = [];
constants = {
    NEXT: 'NEXT',
    BACK: 'BACK' 
}
@track fieldsMap ={};
openClosePageModal;
isLoaded = true;


get getOpenClosePageModal() {
    return this.isShowingCloseButton && this.openClosePageModal;
}
     /**
     * @description Initiates the Screen
     */
     
      connectedCallback() {
        this.setupPicklists();
    }

    /**
     * @description gets all the referenced data that will be shown on the screen
     */
     setupPicklists() {
        const sapFieldsList = [ 
            MRIFIELD_DISTRICT,     
            MRIFIELD_CITY,
            MRIFIELD_PROVINCE,
        ];
        getAllPicklistEntries({
            sapFields: sapFieldsList
        })
            .then(result => {
                if (result) {
                    this.suburbOptions = result[MRIFIELD_DISTRICT];
                    this.cityOptions = result[MRIFIELD_CITY];
                    this.provinceOptions = result[MRIFIELD_PROVINCE];
                }
             })
            .catch(error => {
                this.failing = true;
                this.errorContent = ' setupPicklists ' + getErrorMessage.call(this, error);
            });
    }


     /**
     * @description generic change handler for all inputs to capture the entered values by the user
     */
      genericInputOnChange(event) {
        if (!event.target.value || event.target.value === SelectionLabel) {
            this.fieldsMap[event.target.name] = null;
        } else {
            this.fieldsMap[event.target.name] = event.target.value;
        }
     }
    /**
  
    /**
     * @description Method to remove all errors
     */
     removeAllErrors() {
        this.template.querySelectorAll('lightning-input').forEach(element => {
            this.removeError(element);
        });
        this.template.querySelectorAll('lightning-combobox').forEach(element => {
            this.removeError(element);
        });
    }
    removeInputErrors(inputName) {
        this.template.querySelectorAll('lightning-input').forEach(element => {
            if (element.name === inputName) {
                this.removeError(element);
            }
        });
        this.template.querySelectorAll('lightning-combobox').forEach(element => {
            if (element.name === inputName) {
                this.removeError(element);
            }
        });
    }
       /**
     * @description Method to remove errors
     */
        removeError(element) {
            element.setCustomValidity("");
            element.reportValidity();
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
            }else if (!element.reportValidity()) {
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
                for(let j in this.sections){
                    for(let i in this.sections[j].fields){
                        if(element.dataset.id===this.sections[j].fields[i].id){
                            this.sections[j].fields[i].showError=true;
                        }
                        
                    }
                isValid = false;
                }
        });
        
        return isValid;
    }

  continueToNextPage() {
    if(this.validateForm()){
    // check if NEXT is allowed on this screen
    if (this.availableActions.find(action => action === this.constants.NEXT)) {
        // navigate to the next screen
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
    }
  }
    
backToPreviousPage(){
    // check if NEXT is allowed on this screen 
    if (this.availableActions.find(action => action === this.constants.BACK)) { 
    // navigate to the next screen  
    const navigateNextEvent = new FlowNavigationBackEvent();  
    this.dispatchEvent(navigateNextEvent);   
    } 
}


}