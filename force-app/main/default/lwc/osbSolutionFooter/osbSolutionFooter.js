import { LightningElement, api } from 'lwc';

export default class OsbSolutionFooter extends LightningElement {
    @api btnlink;
    @api btnlabel;
    @api calltoactiontitle;
    @api background;
    @api backgroundbtm;
    @api btnColour;
    @api btnStyle = 'font-size:12px;';
    @api showFooterExt = 'false';
    @api solutionlogo;
    @api showFooterLogo;

    @api terms = 'https://corporateandinvestment.standardbank.com/cib/global/about-us/legal';
    @api legal = 'https://corporateandinvestment.standardbank.com/cib/global/about-us/legal';
    @api notices = 'https://corporateandinvestment.standardbank.com/cib/global/about-us/legal/important-notices';
    @api certification = 'https://corporateandinvestment.standardbank.com/cib/global/about-us/legal/usa-patriot-act-certification';
    @api questionnaire = 'https://corporateandinvestment.standardbank.com/cib/global/about-us/legal/wolfsberg-questionnaire';


    renderedCallback(){   
        this.template.querySelector('[data-id="background"]').style.backgroundColor = this.background;
        this.template.querySelector('[data-id="background-bottom"]').style.backgroundColor = this.backgroundbtm;
        if(this.backgroundbtm){
            this.template.querySelector('[data-id="background-bottom"]').style.backgroundColor = this.backgroundbtm;
        }else{
            this.template.querySelector('[data-id="background-bottom"]').classList.add('hidden');
        }
    }
}