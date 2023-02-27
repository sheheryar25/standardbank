/**
 * Created by tsobota on 16.07.2018.
 */
({
    doInit : function (component, helper) {
        let recordId = component.get('v.recordId');
        if (!recordId) {
            recordId = component.get('v.pageReference').state.recordId;
            component.set('v.recordId', recordId);
        }
        let getClientTeam = component.get('c.getClientTeams');
        getClientTeam.setParams({'accountId' : recordId});
        getClientTeam.setCallback(this, function(response){
            let state = response.getState();
                if (state === 'SUCCESS') {
                    let result = response.getReturnValue();
                    component.set("v.ClientTeamChanges", result);
                    console.log(result);
                    helper.cacheCC_CCBM_Values(component);
                    if (component.get('v.redirecting') === false) {
                        helper.checkArchivedOrPBBClients(component, helper);
                    }
                }
                else if (state === 'ERROR') {
                    console.error(response.getError());
                    let navigateToSObject = $A.get("e.force:navigateToSObject");
                    navigateToSObject.setParams({
                        "recordId" : component.get('v.recordId')
                    });
                    component.set('v.redirecting', true);
                    navigateToSObject.fire();
                }
        });
        $A.enqueueAction(getClientTeam);
    },

    cacheCC_CCBM_Values : function(component) {
            let records = component.get('v.ClientTeamChanges');
            let CC_CCBM_PreviousValues = component.get('v.CC_CCBM_PreviousValues');
            CC_CCBM_PreviousValues = {};
            CC_CCBM_PreviousValues['CC'] = [];
            CC_CCBM_PreviousValues['CCBM'] = [];
            records.forEach(function(element, index){
                CC_CCBM_PreviousValues['CC'][index] = element.newClientTeam.Client_Coordinator__c;
                CC_CCBM_PreviousValues['CCBM'][index] = element.newClientTeam.Client_Coordinator_BM__c;
            });
            component.set('v.CC_CCBM_PreviousValues', CC_CCBM_PreviousValues);
    },

    checkAdminCC : function (component, helper) {
        let action = component.get('c.checkIsAdminCC');
        action.setParams({
            accountId : component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.hasAdministratorUserAsCC', response.getReturnValue());
                helper.doValidations(component,helper);

            } else if (state === 'ERROR') {
                console.error(response.getError());
                let navigateToSObject = $A.get("e.force:navigateToSObject");
                navigateToSObject.setParams({
                    "recordId" : component.get('v.recordId')
                });
                component.set('v.redirecting', true);
                navigateToSObject.fire();
            }
        });
        $A.enqueueAction(action);
    },

    checkArchivedOrPBBClients : function(component, helper) {
        let action = component.get('c.checkArchivedOrPBBClients');
        action.setParams({
            accountId : component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.hasPBBOrArchivedUserAsCC',response.getReturnValue());
                helper.checkAdminCC(component,helper);


            } else if (state === 'ERROR') {
                console.error(response.getError());
                let navigateToSObject = $A.get("e.force:navigateToSObject");
                navigateToSObject.setParams({
                    "recordId" : component.get('v.recordId')
                });
                component.set('v.redirecting', true);
                navigateToSObject.fire();
            }
        });
        $A.enqueueAction(action);
    },

    doArchivedOrPBBClientsAlert : function (component, helper) {
        if (!component.get('v.redirecting')) {
            component.find('notifLib').showNotice({
                        "variant": "info",
                        "message": $A.get("$Label.c.CDC_Message_CantRaiseCDC"),
                        "mode": "pester",
                        closeCallback: function() {
                            let navigateToSObject = $A.get("e.force:navigateToSObject");
                            navigateToSObject.setParams({
                                "recordId" : component.get('v.recordId')
                            });
                            component.set('v.redirecting', true);
                            navigateToSObject.fire();
                        }
            });
        }
    },

    doAdminCCAlert : function (component, event, helper) {
        if (!component.get('v.redirecting')) {
            component.find('notifLib').showNotice({
                        "variant": "info",
                        "mode": "pester",
                        "message":  $A.get("$Label.c.CDC_Message_CCMustBeAdministrator")
            });
        }
    },

    doValidations : function (component, helper) {
        if(component.get('v.hasPBBOrArchivedUserAsCC')) {
            helper.doArchivedOrPBBClientsAlert(component, helper);
        }
        if(component.get('v.hasAdministratorUserAsCC')) {
            helper.doAdminCCAlert(component, event, helper);
        }
    },

    submitAndRedirect : function (component, helper) {
        component.set('v.isWaiting', true);
        let action = component.get('c.submitDataChangeRequest');
        console.log(component.get('v.ClientTeamChanges'));
        action.setParams({
            'clientTeamChangesJSON' : JSON.stringify(component.get('v.ClientTeamChanges')),
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, function(response){
             let state = response.getState();
             if (state === 'SUCCESS') {
                 let result = response.getReturnValue();
                 component.set('v.isWaiting', false);
                 if (result['CC'] || result['CST'] || result['VISIBILITY_CHANGE']) {
                     if(result['CST'] || result['VISIBILITY_CHANGE']) {
                         let displayMessage = '';
                         let utils = component.find('utils');
                         if(result['CST']){
                             displayMessage = utils.stringFormat($A.get("$Label.c.CDC_Message_RequestSubmittedWithNumber"), [result['CST']]);
                         }
                         if(result['VISIBILITY_CHANGE']){
                             if(result['VISIBILITY_CHANGE'] === 'SUCCESS'){
                                 displayMessage += displayMessage != '' ? '\n\n' + $A.get("$Label.c.CDC_Message_VisibilityChangesApplied") : $A.get("$Label.c.CDC_Message_VisibilityChangesApplied");
                             } else {
                                 displayMessage += displayMessage != '' ? '\n\n' + result['VISIBILITY_CHANGE'] : result['VISIBILITY_CHANGE'];
                             }
                         }
                         component.find('notifLib').showNotice({
                                      "variant": "info",
                                      "message": displayMessage,
                                      "mode": "pester",
                                      closeCallback : function(){
                                          let navigateToSObject = $A.get("e.force:navigateToSObject");
                                          navigateToSObject.setParams({
                                              "recordId" : component.get('v.recordId')
                                          });
                                          component.set('v.redirecting', true);
                                          navigateToSObject.fire();
                                      }
                         });
                     } else {
                         component.find('notifLib').showNotice({
                                       "variant": "info",
                                       "message": $A.get("$Label.c.CDC_Message_RequestSubmitted"),
                                       "mode": "pester",
                                        closeCallback : function(){
                                            let navigateToSObject = $A.get("e.force:navigateToSObject");
                                            navigateToSObject.setParams({
                                                "recordId" : component.get('v.recordId')
                                            });
                                            component.set('v.redirecting', true);
                                            navigateToSObject.fire();
                                         }
                         });
                     }
                 } else {
                     component.find('notifLib').showNotice({
                                 "variant": "info",
                                 "message": $A.get("$Label.c.CDC_Message_ChangesNotRequested"),
                                 "mode": "pester"
                     });
                 }
             }
             else if (state === 'ERROR') {
                 console.error(response.getError());
                 let navigateToSObject = $A.get("e.force:navigateToSObject");
                 navigateToSObject.setParams({
                     "recordId" : component.get('v.recordId')
                 });
                 component.set('v.redirecting', true);
                 navigateToSObject.fire();
             }
        });
        $A.enqueueAction(action);
    },

    isUserCib : function (component) {
        let returnValue ;
        let action = component.get('c.isUserCib');
        action.setCallback(this,function(response){
            let state = response.getState();
            if (state == 'SUCCESS') {
                component.set('v.isCibUser', response.getReturnValue());
                if (!response.getReturnValue()) {
                    component.find('notifLib').showNotice({
                                  "variant": "info",
                                  "mode": "pester",
                                  "message":  $A.get("$Label.c.CDC_Message_OnlyCIBUsers"),
                                  closeCallback : function(){
                                        let navigateToSObject = $A.get("e.force:navigateToSObject");
                                        navigateToSObject.setParams({
                                            "recordId" : component.get('v.recordId')
                                        });
                                        navigateToSObject.fire();
                                  }
                    });
                }
            } else if (state == 'ERROR') {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);

        return returnValue;
    },

    isUserCcOrCcbm: function(component){
        let clientId = component.get('v.recordId');
        let action = component.get('c.isUserCcOrCcbm');
        action.setParams({
            'clientId': component.get('v.recordId')
        });
        action.setCallback(this, function(response){
            if(response.getState() === 'SUCCESS'){
               component.set('v.isCcOrCcbm', response.getReturnValue());
            } else if(response.getState() === 'ERROR'){
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})