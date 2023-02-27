import { LightningElement, track } from 'lwc';
import ASSETS_URL from '@salesforce/resourceUrl/InternalAssets';
import { getDataConnectorSourceFields } from 'lightning/analyticsWaveApi';

const DEVELOPER = "developer";
const BUSINESS = "business";

export default class AcmResourceDev extends LightningElement {

  @track searchTerm;
  searchItem;
  searchText;
  searchResult;

  searchIconUrl = ASSETS_URL + '/Assets/img/search.png';
  contextName = DEVELOPER;

  resources = {
    developer: [
      {
          imageUrl : ASSETS_URL + '/Assets/img/one.png',
          heading : 'FAQ',
          description : 'Most Frequently Asked Questions about APIs.',
          targetUrl : 'https://aws-tools.standardbank.co.za/confluence/display/api/FAQ#FAQ-FAQ4'
      },
      {
          imageUrl : ASSETS_URL + '/Assets/img/two.png',
          heading : 'RESTful API Standards',
          description : 'The Standard Bank Group has developed the RESTful API Guidelines based on “Zalando RESTful API and Event Guidelines” and REST best practices. In developing these guidelines we ensured that there was adherence to Engineering Standards and Security Standards. Our REST API Style Guidelines provides conventions for writing a RESTful API and is intended to encourage consistency, maintainability, and use of best practices for managed APIs intended for internal or external audiences.',
          targetUrl : 'https://aws-tools.standardbank.co.za/confluence/display/api/API+Standards?src=contextnavpagetreemode'
      },
      {
          imageUrl : ASSETS_URL + '/Assets/img/three.png',
          heading : 'Understanding API concepts',
          description : 'Before starting on your API journey its important to first familiarize and understand key concepts around APIs. This space has been created to enable and equip teams on their API Journey and is the primary source of all architectures, standards and patterns for APIs within the bank.',
          targetUrl : 'https://aws-tools.standardbank.co.za/confluence/display/api/API+Standards?src=contextnavpagetreemode'
      }
    ],
    business: [
      {
          imageUrl : ASSETS_URL + '/Assets/img/one.png',
          heading : 'API Product Value and Commercialisation',
          description : 'When considering APIs and API Products, there is often a focus on using them internally in developing new business applications, or to digitise, optimise or automate an existing manual process.',
          targetUrl : 'https://standardbank.sharepoint.com/sites/engineeringpartnershipandplatformdelivery/SitePages/API-Value-and-Commercialisation.aspx'
      },
      {
          imageUrl : ASSETS_URL + '/Assets/img/two.png',
          heading : 'API Toolbox',
          description : 'This toolbox provides an introduction to APIs, API Products and API Business Models. In this toolbox are best-practice methods, templates and guidance to enable everyone to deliver value for Standard Bank and its partners through the use of APIs, across the lifecycle.',
          targetUrl : 'https://standardbank.sharepoint.com/sites/engineeringpartnershipandplatformdelivery/SitePages/API-Toolbox.aspx#develop-publish-phase'
      },
      {
          imageUrl : ASSETS_URL + '/Assets/img/three.png',
          heading : 'Platform pricing and options',
          description : 'Coming Soon',
          targetUrl : 'https://aws-tools.standardbank.co.za/confluence/display/api/Platform+pricing+and+options?src=contextnavpagetreemode'
      }
    ]
  };

  get businessTabClassList() { return this.isBusinessTabSelected?'active':''; }
  get developerTabClassList() { return this.isDeveloperTabSelected?'active':''; }
  get isBusinessTabSelected() { return this.contextName === BUSINESS; }
  get isDeveloperTabSelected() { return this.contextName === DEVELOPER; }
  get currentResourcesList() { return this.resources[this.contextName]; }

  onDeveloperTabSelect() { this.contextName = DEVELOPER; }
  onBusinessTabSelect() { this.contextName = BUSINESS; }

  handleSearch(event){
    this.searchTerm = event.target.value;
    console.log(this.searchTerm);
    this.searchText = this.template.querySelector('.grid-item').innerText;
    //Testing variables
    this.searchResult = this.searchText.includes(this.searchTerm);
    // searchItems = this.template.querySelectorAll('.grid-item');
    
    if (this.searchTerm != '') {
      console.log('Search Term - ' + this.searchTerm);
      if (this.searchResult === True) {
        this.searchItem = this.template.querySelector('.grid-item').classList.remove('is-hidden');
      } else {
        this.searchItem = this.template.querySelector('.grid-item').classList.add('is-hidden');
      }
      this.searchItem = this.template.querySelector('.grid-item').classList.remove('is-hidden');
      //Logging to see the values 
      console.log('Search Item - ' + this.searchItem + ' & Search Text - ' + this.searchText + ' & Search result (T/F) ' + this.searchResult);
    } else {
      console.log('Empty Search term');
      // this.searchItem = this.template.querySelector('.grid-item').classList.add('is-hidden');
    }

  }

}