/**
 * Created by Emmanuel Nocks Mulea on 2020/10/06.
 */

({
    doInit:function(cmp,event,helper){
        helper.getListOfCountryCodes(cmp);
    },
    openDropDown: function(cmp,event,helper) {
        helper.openDropDown(cmp,event);
    },
    closeDropDown: function(cmp,event,helper) {
        helper.closeDropDown(cmp);
    },
    select:function (cmp,event,helper) {
        let idx = event.target.id;
        let selCountry = cmp.get('v.listOfCountryCodes');
        let selectedCountry = cmp.get('v.selectedCountry');
        selectedCountry.flagName = selCountry[idx].flagName;
        selectedCountry.Name = selCountry[idx].flagName;
        selectedCountry.phone_code = selCountry[idx].Country_Phone_Code__c;
        cmp.set('v.selectedCountry',selectedCountry);
        helper.closeDropDown(cmp);
    }
    ,
    onkeydown: function (cmp,event,helper) {
        let mobile_input = event.target.value;
        cmp.set('v.mobileNumber',mobile_input);

    },
    onblur:function (cmp,event,helper) {

        helper.validateSAMobileNumber(cmp,cmp.get('v.mobileNumber'));
    }
    ,clearTimeOut:function (cmp,event,helper) {
        helper.clearTimeOutHelper(cmp);
    }
});