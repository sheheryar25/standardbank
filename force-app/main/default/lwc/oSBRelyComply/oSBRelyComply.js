import { LightningElement } from 'lwc';
import OSB_Images from '@salesforce/resourceUrl/OSB_Images';

export default class oSBRelyComply extends LightningElement {
    imageRelyComply = OSB_Images + '/ReplyComply.svg';
    imageHeader = OSB_Images + '/RelyHeader.svg';
    imageRelyScreening = OSB_Images + '/RelyScreening.svg';
    imageRelyTransaction = OSB_Images + '/RelyTransaction.svg';
    imageRelyClient = OSB_Images + '/RelyClient.svg';
    imageRelyAdverse = OSB_Images + '/RelyAdverse.svg';
    imageRelyDesktop = OSB_Images + '/RelyDesktop.png';   
}