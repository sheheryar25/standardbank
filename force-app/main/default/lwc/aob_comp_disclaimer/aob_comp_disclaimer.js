import { LightningElement } from 'lwc';
import SBG_LOCK from '@salesforce/resourceUrl/AOB_ThemeOverrides';
import disclaimerLabel from '@salesforce/label/c.AOB_disclaimer';

export default class Aob_comp_disclaimer extends LightningElement {
    lockIMG = SBG_LOCK + '/assets/images/SBG_Lock.png';
    label = {
        disclaimerLabel
    };
}