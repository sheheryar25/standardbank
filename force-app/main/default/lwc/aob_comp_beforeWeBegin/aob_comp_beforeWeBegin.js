import { LightningElement, api,wire } from 'lwc';
//Apex Controllers
import getRelatedProducts from '@salesforce/apex/AOB_CTRL_BeforeWeBegin.getRelatedProducts';
import getCustomerName from '@salesforce/apex/AOB_CTRL_BeforeWeBegin.getCustomerName';

//Static Resources
import THEME_OVERRIDES from '@salesforce/resourceUrl/AOB_ThemeOverrides';
import FireAdobeEvents from '@salesforce/resourceUrl/FireAdobeEvents';
//Labels
import AOB_BeforeWeBeginSubTitle from '@salesforce/label/c.AOB_BeforeWeBeginSubTitle';
import AOB_BeforeWeBeginTitle from '@salesforce/label/c.AOB_BeforeWeBeginTitle';
import AOB_10Min from '@salesforce/label/c.AOB_10Min';
import AOB_whatNext from '@salesforce/label/c.AOB_whatNext';
import AOB_AutoSave from '@salesforce/label/c.AOB_AutoSave';
import AOB_AppComplete from '@salesforce/label/c.AOB_AppComplete';
import AOB_SaveForLater from '@salesforce/label/c.AOB_SaveForLater';
import AOB_Continue from '@salesforce/label/c.AOB_Continue';
//Lightning imports
import { loadScript } from 'lightning/platformResourceLoader';
import {FlowNavigationNextEvent } from 'lightning/flowSupport';

const MOBILE_WIDTH = 768;
const CONTENT_LINKS = 'content links';
export default class Aob_cmp_beforeWeBegin extends LightningElement {
    label = {
        AOB_BeforeWeBeginSubTitle,
        AOB_BeforeWeBeginTitle,
        AOB_10Min,
        AOB_whatNext,
        AOB_AutoSave,
        AOB_AppComplete,
        AOB_SaveForLater,
        AOB_Continue
        
    }
    constants = {
        NEXT: 'NEXT'
    }
    listArrow = THEME_OVERRIDES + '/assets/images/list-arrow.svg';
    futureIcon = THEME_OVERRIDES + '/assets/images/icon_future.svg';
    infoCircleIcon = THEME_OVERRIDES + '/assets/images/icon_info_circle.svg';
    @api pageName;
    @api isFiringScreenLoad;
    @api continueBtnDataIntent;
    @api currentDataScope;

    @api availableActions = [];
    nextActions;
    AppComplete;
    error;
    subTitle;
    customerName
    showSaveForLaterPopUp = false;
    @api txtBoxVal;
    @api applicationId;
    @api recordId;
    isRendered;
    adobePageTag = 'application:[product category]:before we begin';
    productCategory;
    get getCurrentDataScope(){
        return this.currentDataScope ? this.currentDataScope.toLowerCase() : CONTENT_LINKS;
    }
    get getLinkLabel(){
        return `continue button click`;
    }
    @wire(getCustomerName, {
        applicationId: '$applicationId'
    })
    getCustomerNameF({
        error,
        data
    }) {
        if (data) {
            this.label.AOB_BeforeWeBeginSubTitle=this.label.AOB_BeforeWeBeginSubTitle.replace('{####}',data);
            this.customerName=data;
        } else if (error) {
            this.error = error;
        }
    }
    /**
     * @description method to fetch related product requirement/qualifications
     */
    
    @wire(getRelatedProducts, {
        applicationId: '$applicationId'
    })

    getRelatedProducts3F({
        error,
        data
    }) {
        if (data) {
            //Parse the returned list of products
            this.AppComplete = [];
            this.nextActions = [];
            //For each product add the related nextActions and Product_Qualifications__r to local lists
            data.forEach(eachContent => {
                if(eachContent.AOB_ContentType__c=='NextActions'){
                    this.nextActions.push(eachContent)
                }
                else if(eachContent.AOB_ContentType__c=='AppComplete'){
                    this.AppComplete.push(eachContent)
                }
           
            });
            this.fireAdobeEvents();
        }
    }
    /**
     * @description method used to fire adobe events
     */
    fireAdobeEvents() {
        this.adobePageTag = this.adobePageTag.replace('[product category]', this.productCategory);
        loadScript(this, FireAdobeEvents)
        .then(() => {
            if (!this.isEventFired) {
                this.isEventFired = true;
                window.fireScreenLoadEvent(this, this.adobePageTag);
            }
        }) 
    }
    /**
     * @description method to start adobe/mobile resizing
     */
    renderedCallback() {
        loadScript(this, FireAdobeEvents)
        .then(() => {
            if (!this.isRendered && this.isFiringScreenLoad) {
                this.isRendered = true;
                window.fireScreenLoadEvent(this, this.pageName);
            }
        }) 
        //Used to keep the height of sections titles equal
        if (window.screen.width > MOBILE_WIDTH) {
            this.syncHeight('.aob_required-actions-title');
            this.syncHeight('.aob_required-actions-sub-title');
        }
        //To ensure the height of sections are equal after resize
        window.addEventListener('resize', () => {
            if (window.screen.width > MOBILE_WIDTH) {
                this.syncHeight('.aob_required-actions-title');
                this.syncHeight('.aob_required-actions-sub-title');
            }
        });
    }
    /**
     * @description method to sync height for mobile
     */
    //Synchronize the height of two independant Divs having the same class names
    syncHeight(className) {
        var elem = this.template.querySelectorAll(className);
        var elemA = elem[0];
        var elemB = elem[1];

        //Refresh height of two elements to fit their content
        elemA.style.height = 'fit-content';
        elemB.style.height = 'fit-content';

        var heightA = elemA.clientHeight;
        var heightB = elemB.clientHeight;

        if (heightA > heightB) {
            elemB.style.height = `${elemA.clientHeight}px`;
        } else if (heightA < heightB) {
            elemA.style.height = `${elemB.clientHeight}px`;
        }
    }
    /**
     * @description method to handle continue event
     */
    handleContinueClicked(event){
        window.fireButtonClickEvent(this, event);
        this.continueToNextPage();
    }
    /**
     * @description method to override flow next button
     */
    continueToNextPage() {
        // check if NEXT is allowed on this screen
        if (this.availableActions.find(action => action === this.constants.NEXT)) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }

    /**
     * @description method to handle saveForLater button
     */
    handleSaveForLaterClicked() {
        this.showSaveForLaterPopUp = true;
    }

    /**
     * @description method to handle closing saveForLater button
     */
    handleCloseSaveForLaterPopUp() {
        this.showSaveForLaterPopUp = false;
    }
    
}