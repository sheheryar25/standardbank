/**
 - Created by Nocks Mulea Emmanuel on 2020/06/10.
 */

({
    cancel:function(){
        let dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    refreshPage:function(){
        $A.get('e.force:refreshView').fire();
    },
    showMyToast : function(cmp,message, type) {
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
    replaceRoleDelimiter:function (cmp,data) {

        for (let index in data){

            if(data[index]['Contact_Role_s_at_Client__c'])
                data[index]['Contact_Role_s_at_Client__c'] = data[index]['Contact_Role_s_at_Client__c'].replace(";","/");

            data[index]['contactRoleClient'] = data[index]['Contact_Role_s_at_Client__c'];
            data[index]['checked'] = false;
            data[index]['initiatingDirector'] = false;
            data[index]['id_number'] = '';
            data[index]['mobileNumber'] = data[index]['MobilePhone'];
            data[index]['isIdValid'] = false;
            delete data[index].Contact_Role_s_at_Client__c;
        }
        cmp.set("v.contacts",data);
        cmp.set("v.haveContact",(data.length>0));

    },
    getData:function (cmp) {
        let current = this;
        cmp.set("v.isLoading",true);
        Promise.all([
            UTL.promise(cmp.get("c.getContactsByClientIdAndRoles"), {accId:cmp.get("v.recordId"),requestType:cmp.get('v.requestType')}),
            UTL.promise(cmp.get("c.isConsentSent"),{accId:cmp.get("v.recordId"),requestType:cmp.get('v.requestType')}),
        ])
            .then(
                $A.getCallback(function(result) {
                    cmp.set("v.isLoading",false);
                    current.replaceRoleDelimiter(cmp,result[0]);
                    cmp.set('v.isConsentSent',result[1]);
                }),
                $A.getCallback(function(error) {
                    cmp.set("v.isLoading",false);
                    current.showMyToast(cmp,UTL.getErrorMessage(error),'error');
                })
            )
    },
    requestConsent:function (cmp) {

        let checkedContacts = cmp.get('v.selectedContact');
        let action = cmp.get("c.createRequestConsent");
        let selectedConList = JSON.stringify(checkedContacts);
        action.setParams({selectedContactList:selectedConList,clientId:cmp.get('v.recordId') ,requestType:cmp.get('v.requestType')});

        action.setCallback(this,function (res) {

            let state = res.getState();
            if(state==="SUCCESS"){
                let data = res.getReturnValue()
                this.requestConsentCallOut(cmp,data);
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                this.cancel();
            }
            else if(state==="ERROR"){

                let errors = res.getError();
                this.handleError(cmp,errors,'error');
                this.cancel();
            }
        });

        $A.enqueueAction(action);
    }
    ,
    requestConsentCallOut:function (cmp,selectedConList) {

        let action = cmp.get("c.requestConsentCallout");
        action.setParams({selectedContactList:selectedConList,clientId:cmp.get('v.recordId')});
        action.setCallback(this,function (res) {

            let state = res.getState();
            cmp.set("v.isLoading",false);
            if(state==="SUCCESS"){
                if(res.getReturnValue()==="SUCCESS"){

                    this.showMyToast(cmp,'Successfully Requested.','success');
                    this.cancel();
                    this.refreshPage();
                }
                else{
                    this.showMyToast(cmp,res.getReturnValue() ,'error');
                    this.cancel();
                }

            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                this.cancel();
            }
            else if(state==="ERROR"){
                let errors = res.getError();
                this.handleError(cmp,errors,'error');
                this.cancel();
            }
        });

        $A.enqueueAction(action);
    }
    ,
    resendConsent:function (cmp) {

        let checkedContacts = cmp.get('v.selectedContact');
        let action = cmp.get("c.resendInvite");
        action.setParams({docId:checkedContacts[0].id_number,clientId:cmp.get('v.recordId'),requestType:cmp.get('v.requestType')});

        action.setCallback(this,function (res) {

            let state = res.getState();
            cmp.set("v.isLoading",false);
            if(state==="SUCCESS"){
                this.showMyToast(cmp,'Successfully resent.','success');
                this.cancel();
                this.refreshPage();
            }
            else if(state==="INCOMPLETE"){
                this.showMyToast(cmp,'Check your internet connection and try again' ,'error');
                this.cancel();
            }
            else if(state==="ERROR"){

                let errors = res.getError();
                this.handleError(cmp,errors,'error');
                this.cancel();
            }
        });

        $A.enqueueAction(action);
    },
    createRequestConsent:function (cmp,isResend) {
        cmp.set("v.isLoading",true);
        if(isResend){
            this.resendConsent(cmp);
        }
        else {
            this.requestConsent(cmp);
        }

    }
    ,
    showHideError:function (cmp,data,recIndex) {

        let x = document.getElementById('error_'+recIndex);
        let min_error = document.getElementById('min_error_'+recIndex);


        if(data[recIndex].id_number.length >=8) {
            if ((!data[recIndex].isIdValid && data[recIndex].id_number.length == 13)) {

                x.style.display = "block";
                min_error.style.display = "none";
            } else if (data[recIndex].id_number.length == 8 || data[recIndex].id_number.length == 9) {
                min_error.style.display = "none";
                x.style.display = "none";
            }
            else if (data[recIndex].id_number.length > 9 && !data[recIndex].isIdValid ) {
                x.style.display = "block";
                min_error.style.display = "none";
            }
            else {
                x.style.display = "none";
            }
        }
        else {
            x.style.display = "none";
            min_error.style.display = "block";
        }

        cmp.set('v.contacts', data);
    },
    luhnAlgorithm:function (cmp,id,data,recIndex) {
        let i, c,
            even = '',
            sum = 0,
            check = id.slice(-1);

        if (id.length !=13 || id.match(/\D/)) {
            this.showHideError(cmp,data,recIndex);
            return false;
        }
        //Luhn Algorithm
        id = id.substr(0, id.length - 1);
        for (i = 0; c = id.charAt(i); i += 2) {
            sum += +c;
            even += id.charAt(i + 1);
        }
        even = '' + even * 2;
        for (i = 0; c = even.charAt(i); i++) {
            sum += +c;
        }
        sum = 10 - ('' + sum).charAt(1);
        let isIdValid = ('' + sum).slice(-1) == check;
        data[recIndex].isIdValid = isIdValid;

        this.showHideError(cmp,data,recIndex);
    }
    ,
    goPreview:function (cmp,isResend) {

        let Ids = cmp.get("v.checkedContacts")

        let data = cmp.get('v.contacts');
        let selectedContact = [];
        let allValid = true;
        for(let index in data){
            if(Ids.includes(data[index].Id)) {
                if (!data[index].isIdValid && data[index].id_number.length > 9) {
                    allValid = false;
                    break;
                }
                else if(data[index].id_number.length <8){
                    allValid = false;
                    break;
                }
                selectedContact.push(data[index]);
            }
        }

        if(allValid){
            if(isResend){

                if(selectedContact.length==1){
                    cmp.set('v.isPreview',true);
                    cmp.set('v.selectedContact',selectedContact);
                }
                else {
                    this.showMyToast(cmp,'Please select one contact per resend.','error');
                }
            }
            else {

                if(!this.isClientRolesMet(selectedContact)){
                    this.showMyToast(cmp,'There is no KYC Contact and Authorized Person on the selected contacts.','error');
                    return;
                }

                for(let index in selectedContact){

                    if(this.isNotValidMobileNumber(selectedContact[index].mobileNumber)){
                        this.showMyToast(cmp,'Please provide a valid mobile number. Example: 0821234567','error');
                        return;
                    }
                }
                cmp.set('v.isPreview',true);
                this.prifixZero(cmp,selectedContact);

            }

        }
        else {
            this.showMyToast(cmp,'Please provide valid SA ID/passport number.','error');
        }
    },
    prifixZero:function (cmp,selectedContact) {

        for(let i=0;i<selectedContact.length;i++) {
            if(selectedContact[i].mobileNumber) {
                if (selectedContact[i].mobileNumber.substring(0, 3) == '+27') {
                    selectedContact[i].mobileNumber = '0' + selectedContact[i].mobileNumber.substring(3);
                } else if (selectedContact[i].mobileNumber.substring(0, 2) == '27') {
                    selectedContact[i].mobileNumber = '0' + selectedContact[i].mobileNumber.substring(2);
                } else if (selectedContact[i].mobileNumber.substring(0, 1) == '0') {
                    selectedContact[i].mobileNumber = selectedContact[i].mobileNumber.substring(0);
                } else if (isNaN(selectedContact[i].mobileNumber) || (selectedContact[i].mobileNumber.substring(0, 1) != '0' && selectedContact[i].mobileNumber.substring(0, 2) != '27' && selectedContact[i].mobileNumber.substring(0, 3) != '+27')) {
                    selectedContact[i].mobileNumber = '0' + selectedContact[i].mobileNumber.substring(0);
                }
            }
        }
        cmp.set('v.selectedContact',selectedContact);
    },
    isNotValidMobileNumber:function (mobile_input) {

        if(mobile_input) {
            if (mobile_input.substring(0, 3) == '+27') {
                if (mobile_input.length != 12 || isNaN(mobile_input.substring(3))) {
                    return true;
                } else {
                    return false;
                }
            } else if (mobile_input.substring(0, 2) == '27') {
                if (mobile_input.length != 11 || isNaN(mobile_input.substring(2))) {
                    return true;
                } else {
                    return false;
                }
            } else if (mobile_input.substring(0, 1) == '0') {
                if (mobile_input.length != 10 || isNaN(mobile_input)) {
                    return true;
                } else {
                    return false;
                }
            } else if (isNaN(mobile_input) || (mobile_input.substring(0, 1) != '0' && mobile_input.substring(0, 2) != '27' && mobile_input.substring(0, 3) != '+27')) {
                if (mobile_input.length != 9 || isNaN(mobile_input)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        else {
            return true;
        }

    },
    isClientRolesMet:function (selectedContact) {

        let minRoles = ['KYC Contact','Authorised Person'];
        let isKYC = false;
        let isAuth = false;
        for(let i in selectedContact) {
            let roleList = selectedContact[i].contactRoleClient.split("/");
            if(selectedContact[i].contactRoleClient){

                for (let index in roleList){

                    if(minRoles[0]==roleList[index]){
                        isKYC=true;
                    }
                    else if(minRoles[1]==roleList[index]){
                        isAuth=true;
                    }
                }

            }
            if(isAuth&&isKYC)
                return (isAuth&&isKYC);
        }
        return (isAuth&&isKYC);
    },
    isInitiatingDirectorSelected : function (cmp) {
        let selectedContact = cmp.get('v.selectedContact');
        for(let x in selectedContact){

            if(selectedContact[x].initiatingDirector)
                return true;


        }
        return false;
    }
});