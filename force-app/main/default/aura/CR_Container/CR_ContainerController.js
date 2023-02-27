/**
 * Created by tsobota on 16.07.2018.
 */
({
    doInit : function (component, event, helper) {
        helper.doInit(component, helper);
        helper.isUserCib(component);
        helper.isUserCcOrCcbm(component);
    },

    submit : function (component, event, helper) {
        let objectCount = 0;
        let ccWithDelete = false;
        let records = component.get('v.ClientTeamChanges');
        let changes = false;
        records.forEach(function(element, index){
            if(!element.newClientTeam.Team_Member__c || !element.newClientTeam.Client_Role__c) {
                objectCount++;
            }

            if (element.newClientTeam.Client_Coordinator__c && element.toDelete) {
                ccWithDelete = true;
            }
            if(element.isNew && component.get('v.showSummary')) {
                delete element.newClientTeam.Team_Member__r.sobjectType;
            }
            if(element.newClientTeam.Client_Coordinator__c != element.oldClientTeam.Client_Coordinator__c
             || element.newClientTeam.Client_Coordinator_BM__c != element.oldClientTeam.Client_Coordinator_BM__c
             || element.newClientTeam.Client_Role__c != element.oldClientTeam.Client_Role__c
             || element.newClientTeam.Visible_to_Client__c != element.oldClientTeam.Visible_to_Client__c
             || element.toDelete){
                changes = true;
            }
        });
        console.log(records);
        component.set('v.ClientTeamChanges', records);

        if (objectCount) {
            component.find('notifLib').showNotice({
                "variant": "info",
                "message": $A.get("$Label.c.CDC_Message_ProvideDetailsOrRole"),
                "mode": "pester"
            });
        } else if (ccWithDelete) {
            component.find('notifLib').showNotice({
                "variant": "info",
                "message": $A.get("$Label.c.CDC_Message_CCRequired"),
                "mode": "pester"
            });
        }


        if (component.get('v.showSummary')) {

            helper.submitAndRedirect(component, helper);


        } else if (!objectCount && !ccWithDelete) {
            let canShowSummary = false;
            component.get('v.ClientTeamChanges').forEach(function (element){
                if(element.newClientTeam.Client_Coordinator__c && !element.toDelete) {
                    canShowSummary = true;
                }
            });
            if(changes){
                if (canShowSummary) {
                    component.set('v.showSummary', true);
                } else {
                    component.find('notifLib').showNotice({
                                "variant": "info",
                                "message": $A.get("$Label.c.CDC_Message_CCNotFlagged"),
                                "mode": "pester"
                    });
                }
            } else {
                let utils = component.find('utils');
                component.find('notifLib').showNotice({
                            "variant": "info",
                            "message": $A.get("$Label.c.CDC_Message_ChangesNotRequested"),
                            "mode": "pester"
                });
            }
        }
    },

    cancelOrShowSummary : function (component, event, helper) {
        if(!component.get('v.showSummary')) {
            let navigateToSObject = $A.get("e.force:navigateToSObject");
            navigateToSObject.setParams({
                "recordId" : component.get('v.recordId')
            });
            navigateToSObject.fire();
        } else {
            component.set('v.isWaiting', true);
            component.set('v.showSummary', false);
            console.log(component.get('v.ClientTeamChanges'));
        }
    },

    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

    onShowSummaryChange : function(component, event, helper) {
    }
})