import { LightningElement, api, wire } from 'lwc';
import createUserSubscribedSolution from "@salesforce/apex/OSB_Modal_CTRL.createUserSubscribedSolution";
import $RESOURCE_OSBCloseIcon from "@salesforce/resourceUrl/OSBCloseIcon";
import $RESOURCE_OSBCloseIconWhite from "@salesforce/resourceUrl/OSB_CloseIconWhite";
import OSB_Logo from '@salesforce/resourceUrl/OSB_logoBadge';
import $RESOURCE_OSBVisitWebsiteIcon from "@salesforce/resourceUrl/OSBVisitWebsiteIcon";
import { NavigationMixin } from 'lightning/navigation';
import { publish, MessageContext } from "lightning/messageService";
import ApplicationRefresh from '@salesforce/messageChannel/osbApplicationRefresh__c';
import eventCompChannel from "@salesforce/messageChannel/osbMenuEvents__c";
import eventChannel from '@salesforce/messageChannel/osbInterCompEvent__c';

export default class OsbModallwc extends NavigationMixin(LightningElement) {
    OSBCloseIcon = $RESOURCE_OSBCloseIcon;
    SBlogo = OSB_Logo;
    OSBCloseIconWhite = $RESOURCE_OSBCloseIconWhite;
    oneHubBaseURL;
    OSBVisitWebsiteIcon = $RESOURCE_OSBVisitWebsiteIcon;
    modalissolution = true;
    thirdParty = false;

    @api isopen;
    @api apiDocAvailable;
    @api modallogo;
    @api modaltype;
    @api modaltitle;
    @api modalcontent;
    @api firstButtonLabel;
    @api modalfirstbuttonurl;
    @api modalscndbuttonurl;
    @api recordid;
    @api isProductHighlight = false;
    @api displaySecondButton = false;
    @api isonshowcase = false;
    @api currenttab = "Dashboard";
    @api    applicationowner;

    solTM = false;
    disabled = false;

    @wire(MessageContext)
    messageContext;

    renderedCallback() {
        if (this.applicationowner === '3rd Party') {
            this.thirdParty = true;
        } else {
            this.thirdParty = false;
        }

        if (this.modaltitle === 'AUTHENTIFI') {
            this.solTM = true;
        } else {
            this.solTM = false;
        }
    }

    closeModel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    openfirsturl() {
        let urlToOpen = this.modalfirstbuttonurl;
        window.open(urlToOpen);
        this.isopen = false;
        document.body.style.overflow = "auto";
        this.dispatchEvent(new CustomEvent('close'));
    }
    opensecondurl() {
        let urlToOpen = this.modalscndbuttonurl;
        if (this.modalissolution) {
            window.open(urlToOpen);
        }
        else {
            let urlArray = String(urlToOpen).split('=');
            let urlStateValue = urlArray[1];
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'API_Details__c'
                },
                state: {
                    "apiId": urlStateValue
                }
            });
        }
        this.isopen = false;
        document.body.style.overflow = "auto";
        this.dispatchEvent(new CustomEvent('close'));
    }
    openmarketplace() {
        if (this.modaltype === 'secondLevel') {
            this.isopen = false;
            document.body.style.overflow = "auto";
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                },
                state: {
                    "activeTab": "BeHeard"
                }
            });
        }
    }

    addSolutionAsFavourite(event) {
        this.disabled = true;
        createUserSubscribedSolution({ solutionId: this.recordid }).then(
            (result) => {              
                this.isopen = false;
                document.body.style.overflow = "auto";
                const payload = {
                    ComponentName: "Header",
                    Details: {
                        tabName: 'Dashboard'
                    },
                };
                publish(this.messageContext, eventCompChannel, payload);
                const payloadHeader = {
                    ComponentName: "Header",
                    Details: {
                        Tab: 'Dashboard'
                    },
                };
                publish(this.messageContext, eventChannel, payloadHeader);
                const galleryPayLoad = { recordAdded: "Application Added" };
                publish(this.messageContext, ApplicationRefresh, galleryPayLoad);
                this.disabled = false;
            });
    }
}