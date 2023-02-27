/**
 * Created by joracki on 03.10.2018.
 */
({
    doInit : function(component, event, helper){
        helper.doInit(component);
    },

    handleRecordLoaded : function(component, event, helper){
       helper.getData(component);
    },

    handleEditModeChange : function(component, event, helper){
        helper.setTableData(component);
    },

    handleSelectedRowsChange : function(component, event, helper){
       var selectedRows = component.get('v.selectedRows');

       helper.updateRecord(component, "Industry_Code__c", selectedRows[0] == null ? null: selectedRows[0]);
       helper.fireRecordFieldChangeEvent(component);
     },

    handleRowSelection : function(component, event, helper){
        var tableSelectedRows = component.find("codesTable").getSelectedRows();

        var selectedRows = [];
        for (var i = 0; i < tableSelectedRows.length; i++) {

            selectedRows.push(tableSelectedRows[i].Name);
        }
        component.set('v.selectedRows', selectedRows);

    },

    handleRecordFieldChange : function(component, event, helper) {
        var fieldName = event.getParam('fieldName');

        if(event.getParam('id')
            && component.get('v.record')
            && event.getParam('id') == component.get('v.record').Id){

            if(fieldName == "Client_Sub_Sector__c"
                && component.get('v.clientSubSector') != event.getParam('fieldValue')){

                helper.updateRecord(component, "Client_Sub_Sector__c", event.getParam('fieldValue'));
                component.find("codesTable").set("v.selectedRows", []);
                helper.getData(component);
            }

            if(fieldName == "Client_Sector__c"
                && component.get('v.clientSector') != event.getParam('fieldValue')){

                helper.updateRecord(component, "Client_Sector__c", event.getParam('fieldValue'));
                component.find("codesTable").set("v.selectedRows", []);
                helper.getData(component);
            }
        }
    },

    handleEdit : function(component, event, helper) {
        var attributes = component.get('v.attributes');

        if(attributes == null || !attributes.isUpdateable)
            return;

        component.set("v.editMode", true);

        var componentAction = $A.get("e.c:ComponentAction");
        componentAction.setParams({'data':{'name' : 'edit'}});
        componentAction.fire();

        var componentAction = $A.get("e.c:ComponentAction");
        componentAction.setParams({'data':{'name' : 'lock'}});
        componentAction.fire();
    },

    handleComponentAction: function(component,event, helper){

        var attributes = component.get('v.attributes');

        if(attributes == null || !attributes.isUpdateable)
            return;

        if(component
            && event.getParam('data')
            && event.getParam('data').name){

            var actionName = event.getParam('data').name;

            if(actionName=='edit'){
                component.set("v.editMode", true);
            }else if(actionName=='cancel' || actionName=='save'){
                component.set("v.editMode", false);
            }
        }
    }
})