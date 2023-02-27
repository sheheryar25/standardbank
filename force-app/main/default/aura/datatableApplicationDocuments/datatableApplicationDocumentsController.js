({
    init: function (cmp, event, helper) {

        var column1Label = cmp.get('v.column1_label');
        var column1FieldName = cmp.get('v.column1_fieldName');
        var column1Type = cmp.get('v.column1_type');

        var column2Label = cmp.get('v.column2_label');
        var column2FieldName = cmp.get('v.column2_fieldName');
        var column2Type = cmp.get('v.column2_type');

        cmp.set('v.mycolumns', [
            {label: column1Label, fieldName: column1FieldName, type: column1Type, sortable: true},
            {label: column2Label, fieldName: column2FieldName, type: column2Type, initialWidth: 800, sortable: true},
        ]);
    },
})