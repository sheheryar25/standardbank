import { LightningElement, api } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/FAQ';

export default class AcmResources extends LightningElement {

    @api blogImageOne;
    @api blogHeaderOne;
    @api blogDescriptionOne;
    @api redirectLinkOne;

    @api blogImageTwo;
    @api blogHeaderTwo;
    @api blogDescriptionTwo;
    @api redirectLinkTwo;

    @api blogImageThree;
    @api blogHeaderThree;
    @api blogDescriptionThree;
    @api redirectLinkThree;

    @api buttonTitle;
    @api allResources;

    // First Blog
    get useImageOne(){
        return IMAGES + '/img/' + this.blogImageOne;
    }

    get useHeaderOne(){
        return this.blogHeaderOne;
    }

    get useDescriptionOne() {
        return this.blogDescriptionOne;
    }

    get useLinkOne() {
        return this.redirectLinkOne;
    }

    // Second Blog
    get useImageTwo(){
        return IMAGES + '/img/' + this.blogImageTwo;
    }

    get useHeaderTwo(){
        return this.blogHeaderTwo;
    }

    get useDescriptionTwo() {
        return this.blogDescriptionTwo;
    }

    get useLinkTwo() {
        return this.redirectLinkTwo;
    }

    // Third Blog
    get useImageThree(){
        return IMAGES + '/img/' + this.blogImageThree;
    }

    get useHeaderThree(){
        return this.blogHeaderThree;
    }

    get useDescriptionThree() {
        return this.blogDescriptionThree;
    }

    get useLinkThree() {
        return this.redirectLinkThree;
    }

    //Button
    get useTitle() {
        return this.buttonTitle;
    }

    //View all resources
    get useResources() {
        return this.allResources;
    }
}