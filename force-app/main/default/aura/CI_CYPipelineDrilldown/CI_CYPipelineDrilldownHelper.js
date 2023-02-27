({
    setColumns: function (component) {
        var columns = [
            {
                label: 'Client Name',
                fieldName: 'id',
                type: 'url',
                typeAttributes:
                {
                    label:
                    {
                        fieldName : 'recordName'
                    },
                    target : {
                        fieldName : 'id'
                    }
                }
            },
            {
                type: 'currency',
                fieldName: 'revenue',
                label: 'CY Projected Revenue',
                typeAttributes:
                {
                    currencyDisplayAs: 'code'
                },
                cellAttributes:
                                     {
                                         alignment: 'left'
                                     }
            },
            {
                type: 'percent',
                fieldName: 'probability',
                label: 'Probability',
                cellAttributes:
                                    {
                                        alignment: 'left'
                                    }
            },
            {
                type: 'date',
                fieldName: 'closeDate',
                label: 'Close Date'
            }
        ];
        component.set('v.gridColumns', columns);
    },
    buildGridData: function (component, oppRecs) {
        var helper = this;
        //Remove records with zero revenue amount
        oppRecs = oppRecs.filter(item => item.Current_Year_Revenue_Currency__c > 0);
        
        var parentRecs = helper.getParentRecs(component, oppRecs);
        parentRecs.forEach(parent => {
            let childRecs = helper.getChildRecs(component, parent.clientId, oppRecs);
            parent._children = childRecs;
        });


        component.set("v.fullGridData", parentRecs);

        if(parentRecs.length ==0 ){
            $A.util.removeClass(component.find("no_data_msg"), "slds-hide");
        }
        //Only show certain amount of recs by default
        component.set("v.gridData", parentRecs.slice(0, component.get("v.numOfRecordsPerPage")));

        if(parentRecs.length > component.get("v.numOfRecordsPerPage"))
            $A.util.removeClass(component.find("show_more"), "slds-hide");
    },
    getParentRecs: function (component, oppRecs) {
        var helper = this;
        var uniqueClientIds = helper.getUniqueFieldValues("AccountId", oppRecs);

        var parentRecs = [];
        uniqueClientIds.forEach(clientId => {
            parentRecs.push(helper.createParentRec(component, clientId, oppRecs));
        });

        parentRecs = helper.simpleSort(parentRecs, "revenue", true);

        return parentRecs;
    },
    getUniqueFieldValues: function (fieldName, objArr) {
        var uniqueFieldValues = [];
        objArr.forEach(obj => {
            if (uniqueFieldValues.indexOf(obj[fieldName]) == -1)
                uniqueFieldValues.push(obj[fieldName]);
        });
        return uniqueFieldValues;
    },
    getChildRecs: function (component, clientId, oppRecs) {
        var childRecs = oppRecs
            .filter(item => item.AccountId == clientId)
            .map(item => {
                return {
                    id: '/'+ item.Id,
                    recordName: item.Name,
                    revenue: item.Current_Year_Revenue_Currency__c,
                    probability: item.Probability / 100,
                    closeDate: item.CloseDate,
                    currencyIsoCode: $A.get("$Locale.currency")
                }
            });

        var helper = this;
        helper.simpleSort(childRecs, "revenue", true);

        return childRecs;
    },
    createParentRec: function (component, accountId, oppRecs) {
        var accountOppRecs = oppRecs.filter(x => x.AccountId == accountId);

        var clientName = accountOppRecs[0].Account.Name;
        var clientId = accountOppRecs[0].AccountId;

        var totalRevenue = accountOppRecs.map(function (item) {
            return item.Current_Year_Revenue_Currency__c ? item.Current_Year_Revenue_Currency__c : 0;
        }).reduce(function (a, b) { return +a + +b; }, 0);

        //Add "/" to the id, so the URL type column directs record page
        return {
            id: '/'+ clientId,
            clientId: clientId,
            recordName: clientName,
            revenue: totalRevenue,
            currencyIsoCode: $A.get("$Locale.currency")
        };
    }
})