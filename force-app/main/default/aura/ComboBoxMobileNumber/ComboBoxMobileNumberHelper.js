/**
 * Created by Emmanuel Nocks Mulea on 2020/10/15.
 */

({
    showMyToast : function(cmp,message, type) {
        cmp.find('comboMobile_notifLib').showToast({
            "variant": type,
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
    getListOfCountryCodes: function (cmp) {
        let action = cmp.get("c.getListOfCountryCodes");
        action.setCallback(this,function (res) {
            let state = res.getState();
            if(state==="SUCCESS"){
                let data = res.getReturnValue();
                for(let index in data){
                    data[index].flagName = data[index].Name.replace(' ','-');
                    data[index].Country_Phone_Code__c = isNaN(Number(data[index].Country_Phone_Code__c))?data[index].Country_Phone_Code__c:Number(data[index].Country_Phone_Code__c);

                }
                cmp.set('v.listOfCountryCodes',data);
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
    closeDropDown:function (cmp) {
        let cmpTarget = cmp.find('sb-drop-down-mobile');
        let elemOpenCMps = cmpTarget.getElement();
        let timeout = setTimeout(function(){
            elemOpenCMps.classList.remove('slds-is-open');
            elemOpenCMps.classList.remove('slds-has-focus')
        },250);
        cmp.set('v.timeout',timeout);

    },
    clearTimeOutHelper : function(cmp){
        clearTimeout(cmp.get('v.timeout'));

    },
    openDropDown:function (cmp,event) {
        let parentClass = event.currentTarget.parentElement.parentElement;
        $A.util.toggleClass(parentClass, 'slds-is-open');
    },
    validateSAMobileNumber:function (cmp,mobile_input) {

        let selectedCountry = cmp.get('v.selectedCountry');
        let index  = cmp.get('v.index');
        if(selectedCountry.Name=='South Africa' && mobile_input){
            if(mobile_input.substring(0, 3)=='+27'){
                if(mobile_input.length!=12 || isNaN(mobile_input.substring(3))){
                    cmp.set('v.isNotValidMobileNumber',true);
                    cmp.set('v.mobile_input_index',index);
                }
                else {
                    cmp.set('v.isNotValidMobileNumber',false);
                }
            }
            else if(mobile_input.substring(0, 2)=='27'){
                if(mobile_input.length!=11 || isNaN(mobile_input.substring(2))){
                    cmp.set('v.isNotValidMobileNumber',true);
                    cmp.set('v.mobile_input_index',index);
                }
                else {
                    cmp.set('v.isNotValidMobileNumber',false);
                }
            }
            else if(mobile_input.substring(0, 1)=='0'){
                if(mobile_input.length!=10 || isNaN(mobile_input)){
                    cmp.set('v.isNotValidMobileNumber',true);
                    cmp.set('v.mobile_input_index',index);
                }
                else {
                    cmp.set('v.isNotValidMobileNumber',false);
                }
            }
            else if(isNaN(mobile_input)|| (mobile_input.substring(0, 1)!='0' && mobile_input.substring(0, 2)!='27' && mobile_input.substring(0, 3)!='+27')){
                if(mobile_input.length!=9 || isNaN(mobile_input)){
                    cmp.set('v.isNotValidMobileNumber',true);
                    cmp.set('v.mobile_input_index',index);
                }
                else {
                    cmp.set('v.isNotValidMobileNumber',false);
                }
            }

        }

    }
});