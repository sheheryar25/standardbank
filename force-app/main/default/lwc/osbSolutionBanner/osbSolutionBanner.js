import { LightningElement, api } from 'lwc';

export default class OsbSolutionImageBannerv2 extends LightningElement {
    @api link;
    @api title;
    @api content;
    @api image;
    @api solutionLogo;
    @api mainContent;

    @api btnColour;
    @api btnStyle;
    @api btnStyleOneHub;
    @api showOneHubBtn;
    @api subContent;
    @api linkLabel;
    @api backgroundColor;
    @api setClassForImage = 'margin-left:90px;,padding-top:50px;';

    renderedCallback(){
        this.template.querySelector('[data-id="teaserosb"]').style.backgroundColor = this.backgroundColor;
        this.adobeText = ('Landing Page | ' + this.title + ' | ' + this.linkLabel); 
        let styleArray = this.setClassForImage.split(',');
        let imageStyleComp = '';
        
        styleArray.forEach(element => {
            imageStyleComp += element;
        });
        this.template.querySelector('[data-id="image-container"]').style = imageStyleComp; 
    }
}