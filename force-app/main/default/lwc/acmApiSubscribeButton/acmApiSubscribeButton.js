import { LightningElement, api } from 'lwc';
const API_ID_URL_PARAM = "apiId";
const API_VERSION_ID_URL_PARAM = "versionId";
const API_VERSION_URL_PARAM = "version";
const API_VERSION_CHANGED_EVENT_NAME = "selected-api-version-changed";

export default class AcmApiSubscribeButton extends LightningElement {
  @api label;
  @api pageUrl;
  apiRecordId;
  apiVersionRecordId;
  apiVersion;
  destinationUrl;

  registerEventListener() {
    const that = this;
    function handleApiVersionChange(event) {
      const payload = JSON.parse(JSON.stringify(event.detail));
      that.apiRecordId = payload.apiVersion.parentRecordId;
      that.apiVersionRecordId = payload.apiVersion.recordId;
      that.apiVersion = payload.apiVersion.version;
      that.destinationUrl = `${that.pageUrl}?${API_ID_URL_PARAM}=${that.apiRecordId}&${API_VERSION_ID_URL_PARAM}=${that.apiVersionRecordId}&${API_VERSION_URL_PARAM}=${that.apiVersion}`;
    };
    return handleApiVersionChange;
  }

  connectedCallback() {
  }

  renderedCallback(){
    window.addEventListener(API_VERSION_CHANGED_EVENT_NAME, this.registerEventListener());
  }
}