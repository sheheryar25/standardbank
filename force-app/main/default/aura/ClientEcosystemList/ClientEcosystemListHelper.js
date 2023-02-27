/**
 * Created by Emmanuel Mulea Nocks on 2020/02/19.
 */

({
    getEcosystemClient:function (cmp,event) {

        let recordId  = cmp.get("v.recordId");
        let action = cmp.get("c.getEcosystemClient");
        action.setParams({accountId:recordId});
        action.setCallback(this, function (res) {

            let state = res.getState();
            if(state==='SUCCESS') {
                let ecosystem = res.getReturnValue();
                cmp.set('v.ecosystem', ecosystem);
                cmp.set('v.isWaiting', false);
            }
            else if(state==='ERROR'){
                let errors = res.getError();
                if (errors) {

                    if (errors[0] && errors[0].message) {
                        cmp.set('v.iserror',true);
                        cmp.set("v.isWaiting", false);
                        cmp.set('v.errorMsg',errors[0].message);
                    }
                }
                else {
                    cmp.set('v.iserror',true);
                    cmp.set("v.isWaiting", false);
                    cmp.set('v.errorMsg','Unknown error');
                }
            }
        });

        $A.enqueueAction(action);

    }
    ,
    getClientData:function (cmp,event) {

        let recordId  = cmp.get("v.recordId");
        let newEcosystem = cmp.get("v.newEcosystem");
        let action = cmp.get("c.getClientData");
        cmp.set('v.showModal', true);
        action.setParams({recordId:recordId});
        action.setCallback(this, function (res) {
            let state = res.getState();
            if(state==='SUCCESS') {
                let clients = res.getReturnValue();
                cmp.set('v.isRGN', clients.Relationship_Group_Number__c!=null?true:false);
                cmp.set('v.isParent', clients.parentId==null?true:false);
                newEcosystem.Client_Name__c = cmp.get('v.recordId');
                newEcosystem.Relationship_Group_Name__c = clients.Relationship_Group_Name__c;
                newEcosystem.Relationship_Group_Number__c = clients.Relationship_Group_Number__c;
                cmp.set("v.newEcosystem", newEcosystem);
                cmp.set("v.isWaiting", false);
            }
            else if(state==='ERROR'){
                let errors = res.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {

                        cmp.set('v.iserror',true);
                        cmp.set("v.isWaiting", false);
                        cmp.set('v.errorMsg',errors[0].message);
                    }
                }
                else {

                    cmp.set('v.iserror',true);
                    cmp.set("v.isWaiting", false);
                    cmp.set('v.errorMsg','Unknown error');
                }

            }
            else if (state === "INCOMPLETE") {

                cmp.set('v.iserror', true);
                cmp.set("v.isWaiting", false);
                cmp.set('v.errorMsg', 'Please check your internet connection.');
            }

        });

        $A.enqueueAction(action);

    },

});