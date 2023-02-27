import { LightningElement, api, wire} from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import eventChannel from '@salesforce/messageChannel/osbMenuEvents__c';

export default class osbInlineBreadCrumb extends LightningElement {
    @api link;
    @api linkLabel;
    @api withOverlay;
    @api baseLabel = 'Dashboard';
    @api baseLink = '/s';
    navLink;

    @wire(MessageContext)
    messageContext;
    handleTabChange(event){
        const payload = {
            ComponentName: 'Bread crumb',
            Details: {
                tabName: event.target.dataset.id
            }
        };
        publish(this.messageContext, eventChannel, payload);
    }

    renderedCallback(){
        if(this.baseLabel == 'Dashboard'){
            this.navLink = '/s';
        }else{
            this.template.querySelector('[data-id="first-item"]').classList.add('adjust');
            this.template.querySelector('[data-id="second-item"]').classList.add('adjust');
            this.template.querySelector('[data-id="container"]').classList.remove('breadLink');
            this.template.querySelector('[data-id="container"]').classList.add('container');
        }
    }
}