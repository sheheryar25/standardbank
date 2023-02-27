({
    evaluateSearch : function(cmp, phrase) {
        cmp.set('v.isSearchValid', (phrase && phrase.length > 2));
    },
    evaluateData : function(cmp, helper) {
        var data 	= cmp.get('v.data');

        if (data) {
            cmp.set('v.isLoading', false);
            cmp.set('v.dataSorted', helper.filterData('', data));
        }
    },
    filterData : function(name, data) {
        // Result object
        var result = [];

        if (data && data.length != 0) {
            // Filter without ET
            if (name && name != '') {
                result = data.filter(function (item) {
                    return (item.Name.toLowerCase().indexOf(name.toLowerCase()) != -1);
                });
            }
        }

        return result;
    }
})