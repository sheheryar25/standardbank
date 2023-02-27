import { LightningElement, api } from 'lwc';

export default class AcmGenerateCertificate extends LightningElement {
    @api buttonLabel ;   
    @api urlDestination;
    @api name;

}