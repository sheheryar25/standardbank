/**
 * Created by tsobota on 16.07.2018.
 */
({
    doInit : function (component, helper) {
        component.set('v.actionItem',{
                            isRoleValidation : {
                                name :'roleValidation',
                                value : ''
                                },
                            isCCValidation : {
                                name : 'CC_Validation',
                                value : ''
                                }
                            });
    },

    getCoreRoles : function(component){
        let action = component.get('c.getCoreRoles');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.CSTCoreRoles', response.getReturnValue());
                this.getTpsCoreRoles(component);
            } else if (state === 'ERROR') {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    getTpsCoreRoles : function (component) {
        let action = component.get('c.getTpsCoreRoles');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state == 'SUCCESS') {
                 component.set('v.CSTCoreRoles',component.get('v.CSTCoreRoles').concat(response.getReturnValue()));
                 component.set('v.tpsCoreRoles', response.getReturnValue());
            } else if (state == 'ERROR') {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    getAccount : function(component) {
        let action = component.get('c.getAccount');
        action.setParams({'recordId' : component.get('v.recordId')});
        action.setCallback(this, function(response) {
           let status = response.getState();
           if (status === 'SUCCESS') {
               component.set('v.account', response.getReturnValue());
           } else if (status === 'ERROR') {
               console.error(response.getError());
           }
        });
        $A.enqueueAction(action);
    },

    handleClientRoleChange : function (component, event, helper){
        var records = component.get('v.records');
        let object = helper.getObjectById(records, event.getParam('id'));
        if (object)
        {
            if (event.getParam('fieldValue').startsWith('CommB')){
                component.find('notifLib').showNotice({
                        "variant": "info",
                        "mode": "pester",
                        "message":  $A.get("$Label.c.CDC_Message_CannotSelectCommB"),
                        closeCallback : function(){
                            object.newClientTeam.Client_Role__c = null;
                            component.set('v.records',records);
                        }
                });
            } else {
                let theSameCoreRole = false;
                let sameRoleTeamMember;
                records.forEach(function (element) {
                    if (component.get('v.CSTCoreRoles').includes(event.getParam('fieldValue')) && object.newClientTeam.Client_Role__c == element.newClientTeam.Client_Role__c && object.newClientTeam.Client_Role__c && object.newClientTeam.Id != element.newClientTeam.Id && !element.toDelete) {
                        theSameCoreRole = true;
                        sameRoleTeamMember = element.newClientTeam.Team_Member__r.Name;
                        object.newClientTeam.Client_Role__c = null;
                    }
                });
                if (theSameCoreRole){
                    var utils = component.find('utils');
                    component.set('v.records', records);
                    component.find('notifLib').showNotice({
                              "variant": "info",
                              "mode": "pester",
                              "message": utils.stringFormat($A.get("$Label.c.CDC_Message_CoreRoleAllocated"), [sameRoleTeamMember])
                    });
                } else {
                    object.newClientTeam.Core__c = !component.get('v.tpsCoreRoles').includes(event.getParam('fieldValue'))&&(component.get('v.CSTCoreRoles').includes(event.getParam('fieldValue')) || object.newClientTeam.Client_Coordinator__c);
                    let recordField = component.find('coreField');
                    if (!Array.isArray(recordField)) {
                        recordField = [recordField];
                    }
                    recordField.forEach(function(element, index, array) {
                        if(element.get('v.record').Id == event.getParam("id")){
                            let attributes = element.get('v.attributes');
                            if(attributes){
                                attributes.controllingField = 'Client_Role__c';
                            }
                        }
                    });
                    component.set('v.records', records);
                }
            }
        }

    },

    handleCCChange : function (component, event, helper) {
        let records = component.get('v.records');
        let object = helper.getObjectByChange(records, component.get("v.CC_CCBM_PreviousValues"));
        let executeNext = true;
        let updateRecords = false;

        if(object) {
            if(!component.get('v.notRestrictedDivisions').includes(object.newClientTeam.User_Division__c) && object.newClientTeam.User_Division__c !== null && object.newClientTeam.Client_Coordinator__c !== false) {
                   component.find('notifLib').showNotice({
                              "variant": "info",
                              "mode": "pester",
                              "message": $A.get("$Label.c.CDC_Message_CCActiveDivisions")
                   });
                  updateRecords = true;
                  executeNext = false;
            }

            if(executeNext) {
                records.forEach(function(element, index){
                    if (element.newClientTeam.Id == object.newClientTeam.Id && element.newClientTeam.Client_Coordinator__c && element.toDelete && executeNext) {
                        component.find('notifLib').showNotice({
                                                    "variant": "info",
                                                    "mode": "pester",
                                                    "message":  $A.get("$Label.c.CDC_Message_CantMakeDeletedCC")
                        });
                        executeNext = false;
                        updateRecords = true;
                    }
                    if(element.newClientTeam.Client_Coordinator__c == true && element.newClientTeam.Id != object.newClientTeam.Id && executeNext){
                        element.newClientTeam.Client_Coordinator__c = false;
                        updateRecords = true;
                    }
                });

                if(object.newClientTeam.Client_Coordinator_BM__c == true && object.newClientTeam.Client_Coordinator__c == true && executeNext){
                    object.newClientTeam.Client_Coordinator_BM__c = false;
                    updateRecords = true;
                }

                let coreState = object.newClientTeam.Core__c;
                object.newClientTeam.Core__c = component.get('v.CSTCoreRoles').includes(object.newClientTeam.Client_Role__c) || object.newClientTeam.Client_Coordinator__c;
                if (executeNext)
                {
                    let recordField = component.find('coreField');
                    if (!Array.isArray(recordField)) {
                        recordField = [recordField];
                    }
                    let elementsRecalculated = 2;
                    let coreState;
                    recordField.forEach(function(element, index, array) {
                        if(elementsRecalculated) {
                            let objectToRecalculate = helper.getObjectById(records, element.get('v.record').Id);
                            coreState = objectToRecalculate.newClientTeam.Core__c;
                            objectToRecalculate.newClientTeam.Core__c = component.get('v.CSTCoreRoles').includes(objectToRecalculate.newClientTeam.Client_Role__c) || objectToRecalculate.newClientTeam.Client_Coordinator__c;
                            if(coreState != objectToRecalculate.newClientTeam.Core__c) {
                                let attributes = element.get('v.attributes');
                                if(attributes){
                                    attributes.controllingField = 'Client_Role__c';
                                }
                                elementsRecalculated--;
                            }
                            updateRecords = true;
                        }
                    });
                }

            }
            if (!executeNext) {
                helper.revertCC_CCBM_Changes(component);
            } else {
                helper.updateCC_CCBM_PreviousValues(component);
            }
            if(updateRecords) {
                component.set('v.records', records);
            }
        }
    },

    revertCC_CCBM_Changes : function (component) {
        let CC_CCBM_PreviousValues = component.get('v.CC_CCBM_PreviousValues');
        component.get('v.records').forEach(function(element, index) {
            element.newClientTeam.Client_Coordinator__c = CC_CCBM_PreviousValues['CC'][index];
            element.newClientTeam.Client_Coordinator_BM__c = CC_CCBM_PreviousValues['CCBM'][index];
        });
    },

    updateCC_CCBM_PreviousValues : function (component) {
        let CC_CCBM_PreviousValues = component.get('v.CC_CCBM_PreviousValues');
        component.get('v.records').forEach(function(element, index){
            CC_CCBM_PreviousValues['CC'][index] = element.newClientTeam.Client_Coordinator__c;
            CC_CCBM_PreviousValues['CCBM'][index] = element.newClientTeam.Client_Coordinator_BM__c;
        });
        component.set('v.CC_CCBM_PreviousValues', CC_CCBM_PreviousValues);
    },

    handleCCBMChange : function (component, event, helper) {
        let records = component.get('v.records');
        let updateRecords = false;
        let executeNext = true;
        let object = helper.getObjectByChange(records, component.get("v.CC_CCBM_PreviousValues"));
        if(object) {
           if(!component.get('v.notRestrictedDivisions').includes(object.newClientTeam.User_Division__c) && object.newClientTeam.User_Division__c !== null && object.newClientTeam.Client_Coordinator_BM__c !== false) {
                   component.find('notifLib').showNotice({
                              "variant": "info",
                              "mode": "pester",
                              "message":  $A.get("$Label.c.CDC_Message_CCBMActiveDivisions")
                   });
                  updateRecords = true;
                  executeNext = false;
            }
            if (executeNext) {
                records.forEach(function(element, index){
                    if(element.newClientTeam.Client_Coordinator_BM__c == true && element.newClientTeam.Id != object.newClientTeam.Id){
                        element.newClientTeam.Client_Coordinator_BM__c = false;
                        updateRecords = true;
                    }
                });
                if(object.newClientTeam.Client_Coordinator_BM__c == true && object.newClientTeam.Client_Coordinator__c == true){
                    object.newClientTeam.Client_Coordinator__c = false;
                }

                let recordField = component.find('coreField');
                if (!Array.isArray(recordField)) {
                    recordField = [recordField];
                }
                let elementsRecalculated = 2;
                let coreState;
                recordField.forEach(function(element, index, array) {
                    if(elementsRecalculated) {
                        let objectToRecalculate = helper.getObjectById(records, element.get('v.record').Id);
                        coreState = objectToRecalculate.newClientTeam.Core__c;
                        objectToRecalculate.newClientTeam.Core__c = component.get('v.CSTCoreRoles').includes(objectToRecalculate.newClientTeam.Client_Role__c) || objectToRecalculate.newClientTeam.Client_Coordinator__c;
                        if(coreState != objectToRecalculate.newClientTeam.Core__c) {
                            let attributes = element.get('v.attributes');
                            if(attributes){
                                attributes.controllingField = 'Client_Role__c';
                            }
                            elementsRecalculated--;
                        }
                        updateRecords = true;
                    }
                });

            }
            if(!executeNext){
                helper.revertCC_CCBM_Changes(component);
            } else {
                helper.updateCC_CCBM_PreviousValues(component);
            }
            if(updateRecords) {
                component.set('v.records', records);
            }
        }
    },

    handleTeamMemberChange : function (component, event, helper) {
        var records = component.get('v.records');
        let object = helper.getObjectById(records, event.getParam('id'));
        let acceptableUsers = component.get('v.acceptableUsers');
        let userIsInClientTeam = false;
        records.forEach(function (element) {
            if (element.newClientTeam.Team_Member__c == object.newClientTeam.Team_Member__c && object.newClientTeam.Team_Member__c && object != element ) {
                userIsInClientTeam = true;
            }
        });
        if(userIsInClientTeam) {
            let indexOfObject = object.newClientTeam.Id.replace(/Custom_Client_Team__c/g, '')-1;
            component.find('notifLib').showNotice({
                          "variant": "info",
                          "mode": "pester",
                          "message": $A.get("$Label.c.CDC_Message_UserAlreadyPresent"),
                          closeCallback : function(){
                              records.splice(indexOfObject, 1);
                              records[indexOfObject] = helper.createNewMember(indexOfObject+1);
                              component.set('v.records', records)
                          }
            });
        } else {
            if(!acceptableUsers[object.newClientTeam.Team_Member__c] && object.newClientTeam.Team_Member__c) {
                helper.checkIsUserActive(component, helper, object);
            } else {
                helper.validateUserAndDivision(component, helper, object);
            }
        }
    },

    validateUserAndDivision : function (component, helper, object) {
        helper.getUserDivisionAndCountry(component, helper, object);
        if (component.get('v.acceptableUsers')[object.newClientTeam.Team_Member__c]) {
            //helper.getUserDivisionAndCountry(component, helper, object);
            //DO nothing now.
        } else if(object.newClientTeam.Team_Member__c){
            let records = component.get('v.records');
            let indexOfObject = object.newClientTeam.Id.replace(/Custom_Client_Team__c/g, '')-1;

           component.find('notifLib').showNotice({
                      "variant": "info",
                      "mode": "pester",
                      "message":  $A.get("$Label.c.CDC_Message_ActiveDivisionsClientTeam"),
                      closeCallback : function() {
                          records.splice(indexOfObject, 1);
                          records[indexOfObject] = helper.createNewMember(indexOfObject+1);
                          component.set('v.records', records);
                      }
           });

        } else {
            object.newClientTeam.User_Division__c = null;
            object.newClientTeam.User_Country__c = null;
            component.set('v.records', component.get('v.records'));
        }
    },

    createNewMember : function(recordsNewSize) {
        let newMember = {};
        newMember.newClientTeam = {};
        newMember.oldClientTeam = {};
        newMember.oldClientTeam.sobjectType = 'Custom_Client_Team__c';
        newMember.newClientTeam.sobjectType = 'Custom_Client_Team__c';
        newMember.newClientTeam.Id = 'Custom_Client_Team__c' + recordsNewSize;
        newMember.newClientTeam.Client_Coordinator__c = false;
        newMember.isNew = true;
        return newMember;
    },

    getUserDivisionAndCountry : function (component, helper, object) {
        let records = component.get('v.records')
        let action = component.get('c.getUserDivisionAndCountry');
        action.setParams({'userId' : object.newClientTeam.Team_Member__c});
        action.setCallback(this, function(response) {
           let state = response.getState();
           if (state === 'SUCCESS') {
                let values = response.getReturnValue();
                object.newClientTeam.User_Country__c = values.User_Country__c;
                object.newClientTeam.User_Division__c = values.User_Division__c;
                object.newClientTeam.Team_Member__r = {};
                object.newClientTeam.Team_Member__r.Name = values.Name;
                object.newClientTeam.Team_Member__r.sobjectType = 'User';
                component.set('v.records', records);
           } else if (state === 'ERROR') {
               console.error(response.getError());
           }
        });
        $A.enqueueAction(action);
    },

    getObjectById : function (records, id) {
        let objectToReturn = {};
        records.forEach(function(element, index, array) {
            if (element.newClientTeam.Id == id) {
                objectToReturn = element;
            }
        });
        return objectToReturn;
    },

    getObjectByChange : function (records, CC_CCBM_PreviousValues) {
        let objectToReturn = {};
        records.forEach(function(element, index, array) {
            if (element.newClientTeam.Client_Coordinator__c != CC_CCBM_PreviousValues['CC'][index] || element.newClientTeam.Client_Coordinator_BM__c != CC_CCBM_PreviousValues['CCBM'][index]) {
                objectToReturn = element;
            }
        });
        return objectToReturn;
    },

    checkIsUserActive : function(component, helper, object) {
        let action = component.get('c.isUserActive');
        action.setParams({"userId" : object.newClientTeam.Team_Member__c});
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let result = response.getReturnValue();
                let acceptableUsers = component.get('v.acceptableUsers');
                acceptableUsers[object.newClientTeam.Team_Member__c] = result;
                component.set('v.acceptableUsers', acceptableUsers);
                helper.validateUserAndDivision(component, helper, object);
            } else if ( state === 'ERROR') {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    isCCToDelete : function (component,helper) {
        let actionItem = component.get('v.actionItem');
        let CST_CoreRoles = component.get('v.CSTCoreRoles');
        let records = component.get('v.records');
        let mTeamMember2TeamRole = {};
        let returnValue;

        records.forEach(function(element,index){
            if (element.newClientTeam.Client_Coordinator__c) {
                if (element.toDelete) {
                    element.toDelete = false;
                    component.set('v.records', records);
                    returnValue = actionItem.isCCValidation;
                }
            }
            if (CST_CoreRoles.includes(element.newClientTeam.Client_Role__c) && mTeamMember2TeamRole[element.newClientTeam.Client_Role__c] == null && element.newClientTeam.Team_Member__c && !element.toDelete) {
                mTeamMember2TeamRole[element.newClientTeam.Client_Role__c] = {};
                mTeamMember2TeamRole[element.newClientTeam.Client_Role__c].ClientTeamMemberChanges = element;
                mTeamMember2TeamRole[element.newClientTeam.Client_Role__c].id = element.newClientTeam.Team_Member__c;
            }
            else if (element.newClientTeam.Client_Role__c && CST_CoreRoles.includes(element.newClientTeam.Client_Role__c) && !element.toDelete) {
                mTeamMember2TeamRole[element.newClientTeam.Client_Role__c].ClientTeamMemberChanges.toDelete = true;
                component.set('v.records', records);
                actionItem.isRoleValidation.value = element.newClientTeam.Team_Member__r.Name;
                returnValue = actionItem.isRoleValidation;
            }
        });
        return returnValue;
    },

    getNotRestrictedDivisions : function (component) {
        let action = component.get('c.getNotRestrictedDivisions');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.notRestrictedDivisions',response.getReturnValue());
            } else if ( state === 'ERROR') {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    checkIfUserIsCcOrCcbm: function(component){
        let clientId = component.get('v.recordId');
        let action = component.get('c.isCurrentUserCcOrCcbm');
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