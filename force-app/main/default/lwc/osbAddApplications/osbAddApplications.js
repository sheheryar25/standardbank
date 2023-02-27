import { LightningElement, wire, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getRegisteredApplication from "@salesforce/apex/OSB_Dashboard_CTRL.getRegisteredApplication";
import Id from "@salesforce/user/Id";
import { refreshApex } from "@salesforce/apex";
import removeUserSubscribedSolution from "@salesforce/apex/OSB_YourSolutionTile_CTRL.removeUserSubscribedSolution";
import LOADER_SPINNER from "@salesforce/resourceUrl/OSB_Loader";
import $RESOURCE_OSB_AddAppIcon from "@salesforce/resourceUrl/OSB_AddAppIcon";
import { publish, MessageContext } from "lightning/messageService";
import eventCompChannel from "@salesforce/messageChannel/osbInterCompEvent__c";
import getSolutions from "@salesforce/apex/OSB_SolutionShowcase_CTRL.getSolutionShowcase";
import getCategories from "@salesforce/apex/OSB_MiniMallCustomMetadata_CTRL.fetchMetaListLwc";

export default class OsbApplicationMarketPlace extends NavigationMixin(LightningElement) {
  OSBAddAppIcon = $RESOURCE_OSB_AddAppIcon;
  deleter = LOADER_SPINNER;
  userId = Id;
  isDeleting = false;
  @api applicationowner;
  isLoading = false;
  refreshCategories;
  refreshApplications;
  refreshResult;

  @api ssoredirecturl;
  @track registeredApplications = [];
  registeredApplicationsNoDups =[];
  @track myAppsDisplay = false;
  @track solutionid;

  @wire(MessageContext)
  messageContext;

  @wire(getSolutions, { userId: "$userId" })
  getSolutions(result) {
    this.refreshApplications = result;
  }

  @wire(getCategories, { userId: "$userId" })
  getCategories(result) {
    this.refreshCategories = result;
  }

  updateApplications() {
    return refreshApex(this.refreshApplications);
  }

  updateCategories() {
    return refreshApex(this.refreshCategories);
  }

  updateMyApplications() {
    return refreshApex(this.refreshResult);
  }

  navigatetoApplicationGallery() {
    this.dispatchEvent(new CustomEvent("application"));
    const payload = {
      ComponentName: "Add application header",
      Details: {
        Tab: "Application Marketplace",
      },
    };
    publish(this.messageContext, eventCompChannel, payload);
  }

  @wire(getRegisteredApplication, { userId: "$userId" })
  getRegisteredApplications(result) {
    this.isLoading = true;
    this.refreshResult = result;
    if (result.data) {
      this.isLoading = false;
      let myapps = JSON.parse(JSON.stringify(result.data));
      this.registeredApplications = myapps;
      if (myapps.length >= 0) {
        this.myAppsDisplay = true;
        this.error = undefined;
      } else {
        this.myAppsDisplay = false;
        this.error = result.error;
      }
    }
  }

  onAppSolutionId(event) {
    this.solutionid = event.detail.solutionid;
    this.isDeleting = true
    let timer = window.setTimeout(() => {
      this.isDeleting = false
      window.clearTimeout(timer)
    }, 3000)
    removeUserSubscribedSolution({ solutionId: this.solutionid }).then(() => {
      this.isDeleting = false;
      this.updateApplications();
      this.updateCategories();
      return refreshApex(this.refreshResult);
    });
  }

  @api
  getApps() {
    getRegisteredApplication({ userId: this.userId })
    .then((data) => {
      let myapp = [];
      this.registeredApplications = [];    
      myapp = JSON.parse(JSON.stringify(data));
      this.registeredApplications = myapp;     
      if (myapp.length >= 0) {
        this.myAppsDisplay = true;
        this.error = undefined;
      } else {
        this.myAppsDisplay = false;
        this.error = error;
      }
    })
  }
}