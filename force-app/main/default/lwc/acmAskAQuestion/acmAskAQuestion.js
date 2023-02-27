import { LightningElement, api } from 'lwc';

export default class AcmAskAQuestion extends LightningElement {

    @api imageUrl;
    @api headerText;
    @api subHeader;
    @api buttonLabel;
    @api buttonUrl;

    get useImage(){
        return this.imageUrl;
    }

    get useHeader(){
        return this.headerText;
    }

    get useSubHeader(){
        return this.subHeader;
    }

    get useButtonLabel(){
        return this.buttonLabel;
    }

    get useDestinationUrl(){
        return this.buttonUrl;
    }
}