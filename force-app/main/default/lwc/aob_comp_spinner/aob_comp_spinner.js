import { LightningElement } from 'lwc';
/**Static ressources */
import AOB_ThemeOverrides from '@salesforce/resourceUrl/AOB_ThemeOverrides';

export default class Aob_comp_spinner extends LightningElement {
    spinner = AOB_ThemeOverrides + '/assets/images/Spinner.svg';
}