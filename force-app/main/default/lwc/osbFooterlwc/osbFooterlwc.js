import { LightningElement, api } from 'lwc';
import footerStatic from "@salesforce/resourceUrl/OSB_FooterImages";

export default class OsbFooterlwc extends LightningElement {
    google = footerStatic + '/GoogleFooter.svg';
    appStore = footerStatic + '/AppleFooter.svg';
    ipads= footerStatic + '/FooterImage.png';
    @api terms;
    @api legal;
    @api notices;
    @api certification;
    @api questionnaire;
}