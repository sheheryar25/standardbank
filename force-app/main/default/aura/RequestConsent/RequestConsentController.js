/**
 - Created by Nocks Mulea Emmanuel on 2020/06/10.
 */

({
    doInit:function(cmp,event,helper){

        helper.getData(cmp);
    },
    cancel: function(cmp,event,helper){
        helper.cancel();
    },
    addNewContact: function(cmp){

        let createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact",
            "defaultFieldValues": {
                'AccountId':cmp.get('v.recordId')
            },
            "navigationLocation": 'LOOKUP'
        });
        createRecordEvent.fire();

    },
    handleAfterContactCreatedToastEvent:function(cmp,event,helper){
        let toastMessageParams = event.getParams();
        let message = toastMessageParams.message;

        if(message!=undefined) {
            if (message.includes('Contact') && message.includes('was created')) {
                helper.getData(cmp);
            }
        }

    },
    onCheckboxes : function(cmp, event) {
        let recIndex = parseInt(event.getSource().get("v.text"));
        let data =     cmp.get("v.contacts");
        let index = cmp.get("v.checkedContacts").indexOf(data[recIndex].Id);
        if (event.getSource().get("v.value")) {
            // Checkbox is checked - add id to checkedContacts
            if (index < 0) {
                cmp.get("v.checkedContacts").push(data[recIndex].Id);
                data.checked = true;
            }
        } else {
            // Checkbox is unchecked - remove id from checkedContacts
            if (index > -1) {
                cmp.get("v.checkedContacts").splice(index, 1);
                data.checked = false;
            }
        }
        cmp.set("v.enabledRequest",(cmp.get("v.checkedContacts").length>0));


    },
    onRadioButton : function(cmp, event) {


        let recIndex = parseInt(event.getSource().get("v.text"));

        let selectedContact = cmp.get('v.selectedContact');

        let data =     cmp.get("v.contacts");
        for(let x in selectedContact){

            if(data[recIndex].Id == selectedContact[x].Id){
                selectedContact[x].initiatingDirector = event.getSource().get("v.value");
            }
            else {
                selectedContact[x].initiatingDirector = false;
            }
        }
        cmp.set('v.selectedContact',selectedContact);
    },
    requestConsent:function (cmp,event,helper) {
        helper.goPreview(cmp,false);
    },
    re_requestConsent:function (cmp,event,helper) {

        helper.goPreview(cmp,true);
    },
    goBack:function (cmp) {
        cmp.set('v.isPreview',false);
    },
    confirm:function (cmp,event,helper) {

        if(!helper.isInitiatingDirectorSelected(cmp)){
            helper.showMyToast(cmp,'Please choose an Initiating Director.','error');
            return;
        }
        cmp.set('v.enabledConfrom',false);
        helper.createRequestConsent(cmp,false);
    },
    confirmResend:function (cmp,event,helper) {
            cmp.set('v.enabledConfrom',false);
            helper.createRequestConsent(cmp,true);
    },
    onKeydown:function (cmp,event,helper) {
        let id = event.target.value;
        let recIndex = parseInt(event.target.id);
        let data =     cmp.get("v.contacts");
        data[recIndex].id_number = id;
        if(data[recIndex].id_number.length<=9){
            helper.showHideError(cmp,data,recIndex);
            return false;
        }
       helper.luhnAlgorithm(cmp,id,data,recIndex);
    },
    onBlurCheck:function (cmp,event,helper) {
        let recIndex = parseInt(event.target.id);
        let data =     cmp.get("v.contacts");
        helper.showHideError(cmp,data,recIndex);
    }


});