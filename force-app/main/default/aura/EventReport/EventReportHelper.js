/**
 * Created by mjaznicki on 24.08.2018.
 */
({
    validateRecord : function(component,helper, record){
        let required = component.get('v.requiredFields');
        let missingFields = 'Please complete following fields: ';
        let fireToast = false;
        let fieldName2FieldLabel = new Map();
        fieldName2FieldLabel.set('Description__c', 'Description');
        fieldName2FieldLabel.set('Subject__c', 'Subject');
        fieldName2FieldLabel.set('Start__c', 'Start');
        fieldName2FieldLabel.set('End__c', 'End');
        fieldName2FieldLabel.set('Assigned_To__c', 'Assign To');
        fieldName2FieldLabel.set('Meeting_Audience__c', 'Meeting Audience');
        fieldName2FieldLabel.set('Meeting_Purpose__c', 'Meeting Purpose');
        fieldName2FieldLabel.set('Meeting_Format__c', 'Meeting Format');
        required.forEach(function(field){
            if(!record[field]){
                missingFields+=fieldName2FieldLabel.get(field) + '; ';
                fireToast = true;
                let cmp = component.find(field);
                if(cmp) {
                    cmp.set('v.errorMessage', 'Please complete this field');
                }
            } else {
                 let cmp = component.find(field);
                 if(cmp) {
                    cmp.set('v.errorMessage', '');
                 }
            }
        });
         if(fireToast){
             helper.showError(event, missingFields);
         }
         return !fireToast;
    },

    showError: function(event, msg){
         let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
            title : 'Error Message',
            message: msg ,
            duration:' 5000',
            type: 'error',
         });
         toastEvent.fire();
    },

    navigateToURL: function(event, url){
    let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
           "url": url
         });
         urlEvent.fire();
    },

   checkCore: function(component, event, helper, rec){
       let getCore = component.get('c.checkCoreAttendees');
       getCore.setParam('recordId', rec.Id);
       getCore.setCallback(this, function(response) {
           let state = response.getState();
           console.log(state);
              if (state === "SUCCESS") {
                  if(response.getReturnValue()){
                      let attUrl = '/lightning/cmp/c__InternalAttendees?c__recordId='+rec.Id;
                      helper.navigateToURL(event, attUrl);
                  } else {
                       let url = '/'+rec.Id;
                       helper.navigateToURL(event, url);
                  }
              }
       });
       $A.enqueueAction(getCore);
   },

   setDatesOnInit: function(component) {
       this.setStartDate(component);
       this.setEndDate(component);
   },

   setStartDate : function(component) {
        let startDate = this.getNextFullHour(new Date());
        let formattedStartDate = this.convertToSalesforceDateFormat(startDate);
        component.set('v.report.Start__c', formattedStartDate);
   },

   setEndDate : function(component) {
       let startDate = new Date(component.get('v.report.Start__c'));
       let endDate = this.getNextHour(startDate);
       let formattedEndDate = this.convertToSalesforceDateFormat(endDate);
       component.set('v.report.End__c', formattedEndDate);
   },

   getNextFullHour : function(dateToConvert) {
        return new Date(
            dateToConvert.getFullYear(),
            dateToConvert.getMonth(),
            dateToConvert.getDate(),
            dateToConvert.getHours() + 1
        );
   },

   getNextHour : function(dateToConvert) {
        return new Date(
            dateToConvert.getFullYear(),
            dateToConvert.getMonth(),
            dateToConvert.getDate(),
            dateToConvert.getHours() + 1,
            dateToConvert.getMinutes()
        );
   },

   convertToSalesforceDateFormat : function(dateToConvert) {
        return $A.localizationService.formatDate(dateToConvert, 'YYYY-MM-DDTHH:mm:ssZ');
   },

   checkIsCommBUser : function(component) {
        let self = this;
        let isCommB = component.get('c.isCommBUser');
        isCommB.setCallback(this, function(response){
        if(response.getState() === "SUCCESS"){
            let fieldsToQuery = component.get('v.fieldsToQuery');
            if(response.getReturnValue() == true){
                component.set('v.isCommB', true);
            }
            component.set('v.fieldsToQuery', fieldsToQuery);
            let myPageRef = component.get("v.pageReference");
            let Id = myPageRef.state.c__recordId;
            component.set("v.recordId", Id);
            if(!Id){
                component.find('reportRDNEW').getNewRecord(
                    'Call_Report__c',
                    null,
                    false,
                    $A.getCallback(function() {
                        let rec = component.get("v.report");
                        self.setDatesOnInit(component);
                    })
                );
            }
        }
        });
        $A.enqueueAction(isCommB);
   },

   checkIsSalesforceLicenseUser : function(component) {
       const checkUser = component.get("c.isSalesforceLicenseUser");
       checkUser.setCallback(this, function(response){
           if(response.getState() === "SUCCESS"){
               const isSalesforceLicenseUser = response.getReturnValue();
               const fieldsToQuery = component.get("v.fieldsToQuery");
               if(isSalesforceLicenseUser) {
                   fieldsToQuery.push("Related_to_Campaign__c");
                   fieldsToQuery.push("Relate_to_Opp__c");
               }
               component.set("v.isSalesforceLicenseUser", isSalesforceLicenseUser);
               component.set("v.fieldsToQuery", fieldsToQuery);
           }
           this.checkIsCommBUser(component);
       });
       $A.enqueueAction(checkUser);
   },

})