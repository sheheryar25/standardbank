/**
 * Created by Emmanuel Mulea Nocks on 2020/06/10.
 */

({
    section : function(cmp, event, helper) {
        let idx = event.target.id;
        helper.collapseSection(cmp,'collapse_section_'+idx,idx);
    }
    ,
    doInit:function(cmp,event,helper){
        helper.getOnboardingWithRelatedRec(cmp);
    },
    dropDownMenu:function (cmp,event,helper) {
        helper.dropDownMenu(cmp,'open');
    }
    ,
    checkStatus:function (cmp,event,helper) {
        helper.dropDownMenu(cmp,'open');
        helper.getSignatoryStatus(cmp);
    }
});