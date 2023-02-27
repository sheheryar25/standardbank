/**
 * Created by mjaznicki on 13.08.2018.
 */
({
    doInit: function(component, event, helper) {
        helper.checkIsSalesforceLicenseUser(component);
    },

    onSave: function(component, event, helper) {
            let record = component.get('v.report');
            console.log(record.Visible_to_Internal_Attendees_only__c);
            record.Visible_to_Internal_Attendees_only__c = Boolean(record.Visible_to_Internal_Attendees_only__c);
            component.find('Total_Event_Costs__c').set('v.errorMessage', '');
            if(helper.validateRecord(component,helper, record)) {
                component.set('v.showSpinner', 'true');
                if(component.get('v.recordId') != null) {
                    if(record.Number_Of_Attended_Attendees__c  > 0 &&
                      (record.Total_Event_Costs__c == 0 || record.Total_Event_Costs__c == null) &&
                      new Date(record.End__c) < new Date() &&
                      record.Meeting_Format__c == 'Entertainment') {    
                        helper.showError(event, 'Please complete "Total Event Cost" field for this Entertainment Meeting format');
                        component.set('v.showSpinner', false);
                        component.set('v.isTotalCostRequired', true);
                        component.find('Total_Event_Costs__c').set('v.errorMessage', 'Please complete "Total Event Cost" field for this Entertainment Meeting format');
                    } else {
                        if(record.Attendee_Reminder_Required__c == 'HAS_REMINDER_NEED') {
                            component.set('v.report.Attendee_Reminder_Required__c', 'HAS_REMINDER_NO_NEED')
                        }
                        component.find('reportRD').saveRecord($A.getCallback(function(saveResult) {
                        if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                              let url = '/'+record.Id;
                              helper.navigateToURL(event, url);
                        } else {
                               component.set('v.showSpinner', 'false');
                               helper.showError(event, saveResult.error[0].message);
                         }
                    }));
                }
                } else {
                       component.find('reportRDNEW').saveRecord(function(saveResult) {
                       if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                           helper.checkCore(component, event, helper, record);
                       } else {
                             component.set('v.showSpinner', 'false');
                             helper.showError(event, saveResult.error[0].message);
                       }
                  });
               }
            }
    },

    initMeetingType: function(component, event, helper){
        component.set('v.showSpinner', 'false');
        if(!component.get('v.report.Assigned_To__c')){
            let userId = $A.get("$SObjectType.CurrentUser.Id");
            component.set('v.report.Assigned_To__c', userId);
            let startTime = new Date();
            let formattedStartDate = $A.localizationService.formatDate(startTime, "YYYY-MM-DDThh:mm:ssZ");
            let endDate = new Date();
            endDate.setHours(endDate.getHours()+1);
            let formattedEndDate = $A.localizationService.formatDate(endDate, "YYYY-MM-DDThh:mm:ssZ");
            component.set('v.report.Start__c', formattedStartDate);
            component.set('v.report.End__c', formattedEndDate);
        }
        let report = component.get('v.report');
        component.set('v.isTotalCostRequired',
                      report.Number_Of_Attended_Attendees__c  > 0 &&
                      (report.Total_Event_Costs__c == 0 || report.Total_Event_Costs__c == null) && 
                      new Date(report.End__c) < new Date() && 
                      report.Meeting_Format__c == 'Entertainment');
    },

    onCancel: function(component, event, helper){
        let url = '/a0K'
       helper.navigateToURL(event, url);
    },

    onSaveAndNew: function(component, event, helper){
            let record = component.get('v.report');
            console.log(record.Visible_to_Internal_Attendees_only__c);
            record.Visible_to_Internal_Attendees_only__c = Boolean(record.Visible_to_Internal_Attendees_only__c);
            if(helper.validateRecord(component,helper, record)){
                component.set('v.showSpinner', 'true');
                if(component.get('v.recordId') != null){
                component.find('reportRD').saveRecord($A.getCallback(function(saveResult) {
                     if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                           let navService = component.find("navService");
                           let pageReference = {
                                       type: 'standard__objectPage',
                                       attributes: {
                                           "objectApiName": "Call_Report__c",
                                           "actionName": "new"
                                       }
                                   };
                           navService.navigate(pageReference);
                     } else {
                           component.set('v.showSpinner', 'false');
                           helper.showError(event, saveResult.error[0].message);
                     }
                }));
                } else {
                    component.find('reportRDNEW').saveRecord(function(saveResult) {
                    if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {
                        let navService = component.find("navService");
                        let pageReference = {
                                    type: 'standard__objectPage',
                                    attributes: {
                                        "objectApiName": "Call_Report__c",
                                        "actionName": "new"
                                    }
                                };
                        navService.navigate(pageReference);
                    } else {
                          component.set('v.showSpinner', 'false');
                          helper.showError(event, saveResult.error[0].message);
                    }
               });
                }
            }
    },

    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

    onStartDateChange : function(component, event, helper) {
        helper.setEndDate(component, event, helper);
    }
})