/**
 * Created by Emmanuel Mulea Nocks on 2020/06/10.
 */

({    showMyToast : function(cmp,message, type) {
        cmp.find('notifLib').showToast({
            "variant":type,
            "message": message
        });
    },
    handleError:function(cmp,errors,type){
        if(errors){

            if(errors[0]&&errors[0].message){
                this.showMyToast(cmp,errors[0].message ,type);
            }
        }
        else {
            this.showMyToast(cmp,'Unknown error has occurred, please contact system administrator' ,type);
        }
    },
    collapseSection : function(cmp,secId,index) {

        if(index) {
            let x = document.getElementById(secId);
            cmp.set('v.trackCollapse', index);
            let data = cmp.get('v.OboardingList');

            if (data[index].collapse < 0) {

                data[index].collapse = parseInt(index);
                cmp.set('v.OboardingList', data);
                cmp.set('v.prev_index',parseInt(index))
            } else {
                data[index].collapse = -1;
                cmp.set('v.OboardingList', data);
            }
        }
    },
    getOnboardingWithRelatedRec:function (cmp) {
        cmp.set("v.isLoading",true);
        let action = cmp.get("c.getOnboardingWithRelatedRec");
        action.setParams({accId:cmp.get("v.recordId")});

        action.setCallback(this,function (res) {

            let state = res.getState();
            cmp.set("v.isLoading",false);
            if(state==="SUCCESS"){
                let data = res.getReturnValue();
                for(let index in data){
                    data[index].collapse = -1;
                }
                if(data.length>0) {
                    cmp.set('v.isPending', data[0].onboardApp.Status__c == 'Pending');
                    cmp.set('v.OboardingList', data);
                }
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
            }
            else if(state==="ERROR"){

                let errors = res.getError();
                this.handleError(cmp,errors,'error');
            }
        });

        $A.enqueueAction(action);

    },
    getSignatoryStatus:function (cmp) {
        cmp.set("v.isLoading",true);
        let action = cmp.get("c.getSignatoryStatus");
        action.setParams({clientId:cmp.get("v.recordId")});

        action.setCallback(this,function (res) {

            let state = res.getState();
            cmp.set("v.isLoading",false);
            if(state==="SUCCESS"){

                this.getOnboardingWithRelatedRec(cmp);
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
            }
            else if(state==="ERROR"){

                let errors = res.getError();
                this.handleError(cmp,errors,'error');
            }
        });

        $A.enqueueAction(action);
    },
    dropDownMenu:function (cmp,action) {
        let dropdown = cmp.find('sb-drop-down-35');
        $A.util.toggleClass(dropdown, 'slds-is-'+action);
    }
});