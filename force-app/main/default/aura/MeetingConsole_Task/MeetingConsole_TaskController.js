/**
 * Created by Chibuye Kunda on 2019/11/25.
 */

({

    init: function (cmp, event, helper) {

        var btnActions = [
            { label: 'Show details', name: 'show_details' },
            { label: 'Delete', name: 'delete' }];

        cmp.set('v.lookUps',['Related_NBAC__c']);

        cmp.set('v.columns', [
            {label: 'Action', type: 'button', initialWidth: 120, typeAttributes:
                    { label: 'Edit', title: 'Click to Edit',variant:"base", name: 'editTask', class: 'btn_next'}},
            {label: 'Subject', type: 'button', initialWidth: 120, typeAttributes:
                    {label: { fieldName: 'Subject' }, title: { fieldName: 'Subject' },variant:"base", name: 'viewTask', class: 'slds-truncate'}},
            { label: 'Responsible Person', fieldName: 'Owner.Name', type: 'text'},
            { label: 'Due Date', fieldName: 'ActivityDate', type: 'date'},
            { label: 'Status', fieldName: 'Status', type: 'text'}
        ]);

           },

    dataTableMethodViewTask : function(cmp, event, helper) {
        let tempData = event.getParam("arguments");
        let navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": tempData.task.taskId,
            "slideDevName": "related"
        });
        navEvt.fire();
    },
    dataTableMethodEditTask : function(cmp, event, helper) {
        let tempData = event.getParam("arguments");

        let editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": tempData.task.taskId
        });
        editRecordEvent.fire();
    },
    dataTableAddTask : function(cmp, event, helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {
            console.log(cmp.get('v.nbacId'));
            let createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": "Task",
                "defaultFieldValues": {
                    'WhatId': cmp.get('v.nbacId')
                },
                "navigationLocation": 'LOOKUP',
                "panelOnDestroyCallback": function () {
                    helper.getTaskList(cmp, event);
                }
            });
            createRecordEvent.fire();
        }
        else {

            helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    dataTableMethodTask : function(cmp, event, helper) {

        let tempData = event.getParam("arguments");
console.log('== ',tempData.nbacdata.nbacId)
        cmp.set('v.nbacId',tempData.nbacdata.nbacId);
        cmp.set('v.gpClientName',tempData.nbacdata.gpClientName);
        helper.getTaskList(cmp,event);
    },
    handleTaskToastEvent : function(cmp, event, helper) {
        let toastMessageParams = event.getParams();
        let message = toastMessageParams.message;

        if(message!=undefined) {
            if (message.includes('Task') && message.includes('was saved')) {
                helper.getTaskList(cmp,event);
            }
        }
    },
    userHasAccess:function (cmp,event,helper) {
        let tempData = event.getParam("arguments");
        let data =tempData.perm.data;
        cmp.set('v.access',data);
    }
    ,

});