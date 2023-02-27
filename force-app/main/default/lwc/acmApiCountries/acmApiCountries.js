import { LightningElement  } from "lwc";
import { addAnalyticsInteractions } from 'c/acm_AdobeAnalytics';

export default class AcmApiCountries extends LightningElement {
    renderedCallback(){
        addAnalyticsInteractions(this.template);
    }
}