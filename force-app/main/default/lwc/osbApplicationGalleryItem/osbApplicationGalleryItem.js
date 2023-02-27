import { LightningElement, api, track } from "lwc";
import OSB_Logo from '@salesforce/resourceUrl/OSB_logoBadge';

export default class osbApplicationGalleryItem extends LightningElement {
    SBLogo = OSB_Logo;

    @api title;
    @api content;
    @api shortContent;
    @api link;
    @api linkDirect;
    @api linkLabel;
    @api key;
    @api solutionid;
    @api logo;
    @api largelogo;
    @api dashboard;
    @api modalissolution;
    @api iscomingsoon;
    @api solutionsiteurl;
    @api isOnShowcase;
    @api isOpen = false;
    @api applicationowner;
    @api ssoredirecturl;
    thirdParty = false;
    imageTest;
    LogoSRC;
    solTM = false;

    renderedCallback() {
        if (this.applicationowner == '3rd Party') {
            this.thirdParty = true;
        } else {
            this.thirdParty = false;
        }
        if(this.title === 'AUTHENTIFI'){
            this.solTM = true;
        }else{
            this.solTM = false;
        }
    }

    createmodalwindow() {
        this.isOpen = true;
    }
    modalCloseHandler() {
        this.isOpen = false
    }
}