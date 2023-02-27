import { LightningElement, wire, api } from 'lwc';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import getSolutions from '@salesforce/apex/OSB_SolutionShowcase_CTRL.getSolutionShowcase';
import getSolutionSearchResults from '@salesforce/apex/OSB_SolutionShowcase_CTRL.getSolutionSearchResults';
import getRegisteredApplication from "@salesforce/apex/OSB_Dashboard_CTRL.getRegisteredApplication";
import fetchMetaListLwc from '@salesforce/apex/OSB_MiniMallCustomMetadata_CTRL.fetchMetaListLwc';
import {
    subscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import ApplicationRefresh from '@salesforce/messageChannel/osbApplicationRefresh__c';

export default class osbApplicationGallerylwc extends LightningElement {
    userId = Id;
    appSolutions = [];
    regApps = [];
    searchedSolutions = [];
    noSearchResults;
    appSolutionDisplay = false;
    appCategories = [];
    noFilteredSolutions = false;
    Applicationsubscription = null;
    searchInputSaved;
    refreshResult;
    refreshRegisteredResult;
    recordAdded;
    fullListApp;
    currentCategories;

    @wire(MessageContext)
    messageContext;
 
    subscribeToMessageChannel() {
        if (!this.Applicationsubscription) {
            this.Applicationsubscription = subscribe(
                this.messageContext,
                ApplicationRefresh,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    updateRegApps(){
        return refreshApex(this.refreshRegisteredResult);
    }

    handleMessage(message) {
        this.recordAdded = message.recordAdded;
        this.updateRegApps();
        return refreshApex(this.refreshResult);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    @wire(fetchMetaListLwc, ({userId : '$userId'}))
    categoryHandler(result){
        if(result.data){       
            let categories = JSON.parse(JSON.stringify(result.data));
            this.currentCategories = categories;
        }
    }

    @wire(getSolutions, ({userId : '$userId'}))
    getSolutions(result){
        this.refreshResult = result;
        if(result.data){    
            let mySolutions = JSON.parse(JSON.stringify(result.data)) ;
            let ApplicationSolutions = [];
            for(let i=0; i < (mySolutions.length); i++){
                if(!(mySolutions[i].Is_coming_soon__c)){
                    ApplicationSolutions.push(mySolutions[i]);  
                }                                
            }
            this.fullListApp=this.arrangeList(ApplicationSolutions);
            this.appSolutions = this.arrangeList(ApplicationSolutions);
            this.appSolutionDisplay = true;
        }
    }

    @api
    handleFilter(categoriesReceived){
        this.appCategories = [...new Set( JSON.parse(JSON.stringify(categoriesReceived)))];
        this.noFilteredSolutions = false;
        this.appSolutionDisplay = true;
        
        if(this.searchInputSaved){
            this.searchForSolutions();
        }else{
            this.getCategoriesList();
        }
    }

    @wire(getRegisteredApplication, ({userId : '$userId'}))
    getRegisteredApplications(result){
        this.refreshRegisteredResult = result;
        if(result.data){       
            let myapps = JSON.parse(JSON.stringify(result.data));
            this.regApps = myapps;
        }
    }

    searchForSolutions(){ 
        let searchInputField = this.template.querySelector(`[data-id="searchInput"]`);
        let searchInput = searchInputField ? searchInputField.value : "";
        searchInput = searchInput.toLowerCase();
        this.searchInputSaved = searchInput;
        this.appSolutionDisplay = true;
        if((searchInput) && (searchInput.length>1)){
            this.searchedSolutions = [];
            this.noSearchResults = false;
            getSolutionSearchResults({userId: this.userId, searchKeyword: searchInput})
            .then(data => {
                if(data){
                    let mySearchedSolutions = JSON.parse(JSON.stringify(data)) ;
                    let myRegisteredSolutions = JSON.parse(JSON.stringify(this.regApps));
                    let SearchedSolutionsList = [];
        
                    for(let i=0; i < (mySearchedSolutions.length); i++){
                        if(!(mySearchedSolutions[i].Is_coming_soon__c)){
                            let alreadyRegister = false;
                            for(let j=0; j < myRegisteredSolutions.length; j++){
                                if(myRegisteredSolutions[j].Solution__r.Title == mySearchedSolutions[i].Title){
                                    alreadyRegister = true;
                                }
                            }
                            if(alreadyRegister == false){
                                if(this.appCategories.length == 0){                                    
                                    SearchedSolutionsList.push(mySearchedSolutions[i]); 
                                }else{                                    
                                    if(mySearchedSolutions[i].Categories__c){
                                        let categoryArray = mySearchedSolutions[i].Categories__c.split(';');                                        
                                        for(let j = 0; j < (this.appCategories.length); j++){
                                            for(let x = 0; x <(categoryArray.length); x++){
                                                if(categoryArray[x] == this.appCategories[j]){
                                                    SearchedSolutionsList.push(mySearchedSolutions[i]);  
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }                  
                    } 
                    if(SearchedSolutionsList.length>0){
                        this.searchedSolutions =this.arrangeList(SearchedSolutionsList);
                        this.noSearchResults = false;
                        let searchFor = true;
                        this.template.querySelector('c-osb-paginationlwc').handleChanges(this.searchedSolutions,searchFor );
                    } else{
                        this.noSearchResults = true;
                        this.appSolutionDisplay = false;
                    }
                }
            })
        }else{
            let searchFor = false;
            this.noSearchResults = false;
            this.appSolutionDisplay = true;
            if((this.appCategories.length > 0) && (this.appCategories.length < this.currentCategories.length)){
                this.getCategoriesList();
            } else{
                this.appSolutions = this.fullListApp;
                this.template.querySelector('c-osb-paginationlwc') ? this.template.querySelector('c-osb-paginationlwc').handleChanges(this.appSolutions,searchFor) : '';
            }
        }
    }

    arrangeList(unArrangedList){
        let newList = JSON.parse(JSON.stringify(unArrangedList));
        let ArrangedList = newList.sort(function(a, b){
            let titleA=a.Title.toLowerCase(), titleB=b.Title.toLowerCase();
            if (titleA < titleB) 
             return -1;
            if (titleA > titleB)
             return 1;
            return 0; 
           });

        ArrangedList = [...new Set( ArrangedList)];
        return ArrangedList;
    }

    getCategoriesList(){
        getSolutions({userId: this.userId})
        .then(data => {
            if(data){
                let filteredSolutions = JSON.parse(JSON.stringify(data));
                let filteredSolutionsApplicationSolutions = [];  
                if(this.appCategories.length == 0){
                    for(let i=0; i < (filteredSolutions.length); i++){
                            if(!(filteredSolutions[i].Is_coming_soon__c)){
                                filteredSolutionsApplicationSolutions.push(filteredSolutions[i]);  
                            }                                          
                    }
                }else{
                    for(let i = 0; i < (filteredSolutions.length); i++){
                        if(!(filteredSolutions[i].Is_coming_soon__c)){
                            if(filteredSolutions[i].Categories__c){
                                let categoryArray = filteredSolutions[i].Categories__c.split(';');

                                for(let j = 0; j < (this.appCategories.length); j++){
                                    for(let x = 0; x <(categoryArray.length); x++){
                                        if(categoryArray[x] == this.appCategories[j]){
                                            filteredSolutionsApplicationSolutions.push(filteredSolutions[i]);                                  
                                        }
                                    }
                                }
                            }        
                        }         
                    }
                }  
                if(filteredSolutionsApplicationSolutions.length == 0){
                    this.noFilteredSolutions = true;
                    this.appSolutionDisplay = false;
                }else{
                    this.noFilteredSolutions = false;
                    this.appSolutions = this.arrangeList(filteredSolutionsApplicationSolutions);
                    let searchFor = false;
                    this.template.querySelector('c-osb-paginationlwc').handleChanges(this.appSolutions,searchFor);
                }
            }

        })

    }
}