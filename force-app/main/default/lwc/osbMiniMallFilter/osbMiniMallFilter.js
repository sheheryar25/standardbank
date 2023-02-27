import { LightningElement,wire,api,track } from 'lwc';
import Minimall from '@salesforce/resourceUrl/OSB_MiniMall';
import fetchMetaListLwc from '@salesforce/apex/OSB_MiniMallCustomMetadata_CTRL.fetchMetaListLwc';
import { loadScript} from 'lightning/platformResourceLoader';
import $RESOURCE_OSBCloseIcon from "@salesforce/resourceUrl/OSBCloseIcon";
import { subscribe, MessageContext } from 'lightning/messageService';
import jQuery from '@salesforce/resourceUrl/OSB_JQuery';
import Id from '@salesforce/user/Id';
const COLUMNS = [
    { label: 'Label', fieldName: 'MasterLabel' },
    { label: 'Image', fieldName: 'ImageLink__c' },
];

export default class osbMiniMallFilter extends LightningElement {
    userId = Id;
    OSBCloseIcon = $RESOURCE_OSBCloseIcon;
    filterLogo = Minimall + '/MiniMall/Filter.svg';
    records;
    wiredRecords;
    error;
    columns = COLUMNS;
    mobileValues = [];
    subscription = null;

    modalOpen = false;

    @track index;
    @track Values;
    @track SelectedValues = [];
    @track showMiniMallFilter = false;
    @track boolVisible = true;
    @track valuesChecked = [];

    updateMobile = false;
    updateButtonColor = false;

    @api propertyValue;
    MobileFilter = false;

    @wire(MessageContext)
    MessageContext;

    @wire(fetchMetaListLwc, ({userId : '$userId'}))
    categoryHandler( value ) {
        this.wiredRecords = value;
        const { data, error } = value;
        if ( data ) {
            this.records = data;
            this.error = undefined;
        } else if ( error ) {
            this.error = error;
            this.records = undefined;
        }
    }

    handleHideShowData(){
        if (this.boolVisible == false){
            this.boolVisible = true;
        }else if (this.boolVisible == true){
            this.boolVisible = false;
        }
    }

    ShowFilterMobile(){
        this.template.querySelector('[class="MobileFilterOptions"]').style.visibility = 'visible';
    }
    doneFilter(){   
        this.template.querySelector('[class="MobileFilterOptions"]').style.visibility = 'hidden';
        this.SelectedValues = [...new Set( JSON.parse(JSON.stringify(this.SelectedValues)))];
        this.addToDesktop(this.SelectedValues);
        this.template.querySelector('c-osb-application-gallerylwc').handleFilter(this.SelectedValues);
}

    CloseFilter(){   
            this.template.querySelector('[class="MobileFilterOptions"]').style.visibility = 'hidden';
    }

 
   handleCheckbox(event){
    this.Values =  event.target.value;
    let allCategory = this.template.querySelectorAll('[data-id="checkboxCategory"]');
    if (event.target.checked) {
       this.SelectedValues.push(this.Values);
    } else {
        try {
            this.index = this.SelectedValues.indexOf( this.Values);
            this.SelectedValues.splice(this.index, 1);
        } catch (err) {
        }
    }  
    this.SelectedValues = [...new Set( JSON.parse(JSON.stringify(this.SelectedValues)))];
    this.addToMobile( this.SelectedValues);
    if(this.SelectedValues.length == this.records.length){
        allCategory[0].checked = true;
    }else{
        allCategory[0].checked = false;
    }
    this.template.querySelector('c-osb-application-gallerylwc').handleFilter(this.SelectedValues);
   }

    handleCheckAll(event){
        let i;
        let checkboxes = this.template.querySelectorAll(`[data-id="checkbox"]`);
        for(i=0; i<checkboxes.length; i++){
            checkboxes[i].checked = event.target.checked;
            if(event.target.checked){
                this.SelectedValues.push(checkboxes[i].value); 
                
            }else{
                
               this.SelectedValues.splice(i);
            }
        }
        this.SelectedValues = [...new Set( JSON.parse(JSON.stringify(this.SelectedValues)))];
        this.addToMobile(this.SelectedValues);
        this.template.querySelector('c-osb-application-gallerylwc').handleFilter(this.SelectedValues);
    }

    @api handleCategorySelection(category){
        let value = category;
        let result = value.includes("All Applications");
        if(result){
            let i;
            let Categories = this.template.querySelectorAll('[data-id="checkboxCategory"]');
            let checkboxes = this.template.querySelectorAll('[data-id="checkbox"]');
            for(let a=0; a<Categories.length; a++){
                Categories[a].checked = true;
            }            
            for(i=0; i<checkboxes.length; i++){
                checkboxes[i].checked = true;
                this.SelectedValues.push(checkboxes[i].value); 
            }
        }else{
            if(category){
                let j = this.template.querySelectorAll('[data-id="checkbox"]');

                 for (let i = 0; i < j.length; i++) {
                    if(j[i].value === category){
                         j[i].checked= true;
                        this.SelectedValues.push(j[i].value);
                     } 
                 }
            }
        }
        this.addToMobile(this.SelectedValues);
        this.template.querySelector('c-osb-application-gallerylwc').handleFilter(this.SelectedValues);
    }

    addToMobile(categories){
        let m = this.template.querySelectorAll('[data-id="checkboxMobile"]');
        let allCategoryMobile = this.template.querySelectorAll('[data-id="checkboxCategoryMobile"]');

        if(categories.length === this.records.length){
            allCategoryMobile[0].checked = true;
        }else{
            allCategoryMobile[0].checked = false;
        }

        m.forEach(element => {
            element.checked = false;
        });

        for(let j=0; j < m.length; j++){
           for(let i=0; i < categories.length; i++){
                if(m[j].value === categories[i]){
                    m[j].checked= true;
                }
           }
        }
    }

    addToDesktop(categories){
        let m = this.template.querySelectorAll('[data-id="checkbox"]');
        let allCategory = this.template.querySelectorAll('[data-id="checkboxCategory"]');

        if(categories.length == this.records.length){
            allCategory[0].checked = true;
        }else{
            allCategory[0].checked = false;
        }

        m.forEach(element => {
            element.checked = false;
        });

        for(let j=0; j < m.length; j++){
           for(let i=0; i < categories.length; i++){
                if(m[j].value === categories[i]){
                    m[j].checked= true;
                }
           }
        }
    }

    slideIt(){
        this.handleHideShowData();
        $(this.template.querySelectorAll('.arrow')).toggleClass("active");
    }

    renderedCallback(){
        loadScript(this, jQuery)
        .then(() => {
            this.SelectedValues =[];
            this.handleCategorySelection(this.propertyValue);
        })
        .catch(error=>{
        });
    }


    changeButtonColor() {
        if(this.updateButtonColor){
            this.template.querySelector('.CloseButton').style = 'background-color: #0089FF; color: #FFFFFF;';
        }
    }

    handleCheckboxMobile(event){
        this.Values =  event.target.value;
        let allCategoryMobile = this.template.querySelectorAll('[data-id="checkboxCategoryMobile"]');
        if (event.target.checked) {
            this.SelectedValues.push(this.Values);
            if(!this.updateButtonColor){
                this.updateButtonColor = true;
                this.changeButtonColor();
            }
        } else {
            try {
                this.index = this.SelectedValues.indexOf( this.Values);
                this.SelectedValues.splice(this.index, 1);
            } catch (err) {
            }
        }
        if(this.SelectedValues.length === this.records.length){
            allCategoryMobile[0].checked = true;
        }else{
            allCategoryMobile[0].checked = false;
        }
       }

     handleCheckAllMobile(event){
        let i;
        let checkboxes = this.template.querySelectorAll(`[data-id="checkboxMobile"]`);
        for(i=0; i<checkboxes.length; i++){
            checkboxes[i].checked = event.target.checked;
            if(event.target.checked){
                this.SelectedValues.push(checkboxes[i].value); 
            }else{             
               this.SelectedValues.splice(i);
            }
        }
        if(this.updateButtonColor == false){
            this.updateButtonColor = true;
            this.changeButtonColor();
        }
    }
}