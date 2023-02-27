/**
 * Created by Chibuye Kunda on 2019/11/20.
 */
({
    init: function (cmp, event, helper) {

    },
    dataTableEventEmit : function(cmp, event, helper) {

        let tempData = event.getParam("arguments");
        let numOfRows = 0;
        let records = null;
        try{

            if(tempData.recordList.length>0) {

                records = helper.resolveNestedData(cmp, tempData.recordList);
            }

            numOfRows = records!=null ? records.length :0;
            cmp.set('v.data',records);
            cmp.set('v.numOfRows',numOfRows);
            if(numOfRows==0){
                cmp.set('v.tableHeight','40px');// this is for making the table body to not look big
            }
            else{
                cmp.set('v.tableHeight','200px');
            }

        }
        catch(e){

            cmp.set('v.error',{iserror:true,message:e.message});
        }



    },
    handleRowAction: function (cmp, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');

        switch (action.name) {

            case 'show_agenda_details':
                let show_agenda_details = cmp.getEvent("MeetingEvent");
                show_agenda_details.setParams({
                    "data" : JSON.stringify({event_type:'show_agenda_details',data:row}) });
                show_agenda_details.fire();
                break;
            case 'remove_agenda_details':
                let remove_agenda_details = cmp.getEvent("MeetingEvent");
                remove_agenda_details.setParams({
                    "data" : JSON.stringify({event_type:'remove_agenda_details',data:row}) });
                remove_agenda_details.fire();
                break;
            case 'editTask':
                let editTask = cmp.getEvent("MeetingEvent");
                editTask.setParams({
                    "data" : JSON.stringify({event_type:'editTask',data:row}) });
                editTask.fire();
                break;
            case 'viewTask':
                let viewTask = cmp.getEvent("MeetingEvent");
                viewTask.setParams({
                    "data" : JSON.stringify({event_type:'viewTask',data:row}) });
                viewTask.fire();
                break;
            case 'delete':
                helper.removeRow(cmp, row);
                break;
        }
    }
});