import { LightningElement, api, wire, track } from "lwc";
import fetchMetaListLwc from "@salesforce/apex/OSB_MiniMallCustomMetadata_CTRL.fetchMetaListLwc";
import MiniMall from "@salesforce/resourceUrl/OSB_MiniMall";
import { publish, MessageContext } from "lightning/messageService";
import eventCompChannel from "@salesforce/messageChannel/osbInterCompEvent__c";
import messageChannel from "@salesforce/messageChannel/osbMenuEvents__c";
import {subscribe,APPLICATION_SCOPE} from "lightning/messageService";
import Id from "@salesforce/user/Id";
import ApplicationRefresh from "@salesforce/messageChannel/osbApplicationRefresh__c";
import { refreshApex } from "@salesforce/apex";

const COLUMNS = [
  { label: "Label", fieldName: "MasterLabel" },
  { label: "Image", fieldName: "ImageLink__c" },
];

export default class osbCategoriesLwc extends LightningElement {
  AllApplication = MiniMall + "/MiniMall/Allapps.png";
  userId = Id;
  records;
  wiredRecords;
  error;
  columns = COLUMNS;
  draftValues = [];
  subscription = null;
  Applicationsubscription = null;
  refreshResult;
  recordAdded;

  @api categories;
  @track showApps = true;
  @api showMiniMallFilter = false;

  @wire(fetchMetaListLwc, { userId: "$userId" })
  fetchMetaListLwc(result) {
    this.refreshResult = result;
    if (result.data) {
      this.records = result.data;
    }
  }

  retrieveCategories() {
    fetchMetaListLwc({ userId: this.userId })
      .then((data) => {
        if (data) {
          this.records = data;
        }
      })
      .catch((error) => {
        this.error = error;
      });
  }

  @wire(MessageContext)
  messageContext;

  @wire(MessageContext)
  MessageContextChannelMenu;

  handleSubscribe() {
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.MessageContextChannelMenu,
      messageChannel,
      (message) => {
        if (
          message.ComponentName === "Bread crumb" ||
          message.ComponentName === "Header"
        ) {
          this.showMiniMallFilter = false;
        }
      }
    );
    if (!this.Applicationsubscription) {
      this.Applicationsubscription = subscribe(
        this.messageContext,
        ApplicationRefresh,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(message) {
    this.recordAdded = message.recordAdded;
    return refreshApex(this.refreshResult);
  }

  renderedCallback() {
    this.retrieveCategories();
    this.handleSubscribe();
  }

  handleClick(event) {
    let category = event.currentTarget;
    this.categories = category.dataset.value;
    const payload = {
      ComponentName: "Categories",
      Details: {
        Tab: "Application Marketplace",
        propertyValue: category.dataset.value,
      },
    };

    this.showMiniMallFilter = true;
    publish(this.messageContext, eventCompChannel, payload);
    this.showApps = false;
    this.dispatchEvent(
      new CustomEvent("showbelow", {
        detail: !this.showMiniMallFilter,
      })
    );
  }

  @api
  addapp() {
    const payload = {
      ComponentName: "Categories",
      Details: {
        propertyValue: "All Applications",
      },
    };
    this.showMiniMallFilter = true;
    publish(this.messageContext, eventCompChannel, payload);
    this.showApps = false;
  }
}