/**
 * Created by Chibuye Kunda on 2019/11/25.
 */

({

    init: function (cmp, event, helper) {


        cmp.set('v.lookUps',['Related_NBAC__c']);

        cmp.set('v.columns', [
            {label: 'Remove', type: 'button', initialWidth: 70, typeAttributes:
                    {title: 'Click to remove',variant:"base", name: 'remove_agenda_details',iconName: 'utility:close',class: 'agenda-btn-icon'},

                    },
            {label: 'NBAC Name', fieldName: 'Related_NBAC__c', type: 'url', typeAttributes: { label: { fieldName: 'Related_NBAC__r.Name' }, target: '_blank', tooltip: 'go to the record' }},
            { label: 'Client Coordinator' , fieldName: 'Related_NBAC__r.Group_Parent_Client_Coordinator__c', type: 'text'},
            { label: 'MNPI', cellAttributes: {
                    iconName: { fieldName: 'Related_NBAC__r.MNPI__c' },iconPosition: 'right'}},

            { label: 'Milestone', fieldName: 'Related_NBAC__r.Milestone__c', type: 'text'},
            {label: 'Action', type: 'button', initialWidth: 120, typeAttributes:
                    { label: 'View', title: 'Click to View',variant:"base", name: 'show_agenda_details', class: 'btn_next'}}
        ]);

       helper.getAgendaList(cmp,event);
       helper.getAgendaListforNothing(cmp,event);
    },
    clickToRefresh: function (cmp, event, helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {

            helper.createagendarecords(cmp,event);
        }
        else {
            helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    userHasAccess:function (cmp,event,helper) {
        let tempData = event.getParam("arguments");
        let data =tempData.perm.data;
        cmp.set('v.access',data);
    }
    ,
    reload:function (cmp,event, helper) {

        helper.getAgendaList(cmp,event);
    }
});