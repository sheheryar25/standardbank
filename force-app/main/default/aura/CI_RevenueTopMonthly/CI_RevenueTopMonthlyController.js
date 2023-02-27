({
    doInit: function (component, event, helper) {
        var revenueService = component.find("revenue_service");

        revenueService.getPortfolioMonthlyRevVariance($A.getCallback(function (error, monthlyRevenueData) {
            if (!error) {
                //Order by highest variance
                sortedMonthlyRevenueVariance = monthlyRevenueData.cardObjectList.sort(function (a, b) {
                    aPercentVariance = a.PercentVariance ? +a.PercentVariance : 0;
                    bPercentVariance = b.PercentVariance ? +b.PercentVariance : 0;
                    return aPercentVariance > bPercentVariance ? -1 : aPercentVariance < bPercentVariance ? 1 : 0;
                });

                //Add month name, format percent, and colour class
                sortedMonthlyRevenueVariance.forEach(element => {
                    element.CurrentMonthRevenue = element.CurrentMonthRevenue ? +element.CurrentMonthRevenue : 0;
                    element.PreviousMonthRevenue = element.PreviousMonthRevenue ? +element.PreviousMonthRevenue : 0;

                    //Colour
                    var symbol;
                    if (element.CurrentMonthRevenue >= element.PreviousMonthRevenue) {
                        element.colourClass = 'green';
                        symbol = "+";
                    }
                    else {
                        element.colourClass = 'red';
                        symbol = "-";
                    }

                    //Format
                    element.CurrentMonthRevenue = helper.amountFormatter(element.CurrentMonthRevenue, 2);
                    element.PreviousMonthRevenue = helper.amountFormatter(element.PreviousMonthRevenue, 2);

                    //Percent
                    element.PercentVariance = helper.percentageFormatter(element.PercentVariance);
                    element.PercentVariance = element.PercentVariance == "N/A" ? null : symbol + element.PercentVariance;

                    //Month
                    element.CurrentMonth = helper.getMonthName(element.CurrentMonth);
                    element.PreviousMonth = helper.getMonthName(element.PreviousMonth);
                });

                component.set("v.sortedMonthlyRevenueVariance", sortedMonthlyRevenueVariance.slice(0, component.get("v.listSize")));
            }
        }));

        revenueService.getRevBudgetDate($A.getCallback(function (error, revSnapshotDate) {
            if (!error) {
                component.set("v.revenueSnapshotDate", helper.dateFormatter(helper.dateParser(revSnapshotDate.cardDataMap.Month_End_Snapshot_Date__c)));
            }
        }));
    },

    handleNameClick : function(component, event, helper) {
        let recordId = event.target.getAttribute('data-recordId');
        let navigateToSObject = $A.get("e.force:navigateToSObject");
        if (navigateToSObject) {
            navigateToSObject.setParams({
                recordId : recordId
            });
            navigateToSObject.fire();
        }
    }
})