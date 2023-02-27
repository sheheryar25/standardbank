import {
    LightningElement,
    api,
    track
} from 'lwc';

import AOB_SaveForLater_SubTitle from '@salesforce/label/c.AOB_SaveForLater_SubTitle';
import AOB_SaveForLater_Title from '@salesforce/label/c.AOB_SaveForLater_Title';
import AOB_SaveForLater_Content from '@salesforce/label/c.AOB_SaveForLater_Content';
import AOB_SaveForLater_ApplicationNo from '@salesforce/label/c.AOB_SaveForLater_ApplicationNo';
import getApplicationName from '@salesforce/apex/AOB_CTRL_SaveForLater.getApplicationName';
import updateApplicationToInProgressStatus from '@salesforce/apex/AOB_CTRL_SaveForLater.updateApplicationToInProgressStatus';


export default class Aob_comp_saveForLater extends LightningElement {

    failing = false;
    errorContent = '';
    customerName='Maryem';// TO BE DYNAMICALLY FETCHED
    @track applicationName = '';

    //Labels
    label = {
        AOB_SaveForLater_SubTitle,
        AOB_SaveForLater_Title,
        AOB_SaveForLater_Content,
        AOB_SaveForLater_ApplicationNo
    };
    //Adobe attributes
    //Page Closing
    @api applicationId;

    /**
     * @description Initiates the Screen
     */
     connectedCallback() {
         console.log('this.applicationId in connected cb:' + this.applicationId);
        getApplicationName({
            'applicationId': this.applicationId
        })
        .then(result => {
            this.applicationName=this.label.AOB_SaveForLater_ApplicationNo.replace('{####}',result.Name);
        });
    }

    get getOpenClosePageModal() {
        return this.isShowingCloseButton && this.openClosePageModal;
    }

    /**
    * @description method to move to previous screen
    */
    backToPreviousPage(){
        this.dispatchEvent(new CustomEvent('closed', {}));
    }

    /**
    * @description method to move to previous screen
    */
    saveForLater(){

        updateApplicationToInProgressStatus({
            'applicationId': this.applicationId
        });
        //TODO
        // Redirect to Commerce List Accounts

        this.dispatchEvent(new CustomEvent('closed', {}));
    }

}