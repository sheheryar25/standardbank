({
    processRevenues : function (component){
        var that = this;
        return $A.getCallback(function (error, revenueData){
            if(!error){
                var splitted = that.splitRevenuesByClients(revenueData);
                component.set("v.groupedByClient", splitted);
                component.set("v.groupedByTopParents", splitted.filter(el => el.ClientRecordType === 'TopParent'));
                component.set("v.groupedByImmediateParents", splitted.filter(el => el.ClientRecordType === 'Immediate_Parent'));
                component.set("v.groupedByChildClients", splitted.filter(el => el.ClientRecordType === 'Child'));

                if(splitted.length == 0)
                    $A.util.removeClass(component.find("no_data_msg"), "slds-hide");
            } else {
                console.warn('error: ', error );
            }
            that.showMore(component);
        });
    },
    splitRevenuesByClients : function(revenueData){
        var result = [];
        var i = 0;
        revenueData.forEach( function(element){
            var lastIndex = result.length - 1;
            element.Id = '/'+ element.Id;

            var revenue = parseFloat(element.Revenue);
            var budget = parseFloat(element.Budget);

            if(revenue){
                element.Variance = (revenue / budget) - 1;
            }

            var root;
            if(!result[lastIndex] || result[lastIndex].Id != element.Id){
                root = Object.assign({}, element);
                root._children = []
                root.Revenue = 0;
                root.Budget = 0;
                root.rowId = result.length.toString();
                result.push(root);
            } else {
                root = result[lastIndex];
            }
            element.rowId = root.rowId + '-'+ root._children.length;
            root._children.push(element);
            if(revenue){root.Revenue += revenue;}
            if(budget) {
                root.Budget += budget;
            }
            if(root.Revenue){
                root.Variance = (root.Revenue / root.Budget) - 1;
            }
            element.Name = element.Trading_Division__c;

           if(revenue == 0 && budget != 0){
                root.Variance = (0 - budget) / budget;
            }
            root.UserCurrency = $A.get("$Locale.currency");
//            root.Budget = root.Budget.toString() ;
//               console.log(root.Budget.toString() + root.UserCurrency);





        });
        result.sort(function(a,b){
            return (Math.abs(b.Variance) - Math.abs(a.Variance));
        });
        result.sort(function(a,b) {
           var sortOrder = 0;
           if (a.Name < b.Name) {
               sortOrder = -1;
           }
           else if (a.Name > b.Name) {
               sortOrder = 1;
           }
           return sortOrder;
        });

        console.log(result);
        return result;
    },
    buildColumns : function(component){
        var that = this;
        component.set("v.columns",[
            {
                label: 'Client Name',
                fieldName: 'Id',
                type: 'url',
                typeAttributes:
                {
                    label:
                    {
                        fieldName : 'Name'
                    },
                    target : {
                        fieldName : 'Id'
                    }
                }
            },
            {
                label: 'Revenue',
                fieldName: 'Revenue',
                type: 'currency',
                typeAttributes:
                {
                    maximumFractionDigits : 2,
                    currencyDisplayAs: 'code'
                },
                cellAttributes:
                {
                    alignment: 'left'
                }
            },
            {
                label: 'Budget',
                fieldName: 'Budget',
                type: 'currency',
                typeAttributes:
                {
                    maximumFractionDigits : 2,
                    currencyDisplayAs: 'code'
                },
                cellAttributes:
                {
                    alignment: 'left'
                }
            },
            {
                label: 'Run Rate %',
                fieldName: 'Variance',
                type: 'percent',
                cellAttributes:
                {
                    alignment: 'left'
                }
            }

        ]);

    },
    showMore : function (component){
        var clientsCount = component.get("v.numberOfClientsPresented");
        clientsCount += $A.get("$Browser.isPhone") ? 20 : 20;
        component.set("v.numberOfClientsPresented", clientsCount);
        if ($A.get("$Browser.isPhone") === false){
            this.treeGridLoadMore(component, clientsCount);
        }

    },
    treeGridLoadMore : function (component, howMany) {
        var topParentsTree = component.find("topParentsTree");
        var topParentsData = component.get("v.groupedByTopParents");
        if (topParentsTree && topParentsData){
            topParentsTree.set("v.data", topParentsData.slice(0, howMany));
        }

        var immediateParentsTree = component.find("immediateParentsTree");
        var immediateParentsData = component.get("v.groupedByImmediateParents");
        var howManyImmediate = howMany - topParentsData.length;
        if (immediateParentsTree && immediateParentsData && howMany > topParentsData.length) {
            immediateParentsTree.set("v.data", immediateParentsData.slice(0, howManyImmediate));
        }

        var childClientsTree = component.find("childClientsTree");
        var childClientsData = component.get("v.groupedByChildClients");
        var howManyChild = howMany - (topParentsData.length + immediateParentsData.length);
        if (childClientsTree && childClientsData && howMany > topParentsData.length + immediateParentsData.length) {
            childClientsTree.set("v.data", childClientsData.slice(0, howManyChild));
        }
    }

})