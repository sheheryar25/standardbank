/**
 * Created by Emmanuel Mulea Nocks on 2020/02/19.
 */

({
    init:function(component,event,helper){
        let accountId = component.get("v.recordId");
        component.set("v.isWaiting", true);
        Promise.all([
            UTL.promise(component.get("c.getAccount"), {"accountId" : accountId}),
            UTL.promise(component.get("c.getCurrentUserId")),
            UTL.promise(component.get("c.isOwnerManager"), {"accountId" : accountId})
        ])
            .then(
                $A.getCallback(function(result) {
                    var account = result[0];
                    var userId = result[1];
                    var isManager = result[2];

                    var isInClientServiceTeam = false;
                    if (account.hasOwnProperty('Custom_Client_Teams__r')) {
                        isInClientServiceTeam = account.Custom_Client_Teams__r.reduce(function(acc, element) {
                            return acc || element.Team_Member__c === userId;
                        }, false);
                    }

                    if (account.OwnerId === userId || isInClientServiceTeam || isManager) {
                        helper.getEcosystemClient(component,event);
                    }
                    else {
                        component.set("v.isPermitted", false);
                        component.set("v.isWaiting", false);
                    }
                }),
                $A.getCallback(function(error) {
                    component.set("v.isPermitted", false);
                    component.set("v.isWaiting", false);
                })
            )

        component.set('v.baseUrl',getBaseURL());
        function getBaseURL() {

            let url = location.href;
            let baseURL = new URL(url).origin;
            return baseURL + "/";
        }

    },
    onNew:function (cmp,event,helper) {

        helper.getClientData(cmp,event);
    },
    onCancel : function(cmp, event, helper) {
        cmp.set('v.showModal',false);
        cmp.set('v.isRGN', false);
        cmp.set('v.isParent', false);
    },
    handleClientEcosystemEvent:function (cmp,event,helper) {

        let data = event.getParam("data");

        data = JSON.parse(data);//unwraping proxy

        switch (data.event_type) {
            case 'cancel':
                cmp.set('v.showModal',false);
                break;
            case 'reload':
                helper.getEcosystemClient(cmp,event);
                cmp.set('v.showModal',false);
                break;
            case 'cancelModal':
                cmp.set('v.showModal',false);
                cmp.set('v.isRGN', false);
                cmp.set('v.isParent', false);
                break;

        }

    },
});