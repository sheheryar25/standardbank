import { LightningElement } from 'lwc';

export default class AcmTestWebviewMessagingDeleteMe extends LightningElement {

    sendDataToReactNativeApp = async () => {
        window.ReactNativeWebView.postMessage('Data from WebView / Website');
    };
}