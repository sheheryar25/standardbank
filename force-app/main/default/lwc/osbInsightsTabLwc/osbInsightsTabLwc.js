import { LightningElement, wire } from 'lwc';
import getInsights from '@salesforce/apex/OSB_InsightsHub_CTRL.getInsights';

export default class osbInsightsTabLwc extends LightningElement {

    displayLeadership;
    displaySolutions;  
   
    @wire(getInsights)
    wiredInsights({ error, data }) {
        if (data) {         
            let articles = JSON.parse(JSON.stringify(data));
            articles = articles["KnowledgeList"];

            let ourLeadership = [];
            for (var j = 0; j < articles.length; j++) {        
                ourLeadership.push(articles[j]);
            }
            this.displayLeadership = ourLeadership;

            let ourSolutions = [];
            for (var i = 0; i < 6; i++) {
                ourSolutions.push(articles[i]);
            }
            this.displaySolutions = ourSolutions;            
        }
        else if (error) {
             this.error = error;
        }
    }
}