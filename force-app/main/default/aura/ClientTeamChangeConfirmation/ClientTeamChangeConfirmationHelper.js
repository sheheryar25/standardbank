/**
 * Created by tsobota on 22.08.2018.
 */
({
    findChanges : function(component, helper) {
        let ClientTeamChanges = component.get('v.ClientTeamChanges');
        let changes = [];
        let isCcChanges = false;
        let isCcbmChanges = false;
        let visibilityToClientChanges = [];

        ClientTeamChanges.forEach(function(element, index){
            element.isCCChange = false;
            element.isCCBMChange = false;
            /*
            === CC Change ==
            */
            let tmp = element.isNew ? element.newClientTeam.Client_Coordinator__c : true;
            if(element.oldClientTeam.Client_Coordinator__c != element.newClientTeam.Client_Coordinator__c && tmp ) {
                element.isCCChange = true;
                let ccChanges = component.get('v.ccChanges');
                isCcChanges = true;
                if(!ccChanges) {
                    ccChanges = {};
                    ccChanges.oldCcName = '';
                }

                if(element.newClientTeam.Client_Coordinator__c) {
                    ccChanges.newCcName = element.newClientTeam.Team_Member__r.Name;
                    ccChanges.newCcRole = element.newClientTeam.Client_Role__c;
                } else {
                    if(element.isNew) {
                        ccChanges.oldCcName = element.newClientTeam.Team_Member__r.Name;

                    } else {
                        ccChanges.oldCcName = element.oldClientTeam.Team_Member__r.Name;
                    }
                }
                component.set('v.ccChanges', ccChanges);

            } else if (element.oldClientTeam.Client_Coordinator__c){
                element.isCCChange = false;
            }

            /*
            === CC Change END ==
            */

            /*
            === CCBM Change ==
            */
            tmp = element.isNew ? element.newClientTeam.Client_Coordinator_BM__c : true;
            if (element.oldClientTeam.Client_Coordinator_BM__c) {

                component.set('v.currentCcbm', element);
            }
            if (element.oldClientTeam.Client_Coordinator_BM__c != element.newClientTeam.Client_Coordinator_BM__c && tmp && !element.toDelete) {
                element.isCCBMChange = true;
                isCcbmChanges = true;

                let ccbmChanges = component.get('v.ccbmChanges');
                if(!ccbmChanges) {
                    ccbmChanges = {
                        'newCcbmName' : '',
                        'newCcbmRole' : '',
                        'oldCcbmName' : ''
                    };
                }
                if(element.newClientTeam.Client_Coordinator_BM__c) {
                    ccbmChanges.newCcbmName = element.newClientTeam.Team_Member__r.Name;
                    ccbmChanges.newCcbmRole = element.newClientTeam.Client_Role__c;
                } else {
                    if(element.isNew) {
                        ccbmChanges.oldCcbmName = element.newClientTeam.Team_Member__r.Name;

                    } else {
                        ccbmChanges.oldCcbmName = element.oldClientTeam.Team_Member__r.Name;
                    }
                }
                component.set('v.ccbmChanges', ccbmChanges);

            } else if(element.oldClientTeam.Client_Coordinator_BM__c){
                element.isCCBMChange = false;
            }

            /*
            === CCBM Change END ==
            */
            if (element.isNew && !element.isCCChange && !element.isCCBMChange) {
                changes[changes.length] = {
                    id : changes.length,
                    teamMemberName : element.newClientTeam.Team_Member__r.Name,
                    teamMemberRole : element.newClientTeam.Client_Role__c,
                    actionName : 'Add Member'
                };
            }
            if (!element.isNew && element.toDelete && !element.isCCChange && !element.isCCBMChange) {
                changes[changes.length] = {
                    id : changes.length,
                    teamMemberName : element.newClientTeam.Team_Member__r.Name,
                    teamMemberRole : element.newClientTeam.Client_Role__c,
                    actionName : 'Remove Member'
                };
            }
            let ccChangeNewCc = element.isCCChange ? !element.newClientTeam.Client_Coordinator__c : true;
            let ccbmChangeNew = element.isCCBMChange ? !element.newClientTeam.Client_Coordinator_BM__c : true;
            if (element.oldClientTeam.Client_Role__c != element.newClientTeam.Client_Role__c && ccChangeNewCc && ccbmChangeNew && !element.isNew && !element.toDelete) {
                changes[changes.length] = {
                    id : changes.length,
                    teamMemberName : element.newClientTeam.Team_Member__r.Name,
                    teamMemberRole : element.newClientTeam.Client_Role__c,
                    actionName : 'Change role'
                };
            }
            if (element.newClientTeam.Visible_to_Client__c != element.oldClientTeam.Visible_to_Client__c) {
                changes[changes.length] = {
                    id : changes.length,
                    teamMemberName : element.newClientTeam.Team_Member__r.Name,
                    teamMemberRole : element.newClientTeam.Client_Role__c,
                    actionName : element.newClientTeam.Visible_to_Client__c === true ? $A.get("$Label.c.CDC_Message_AddVisibility") : $A.get("$Label.c.CDC_Message_RemoveVisibility")
                };
            }
        });
        let ccbmChanges = component.get('v.ccbmChanges');
        if(ccbmChanges){
            if (ccbmChanges.newCcbmName==''){
                component.set('v.isCcbmDeletion', true);
            } else {
                component.set('v.isCcbmDeletion', false);
            }
        }
        let ccChanges = component.get('v.ccChanges');
        if(!!ccChanges) {
            if(!ccChanges.oldCcName) {
                let action = component.get('c.getCurrentCcName');
                action.setParams({'accountId' : component.get('v.recordId')});
                action.setCallback(this, function(response) {
                    let status = response.getState();
                    if (status == 'SUCCESS') {

                    ccChanges.oldCcName = response.getReturnValue();
                    component.set('v.ccChanges',ccChanges);
                    } else if (status == 'ERROR') {
                   console.error(response.getError());
                    }
                });
                $A.enqueueAction(action);
            }
        }
        component.set('v.data', changes);
    },

    setColumns : function (component) {
        component.set('v.columns',[
            {label : 'Team Memeber Name', fieldName : 'teamMemberName', type : 'text'},
            {label : 'Team Memeber Role', fieldName : 'teamMemberRole', type : 'text'},
            {label : 'Action', fieldName : 'actionName', type : 'text'}
        ]);
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
    }
})