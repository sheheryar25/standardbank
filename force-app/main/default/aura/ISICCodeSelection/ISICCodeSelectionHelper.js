/**
 * Created by joracki on 03.10.2018.
 */
({
    doInit : function(component){
        var columns = [
            {label: 'ISIC Code', fieldName: 'Name', type: 'text', initialWidth: 150},
            {label: 'CIF ISIC Description', fieldName: 'CIF_ISIC_Description__c', type: 'text'}
        ]

        var getFieldAttributes = component.get('c.getFieldAttributes');

        getFieldAttributes.setCallback(this, function(response){
            if(component.isValid()){
                var state = response.getState();
                if(state=="SUCCESS"){
                    component.set("v.attributes",response.getReturnValue());
                }
                else if (state === "ERROR") {
                    console.log(response.getError());
                }
            }
        });

        $A.enqueueAction(getFieldAttributes);

        component.set("v.columns", columns);

    },

    getData : function(component){
        var getIsicCodes = component.get("c.getIsicCodes");
        var record = component.get("v.record");

        var clientSector = component.get("v.clientSector");
        var clientSubSector = component.get("v.clientSubSector");

        if(record == null
            ||  record.Client_Sector__c == null
            ||  record.Client_Sub_Sector__c == null
            || (record.Client_Sector__c == clientSector
                    && record.Client_Sub_Sector__c == clientSubSector))
            return;

        component.set("v.clientSector", record.Client_Sector__c);
        component.set("v.clientSubSector", record.Client_Sub_Sector__c);

        getIsicCodes.setParams({
           "clientSector" : record.Client_Sector__c
           ,"clientSubSector" : record.Client_Sub_Sector__c
        });

        getIsicCodes.setCallback(this, function(response){
             if(component.isValid()){
                var state = response.getState();
                if(state === "SUCCESS"){
                      var results  =  response.getReturnValue();
                      var record = component.get("v.record");

                     var selectedRows = [];
                     var record = component.get("v.record");

                     if(record.Industry_Code__c != null){
                          selectedRows.push(record.Industry_Code__c);
                     }

                     // the line below is a workaround for known lightning:dataTable issue
                     //selectedRows component attribute should be set instead
                     component.find("codesTable").set("v.selectedRows", selectedRows);
                     component.set("v.codesOptions", results);
                     component.set("v.data", results);
                     this.setTableData(component);

                }
                else if(state === "ERROR") {
                    console.log("ERROR: " + response.getError());
                }
            }
        });

        $A.enqueueAction(getIsicCodes);
    },

    updateRecord : function(component, fieldName, fieldValue){
        if(fieldName){
            var record = component.get("v.record");
            record[fieldName] = fieldValue;
            component.set("v.record", record);
        }
    },

    fireRecordFieldChangeEvent : function(component){
        var componentAction = $A.get("e.c:RecordFieldChange");
        var selectedRows = component.find("codesTable").getSelectedRows();
        var selectedRowValue = selectedRows[0] == null ? null: selectedRows[0].Name;

        componentAction.setParams({
            'fieldName': "Industry_Code__c"
            ,'fieldValue' :  selectedRowValue
            ,'id' : component.get("v.record").Id
        });

        componentAction.fire();
    },

    setTableData : function(component){
        var codesTable = component.find("codesTable");
        var tableData = component.get("v.editMode") ? component.get("v.codesOptions") : codesTable.getSelectedRows() ;
        component.set("v.data", tableData)
    }
})