/**
 * Created by Chibuye Kunda on 2019/11/25.
 */

({

    init: function (cmp, event, helper) {

        var btnActions = [
            { label: 'View', name: 'show_details' }];

        cmp.set('v.lookUps',[{field:'Id',prefix:''}]);
        cmp.set('v.dates',['lastModifiedDate']);

        cmp.set('v.columns', [
            {label: 'Action',initialWidth: 120, fieldName: 'Id', type: 'url', typeAttributes: { label: 'View', target: '_blank',class:'download_color', tooltip: 'download' }},
            { label: 'Title', fieldName: 'Name', type: 'text'},
            { label: 'Last Modified', fieldName: 'LastModifiedDate', type: 'text'},
            { label: 'Created by', fieldName: 'CreatedBy.Name', type: 'text'},
        ]);


    },

    dataTableMethodAttachment : function(cmp, event, helper) {

        let tempData = event.getParam("arguments");
        cmp.set('v.nbacId',tempData.nbacdata.nbacId);
        cmp.set('v.eventId',tempData.nbacdata.eventId);

        helper.getListOfAttachments(cmp,event);
  }
,
    uploadFile:function (cmp,event,helper) {
        let access = JSON.parse(cmp.get('v.access'));

        if(access.hasAccess || !(access.isSubmission || access.isCommittee)) {

            cmp.set('v.isUploadFile', true);
        }
        else {

            helper.showMyToast('You do not have the level of access necessary to perform the operation you requested.', 'error');
        }
    },
    handleUploadFinished: function (cmp, event,helper) {
        cmp.set('v.isUploadFile', false);
        // This will contain the List of File uploaded data and status
        let uploadedFiles = event.getParam("files");
        helper.uploadFile(cmp,event,uploadedFiles[0]);
    }
    ,
    closeFileAttach:function (cmp,event,helper) {
        cmp.set('v.isUploadFile', false);
    },
    userHasAccess:function (cmp,event,helper) {
        let tempData = event.getParam("arguments");
        let data =tempData.perm.data;
        cmp.set('v.access',data);
    }
    ,
});