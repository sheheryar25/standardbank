/**
 * Created by Emmanuel Mulea Nocks on 2020/02/21.
 */

({
    onScriptLoaded: function(component, event, helper) {
        component.set("v.isScriptLoaded", true);
        var accountId = component.get("v.recordId");
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
                        helper.getEcosystemStructure(component, event)
                    }
                }),
                $A.getCallback(function(error) {
                    component.set("v.isWaiting", false);
                })
            )
    }
});