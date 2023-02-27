/**
 * Created by tsobota on 16.07.2018.
 */
({
    doInit : function(component, event, helper) {
        helper.doInit(component, helper);
        helper.getAccount(component);
        helper.getCoreRoles(component);
        helper.getNotRestrictedDivisions(component);
        helper.checkIfUserIsCcOrCcbm(component);
    },

    addNewMember : function(component, event, helper) {
        window.scrollTo(0,window.innerHeight);

        let recordsNewSize = component.get('v.records').length + 1;

        let newMember = helper.createNewMember(recordsNewSize);
        let records = component.get('v.records');
        records.push(newMember);
        component.set('v.records', records);

        let CC_CCBM_PreviousValues = component.get('v.CC_CCBM_PreviousValues');
        CC_CCBM_PreviousValues['CC'][recordsNewSize-1] = false;
        CC_CCBM_PreviousValues['CCBM'][recordsNewSize-1] = false;
        component.set('v.CC_CCBM_PreviousValues', CC_CCBM_PreviousValues);
    },

    handleRecordsChange: function(component, event, helper) {
        let fieldName = event.getParam("fieldName");
        if (fieldName === 'Client_Role__c') {
            helper.handleClientRoleChange(component, event, helper);
        } else if (fieldName === 'Team_Member__c') {
            helper.handleTeamMemberChange(component, event, helper);
        }
    },

    onCC_CheckboxChange: function(component, event, helper) {
        helper.handleCCChange(component, event, helper);
    },

    onCCBM_CheckboxChange: function(component, event, helper){
        helper.handleCCBMChange(component, event, helper);
    },

    deleteNewTeamMember : function (component, event, helper) {
        let elementIndex = event.getSource().get('v.value');
        let records = component.get('v.records');
        records.splice(elementIndex, 1);
        component.set('v.records', records);

        let CC_CCBM_PreviousValues = component.get('v.CC_CCBM_PreviousValues');
        CC_CCBM_PreviousValues['CC'].splice(elementIndex,1);
        CC_CCBM_PreviousValues['CCBM'].splice(elementIndex,1);
        component.set('v.CC_CCBM_PreviousValues', CC_CCBM_PreviousValues);
    },

    onDeleteCheckboxChange : function (component, event,helper) {
        let actionItem = component.get('v.actionItem');
        let result = helper.isCCToDelete(component, helper)

        if (result == actionItem.isCCValidation) {
            component.find('notifLib').showNotice({
                        "variant": "info",
                        "mode": "pester",
                        "message": $A.get("$Label.c.CDC_Message_CantDeleteCC"),
            });
        } else if(result == actionItem.isRoleValidation) {
            var utils = component.find('utils');
            component.find('notifLib').showNotice({
                        "variant": "info",
                        "mode": "pester",
                        "message": utils.stringFormat($A.get("$Label.c.CDC_Message_CantUndelete"), [result.value])
            });
        }
    }
})