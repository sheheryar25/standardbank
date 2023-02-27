import { LightningElement, wire, api, track} from 'lwc';
import dashboardUrl from '@salesforce/label/c.aki_TrackMyOpportunities';
import { refreshApex } from '@salesforce/apex';
import changeProdSpecialist from '@salesforce/apex/AKI_COMP_AkiliInsightsListviewController.changeProdSpecialist';
import snoozeInsightRec from '@salesforce/apex/AKI_COMP_AkiliInsightsListviewController.snoozedInsights';
import getInsightsData from '@salesforce/apex/AKI_COMP_AkiliInsightsListviewController.getInsightsData';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

//insight feedback
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import INSIGHTACTION_OBJECT from '@salesforce/schema/Insight_Action__c';
import INSIGHTQUALITY_FIELD from '@salesforce/schema/Insight_Action__c.Insight_Quality__c';
import INSIGHTSTATUS_FIELD from '@salesforce/schema/Insight_Action__c.Insight_Status__c';
import feedbackInsights from '@salesforce/apex/AKI_COMP_AkiliInsightsListviewController.feedbackInsights';

//update Insight record
import INSIGHTS_ID from '@salesforce/schema/Insight__c.Id';
import INSIGHTS_Revenue from '@salesforce/schema/Insight__c.Potential_Insight_Revenue__c';
import INSIGHTS_Comment from '@salesforce/schema/Insight__c.Comment__c';

//CreateOpportunity
import createOpportunity from '@salesforce/apex/AKI_COMP_AkiliInsightsListviewController.createOpportunity';

const columns=[
   
    {
      label: 'Date Created',
      fieldName: 'Lead_Date__c'
  },
  {
      label: 'Expiry Date',
      fieldName: 'Expiry_Date__c',
      cellAttributes:{
        class:{fieldName:'expiryDateColor'},
        style:{fieldName:'expiryDateColorStyle'}
    }
  },
  {
      label: 'Category',
      fieldName: 'Category__c'
  },
  {
      label: 'Sub Category',
      fieldName: 'Sub_Category__c'
  },
  {
      label: 'Client Name',
      fieldName: 'ClientName'
  },
  {
      label: 'Insight',
      type: "button",        
      typeAttributes: { label: { fieldName: "insightSubString" }, name: "InsightNameModalOpen", wrapText: true, variant: "base" }    
  },
  {
      label: 'Product Specialist',
      fieldName: 'ProductSpecialist'
  },
  {
      label: 'Client Coordinator',
      fieldName: 'ClientCoordinator'
  },
  {
        
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            name: "addOpportunity",
            iconName: 'action:new',
            title: 'Add Opportunity',            
            size: 'large',
            variant: 'brand',
            alternativeText: 'Add Opportunity',
            iconClass: 'add-opportunity-css' 
                               
        }
    },
    {        
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            name: "changeOwner",
            iconName: 'action:change_owner',
            title: 'Change Product Specialist',
            variant: 'brand',
            size: 'large',
            alternativeText: 'Change Product Specialist'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            name: "snoozeInsight",
            iconName: 'custom:custom25',
            title: 'Snooze Insight',
            variant: 'brand',
            size: 'large',
            alternativeText: 'Snooze Insight'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            name: "insightFeedback",
            iconName: 'standard:feedback',
            title: 'Insight Feedback',
            variant: 'brand',
            size: 'large',
            alternativeText: 'Insight Feedback'
        }
    }
];

export default class akiCompAkiliInsightsListview extends NavigationMixin(LightningElement) {
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    @track tableContent;
    @track modalContainer = false;
    @track selectedRow={};
    result;
    wiredActivities;
    
    //variables for paginations
    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns = columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 10; 
    @track totalRecountCount = 0;
    @track totalPage = 0;

    //variable for insight record update
    @track recPotentialRev ='';
    @track recComments = '';
    inputLabel;
    inputValue;

    // variable for change owner
    @track changeOwnerModalFlag = false;
    @track sendEmailOwnerChange = false;


    //variables for stateful filter buttons 
    @track myInsightsSelected=true;
    @track myInsightsVarient = 'brand';
    @track allInsightsSelected=false;
    @track allInsightsVarient = 'neutral';
    @track expiringSoonSelected=false;
    @track expiringSoonVarient = 'neutral';
    @track snoozedInsightsSelected=false;
    @track snoozedInsightsVarient = 'neutral';
    
    
    
    //variable for lookup    
    @track looupRecordName;  
    @track lookupRecordId; 
    @track changeOwnerBottonFlag = true;


    //CreateOpportunity
    @track createOppFlag;
    @track createOppName;
    @track createOppDesc;
    @track createOppProb;
    @track createOppCloseDate;
    @track createOppClientName;  
    @track createOppClientId;
    @track createOppButtonFlag=true;

    //variable for Snooze Insight
    @track snoozeModalFlag;
    snoozedIconName = 'utility:preview';
    snoozedButtonLabel = 'Snooze';

    //variable for send feedback
    @track sendFeedbackFlag = false;
    @track insightQualityVal = '';
    @track insightStatusVal = '';
    @track submitSendFeedbackFlag = true;

    @track getInsightParam = '{"searchKey": " ",    "myInsightsSelected": '+this.myInsightsSelected+',    "allInsightsSelected": '+this.allInsightsSelected+',    "expiringSoonSelected": '+this.expiringSoonSelected+',    "snoozedInsightsSelected": '+this.snoozedInsightsSelected+'}';

    @wire(getInsightsData, { getInsightParamVal:  '$getInsightParam'})
    wiredInsights({ error, data }) {
        if (data) {        
            this.data = data;            
            this.addColumnToReturnTable();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    invokeRefreshApex(){
        this.getInsightParam = '{"searchKey": "'+this.searchKey+'",    "myInsightsSelected": '+this.myInsightsSelected+',    "allInsightsSelected": '+this.allInsightsSelected+',    "expiringSoonSelected": '+this.expiringSoonSelected+',    "snoozedInsightsSelected": '+this.snoozedInsightsSelected+'}';
        return refreshApex(this.data);
    }
    addColumnToReturnTable(){
        this.data = JSON.parse(JSON.stringify(this.data));
        //Add Custom column to table to display related obkect details
        this.data.forEach(function(e){
                if (typeof e === "object" ){
                    if("Client__r" in e){ /** will return true if exist */
                        e.ClientName = e.Client__r.Name;
                        e.createOppStyle = 'padding-bottom: 4px;';
                    }else{
                        e.Client__r = '{"Name":"","Client_Sector__c":"","Id":"","Description":""}'; 
                        e.createOppStyle = 'padding-bottom: 28px;';                       
                    }
                    if("Owner" in e){ /** will return true if exist */
                        e.ProductSpecialist = e.Owner.Name;
                    }
                    if("Client_Coordinator__r" in e){ /** will return true if exist */
                        e.ClientCoordinator = e.Client_Coordinator__r.Name;
                    }else{
                        e.Client_Coordinator__r = '{"Name":""}';
                    }
                    if("Insight__c" in e){ //added to trim insight text so button will be short
                        if(e.Insight__c.length > 35){
                            e.insightSubString = e.Insight__c.slice(0, 33)+'...';
                        }else{
                            e.insightSubString = e.Insight__c;
                        }
                    }
                    if("Potential_Insight_Revenue__c" in e){
                        //this.recPotentialRev = e.Potential_Insight_Revenue__c;
                    }else{
                        e.Potential_Insight_Revenue__c = '';
                    }
                    if("Comment__c" in e){
                        //this.recComments = e.Comment__c;
                    }else{
                        e.Comment__c = '';
                    }
                    
                    var today           =  new Date();
                    var betweenTwo      = new Date();
                    var betweenThree    =  new Date();
                    var betweenSeven    = new Date();
                    var dd    = today.getDate();
                    var mm    = today.getMonth()+1; //January is 0!
                    var yyyy  = today.getFullYear();

                    if(dd<10){dd='0'+dd};
                    if(mm<10){mm='0'+mm};
                   // 2021-07-14
                    today = yyyy+'-'+mm+'-'+dd;
                    betweenTwo =  yyyy+'-'+mm+'-'+(dd+2);

                    //between 5 to 7
                    betweenThree = yyyy+'-'+mm+'-'+(dd+3);
                    betweenSeven = yyyy+'-'+mm+'-'+(dd+7);

                    if( e.Expiry_Date__c >= today && e.Expiry_Date__c <= betweenTwo){
                        e.expiryDateColor = "slds-text-color_error";  
                    }else if(e.Expiry_Date__c >= betweenThree && e.Expiry_Date__c <= betweenSeven){
                        e.expiryDateColorStyle = "color:orange;"; 
                        e.expiryDateColor = "td-orangeColor";  
                    }  
                }
          });

          

          this.assignTableContentData(this.data);
    }

    assignTableContentData(detailtableContent){

        this.items = detailtableContent;
        this.totalRecountCount = detailtableContent.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        this.page = 1;
        this.tableContent = this.items.slice(0,this.pageSize); 

        this.endingRecord = this.pageSize;
    }

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.tableContent = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.invokeRefreshApex();
        
    }
  
    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        this.invokeRefreshApex();
    }

    handleRowAction(event){    
        const dataRow = event.detail.row;
        this.selectedRow=dataRow;

        this.recComments = this.selectedRow.Comment__c;
        this.recPotentialRev = this.selectedRow.Potential_Insight_Revenue__c;

              
        if (event.detail.action.name === "InsightNameModalOpen") {
            this.modalContainer=true;
            this.setSnoozeLable();
        }
        if (event.detail.action.name === "changeOwner") {
            this.changeOwnerModalFlag=true;
        }
        if(event.detail.action.name === "addOpportunity"){
            //CreateOpportunity SFP-6639
            this.modalContainer=false;
            this.createOppFlag=true;
        }
        if(event.detail.action.name === "snoozeInsight"){
            //alert('snoozeInsight');
            this.snoozeModalFlag = true;
            this.setSnoozeLable();
        }
        if(event.detail.action.name === "insightFeedback"){
            this.sendFeedbackFlag = true;
        }
     }

     handleOwnerSelection(event){
      //  this.selectedAccount = event.target.value;
        alert("The selected Accout id is"+event.target.value);
     }

     handleRecChanges(event){
        this.inputLabel = event.target.label;
        this.inputValue = event.target.value;

        if( this.inputLabel === "Comments" && this.inputValue !== null && this.inputValue !=='' && this.inputValue !== undefined){         
            this.recComments = event.target.value;

        }   
        if( this.inputLabel === "Potential Insight Revenue" && this.inputValue !== null && this.inputValue !=='' && this.inputValue !== undefined){
            this.recPotentialRev = event.target.value;
        }
    }

    saveRecAction(){
                        
        const fields = {};
        let isReady = false;

        fields[INSIGHTS_ID.fieldApiName] = this.selectedRow.Id;

        if(this.recPotentialRev !== null && this.recPotentialRev !=='' && this.recPotentialRev !== undefined){
            fields[INSIGHTS_Revenue.fieldApiName] = this.recPotentialRev;
            this.selectedRow.Potential_Insight_Revenue__c = this.recPotentialRev;
            isReady = true;
            this.recPotentialRev = '';
        }
        if(this.recComments !== null && this.recComments !=='' && this.recComments !== undefined){
            fields[INSIGHTS_Comment.fieldApiName] = this.recComments;
            this.selectedRow.Comment__c = this.recComments;
            isReady = true;
            this.recComments = '';
        }
        const recordInput = { fields };

        if(isReady){
            updateRecord(recordInput)
                .then(()=> {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record has been updated successfully.',
                            variant: 'success',
                        }),
                    );
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Updating Error',
                            message:  'Record Update failed, Please contact system administrator.',
                            variant: 'error',
                        }),
                    );
            });
            isReady = false;
        }
        this.closeModalAction();
    }

     navigateInsigtDetailPage(){        
        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.selectedRow.Id,
                objectApiName: 'Insight__c',
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, "_blank");
        });        
     }

     navigateClientDetailPage(){        
        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.selectedRow.Client__r.Id,
                objectApiName: 'Account',
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, "_blank");
        });    
    }
    navigateTrackMyOpportunities(){
        this[NavigationMixin.GenerateUrl]({
            type : 'standard__webPage',
            attributes: {
                url : dashboardUrl
            }
        }).then(url => {
            window.open(url, "_blank");
        }); 
    }

     closeModalAction(){
        this.modalContainer=false;
        this.recComments = '';
    }
    onProductSpecSelection(event){  
        this.looupRecordName = event.detail.selectedValue;  
        this.lookupRecordId = event.detail.selectedRecordId; 
        if(this.lookupRecordId == '' || this.lookupRecordId == null){
            this.changeOwnerBottonFlag = true;
        } else{
            this.changeOwnerBottonFlag = false;
        }

    } 
    handleSendEmailOwnerChange(event){
        this.sendEmailOwnerChange = event.target.checked;        
    }
    openChangeOwner() {
        this.modalContainer=false;
        // to open modal set changeOwnerModalFlag tarck value as true
        this.changeOwnerModalFlag = true;
    }
    closeChangeOwner() {
        // to close modal set changeOwnerModalFlag tarck value as false
        this.changeOwnerModalFlag = false;
    }
    submitChangeOwner() {      
        let changepsParam = '{"recId":"'+ this.selectedRow.Id+'","psId": "'+this.lookupRecordId+'","oldRecOwnerId":"'+ this.selectedRow.OwnerId+'","sendEmailOwnerChange": '+this.sendEmailOwnerChange+',"leadId": "'+this.selectedRow.External_Lead_ID__c+'"}';

        changeProdSpecialist({ changepsParamVal: changepsParam  })
        .then(result=>{                     
            
            const toastEvent = new ShowToastEvent({
              title:'Success!',
              message:'Product specialist has been updated successfully.',
              variant:'success'
            });
            this.dispatchEvent(toastEvent);
            this.sendEmailOwnerChange = false;
            setTimeout(function(){
                window.location.reload(1);
             }, 3000);          
        })
        .catch(error=>{
            this.error=error.message;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Updating Error',
                    message:  'Product specialist update failed, Please contact system administrator.',
                    variant: 'error',
                }),
            );
        });
        
        // to close modal set changeOwnerModalFlag tarck value as false
        //Add your code to call apex method or do some processing
        this.changeOwnerModalFlag = false;
        
          
    }
        
    handleMyInsightsClick(){
        this.myInsightsSelected = !this.myInsightsSelected;
        if(this.myInsightsSelected){
            this.myInsightsVarient='brand';
            this.allInsightsVarient='neutral';
            this.expiringSoonVarient='neutral';
            this.snoozedInsightsVarient='neutral';
            this.allInsightsSelected=false;
            this.expiringSoonSelected=false;
            this.snoozedInsightsSelected=false;
            this.searchKey = '';
        }else{
            this.myInsightsVarient='neutral';
        }
        this.invokeRefreshApex();
    }
    handleAllInsightsClick(){
        this.allInsightsSelected = !this.allInsightsSelected;
        if(this.allInsightsSelected){
            this.allInsightsVarient='brand';
            this.myInsightsVarient='neutral';
            this.expiringSoonVarient='neutral';
            this.snoozedInsightsVarient='neutral';
            this.myInsightsSelected=false;
            this.expiringSoonSelected=false;
            this.snoozedInsightsSelected=false;
            this.searchKey = '';
        }else{
            this.allInsightsVarient='neutral';
        }
        this.invokeRefreshApex();
    }    
    handleExpiringSoonClick(){
        this.expiringSoonSelected = !this.expiringSoonSelected;
        if(this.expiringSoonSelected){
            this.expiringSoonVarient='brand';
            this.myInsightsVarient='neutral';
            this.allInsightsVarient='neutral';
            this.snoozedInsightsVarient='neutral';
            this.myInsightsSelected=false;
            this.allInsightsSelected=false;
            this.snoozedInsightsSelected=false;
            this.searchKey = '';
        }else{
            this.expiringSoonVarient='neutral';
        }
        this.invokeRefreshApex();
    }
    handleSnoozedInsightsClick(){
        this.snoozedInsightsSelected = !this.snoozedInsightsSelected;
        if(this.snoozedInsightsSelected){
            this.snoozedInsightsVarient='brand';
            this.expiringSoonVarient='neutral';
            this.myInsightsVarient='neutral';
            this.allInsightsVarient='neutral';
            this.myInsightsSelected=false;
            this.allInsightsSelected=false;
            this.expiringSoonSelected=false;
            this.searchKey = '';
        }else{
            this.snoozedInsightsVarient='neutral';
        }
        this.invokeRefreshApex();
    }


    //createOpportunity SFP-6639

    toggleCOSubmit()
    {
        var filled=true;
        var coFields=this.template.querySelectorAll('lightning-input.coFields');
        coFields.forEach(function(element){
            if(element.value)
            {
                if(element.value.length===0)
                {
                    filled=false;
                }
            }
            else{
                filled=false;
            }
        },this);        
        if(filled)
        {
            this.createOppButtonFlag=false;
        }
        else{
            this.createOppButtonFlag=true;
        }
    }

    handleCOName(event)
    {
        this.createOppName=event.detail.value;
        this.toggleCOSubmit();
    }

    onClientSelection(event){  
        this.createOppClientName= event.detail.selectedValue;
        this.createOppClientId = event.detail.selectedRecordId; 
        if(this.createOppClientId == '' || this.createOppClientId == null){
            this.createOppButtonFlag = true;
        } else{
            this.createOppButtonFlag = false;
        }
        this.toggleCOSubmit();
    }

    handleCODesc(event)
    {
        this.createOppDesc=event.detail.value;
        this.toggleCOSubmit();
    }

    handleCOCloseDate(event)
    {
        this.createOppCloseDate=event.detail.value;
        this.toggleCOSubmit();
    }

    openCreateOpp()
    {
        this.modalContainer=false;
        this.createOppFlag=true;
    }

    closeCreateOpp()
    {
        this.createOppFlag=false;
        this.createOppButtonFlag=true;
    }

    submitCreateOpp()
    {
        this.createOppFlag=false;
        this.createOppButtonFlag=true;
        let createOpptyPrams = '{"recId":"'+this.selectedRow.Id+'","coClientId":'+( this.selectedRow.Client__c ? '"'+this.selectedRow.Client__c+'"' : null)+',"coName":"'+this.createOppDesc+'","coDescription":"'+this.createOppDesc+'","coCloseDate":"'+this.createOppCloseDate+'","leadId":"'+this.selectedRow.External_Lead_ID__c+'"}';
        createOpportunity({createOpptyPramsVal: createOpptyPrams})
        .then(result=>{                     
            const toastEvent = new ShowToastEvent({
            title:'Success!',
            message:'New Opportunity Created',
            variant:'success'
            });
            this.dispatchEvent(toastEvent);
            this.createOppClient = false;
             setTimeout(function(){
             window.location.reload(1);
             }, 3000);          
        })
        .catch(error=>{
            this.error=error.message;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Updating Error',
                    message:  'Opportunity creation failed, Please contact system administrator.',
                    variant: 'error',
                }),
            );
        });
    }

    handleSnoozedToggleClick() {          

        this.closeSnoozeInsight();

        let snoozeInsightParam = '{"recId":"'+this.selectedRow.Id+'","recComments":"'+ this.selectedRow.Comment__c+'","isSnoozed":'+!this.selectedRow.Is_Snoozed__c +',"leadId":"'+this.selectedRow.External_Lead_ID__c+'"}';

        snoozeInsightRec({ snoozeInsightParamVal: snoozeInsightParam  })
                .then(result=>{     
                    let lableval = this.selectedRow.Is_Snoozed__c ? 'Unsnoozed' : 'Snoozed';                
                    
                    const toastEvent = new ShowToastEvent({
                        title:'Success!',
                        message:'You have '+lableval+' the Insight.',
                        variant:'success'
                    });
                    this.dispatchEvent(toastEvent);
                    
                    setTimeout(function(){
                        window.location.reload(1);
                    }, 3000);          
                })
                .catch(error=>{
                    this.error=error.message;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Updating Error',
                            message:  'Snooze Insight action failed, Please contact system administrator.',
                            variant: 'error',
                        }),
                    );
                });       
             
    }
    
    openSnoozeInsight(){
        this.snoozeModalFlag = true;
        this.modalContainer = false;
        this.recComments = '';
    }

    closeSnoozeInsight(){
        this.snoozeModalFlag = false;        
    }
    setSnoozeLable(){
        if(this.selectedRow.Is_Snoozed__c){
            this.snoozedButtonLabel = 'Unsnooze';
        }else{
            this.snoozedButtonLabel = 'Snooze';
        }
     }

     //methodes for send feedback action
     // to get the default record type id, if you dont' have any recordtypes then it will get master

    @wire(getObjectInfo, { objectApiName: INSIGHTACTION_OBJECT })
    InsActionMetadata;

     // now get the industry picklist values
     @wire(getPicklistValues,
        {
            recordTypeId: '$InsActionMetadata.data.defaultRecordTypeId', 
            fieldApiName: INSIGHTQUALITY_FIELD
        }
    )
    insQualityPicklist;
    
     // now get the industry picklist values
     @wire(getPicklistValues,
        {
            recordTypeId: '$InsActionMetadata.data.defaultRecordTypeId', 
            fieldApiName: INSIGHTSTATUS_FIELD
        }
    )
    insStatusPicklist;

    // on select picklist value to show the selected value
    insQualityPicklistHandleChange(event) {
        this.insightQualityVal = event.detail.value;
        if((this.insightQualityVal == '' || this.insightQualityVal == null) || (this.insightStatusVal == '' || this.insightStatusVal == null)){
            this.submitSendFeedbackFlag = true;
        }else{
            this.submitSendFeedbackFlag = false;
        }
    }

    insStatusPicklistHandleChange(event) {
        this.insightStatusVal = event.detail.value;
        if((this.insightQualityVal == '' || this.insightQualityVal == null) || (this.insightStatusVal == '' || this.insightStatusVal == null)){
            this.submitSendFeedbackFlag = true;
        }else{
            this.submitSendFeedbackFlag = false;
        }
    }
    
    openSendFeedback(){
        this.sendFeedbackFlag = true;
        this.modalContainer = false;
    }

    closeSendFeedback(){
        this.sendFeedbackFlag = false;
        this.insightQualityVal = '';
        this.insightStatusVal = '';
    }

    submitSendFeedback(){
        this.sendFeedbackFlag = false;

        let feedbackInsight = '{"recId":"'+this.selectedRow.Id+'","insightStatusVal":"'+this.insightStatusVal+'","insightQualityVal":"'+this.insightQualityVal+'","leadId":"'+this.selectedRow.External_Lead_ID__c+'"}';
        feedbackInsights({ feedbackInsightVal : feedbackInsight  })
        .then(result=>{                     
            
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Your feedback has been submitted for an Insight.',
                variant:'success'
            });
            this.dispatchEvent(toastEvent);
            
            setTimeout(function(){
                window.location.reload(1);
            }, 3000);          
        })
        .catch(error=>{
            this.error=error.message;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Updating Error',
                    message:  'Failed to send feedback, Please contact system administrator.',
                    variant: 'error',
                }),
            );
        });
        
        this.insightQualityVal = '';
        this.insightStatusVal = '';
    }
}