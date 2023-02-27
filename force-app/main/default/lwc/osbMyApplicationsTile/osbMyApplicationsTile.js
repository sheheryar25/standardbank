import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import OSB_Logo from '@salesforce/resourceUrl/OSB_logoBadge';

export default class OsbMyApplicationsTile extends NavigationMixin(LightningElement) {
    SBlogo = OSB_Logo;
    @api registeredapps = []
    @api multiple = false;
    @api title;
    @api logo;
    @api mediumlogo;
    @api url;
    @api solutionid;
    @api empty = false;
    @api applicationowner;
    @api ssoredirecturl;
    thirdParty = false;
    solTM = false;
    disabled = false;

    renderedCallback() {
        if (this.applicationowner === '3rd Party') {
            this.thirdParty = true;
        } else {
            this.thirdParty = false;
        }
        if (this.title === 'AUTHENTIFI') {
            this.solTM = true;
        } else {
            this.solTM = false;
        }
    }

    removeSolutionAsFavourite() {
        this.disabled = true;
        const passEvent = new CustomEvent('appsolutionid', {
            detail: { solutionid: this.solutionid }
        });
        this.dispatchEvent(passEvent); 
    }
}