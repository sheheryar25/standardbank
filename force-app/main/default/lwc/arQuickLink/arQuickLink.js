import { LightningElement } from 'lwc';
import getQuickLinks from '@salesforce/apex/AR_QuickLinks_CTRL.getQuickLinks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSectorResources from '@salesforce/apex/AR_QuickLinks_CTRL.getSectorResources';


export default class ArQuickLink extends LightningElement {

    quickLinks = [];
    sectorResources = [];
    isSectorResourcesModalOpened =  false;

    connectedCallback() {
        this.getQuickLinks();
    }

    getQuickLinks() {
        getQuickLinks().then(response => {
            response.forEach(ql => {
                if (ql.label == 'Sector Resources') {
                    ql.isSectorResource = true;
                }
                let iconParts = ql.icon.split("#");
                ql.imageUrl = '/resource/SLDS221ICONs/' + iconParts[0] + '/' + iconParts[1] + '_120.png';
            });
            this.quickLinks = response;
            console.log(this.quickLinks);
        }).catch(error => {
            this.toast('Server Error', 'error');
        });

        getSectorResources().then(response => {
            this.sectorResources = response;
        });
        
    }

    openSectorResourcesModal() {
        this.isSectorResourcesModalOpened = true;
    }

    closeSectorResourceModal() {
        this.isSectorResourcesModalOpened = false;
    }

    toast(title, toastVariant) {
        const toastEvent = new ShowToastEvent({
          title,
          variant: toastVariant
        })
        this.dispatchEvent(toastEvent);
    }
}