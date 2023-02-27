({
    doInit: function (component, event, helper) {
        var revenueService = component.find("revenue_service");

        revenueService.getPortfolioVariance($A.getCallback(function (error, revenueVarianceData) {
            if (!error) {
                //Order by highest variance
                var sortedRevenueVariance = revenueVarianceData.cardObjectList.sort(function (a, b) {
                    
                    let aPercentVariance = a.PercentVariance ? +a.PercentVariance : 0;
                    let bPercentVariance = b.PercentVariance ? +b.PercentVariance : 0;
                    //Convert to positive if negative, so we sort it by highest value in either positive or negative direction
                    aPercentVariance = aPercentVariance >= 0 ? aPercentVariance : aPercentVariance * -1;
                    bPercentVariance = bPercentVariance >= 0 ? bPercentVariance : bPercentVariance * -1;

                    return aPercentVariance > bPercentVariance ? -1 : aPercentVariance < bPercentVariance ? 1 : 0;
                });

                //Add month name, format percent, and colour class
                sortedRevenueVariance.forEach(element => {
                    element.CurrentYearRevenue = element.CurrentYearRevenue ? +element.CurrentYearRevenue : 0;
                    element.PreviousYearRevenue = element.PreviousYearRevenue ? +element.PreviousYearRevenue : 0;

                    //Colour
                    var symbol;
                    if (element.CurrentYearRevenue >= element.PreviousYearRevenue) {
                        element.colourClass = 'green';
                        symbol = "+";
                    }
                    else {
                        element.colourClass = 'red';
                        symbol = "-";
                    }

                    //Format
                    element.CurrentYearRevenue = helper.amountFormatter(element.CurrentYearRevenue, 2);
                    element.PreviousYearRevenue = helper.amountFormatter(element.PreviousYearRevenue, 2);

                    //Percent
                    element.PercentVariance = helper.percentageFormatter(element.PercentVariance);
                    element.PercentVariance = element.PercentVariance == "N/A" ? null : symbol + element.PercentVariance;

                    //Month
                    element.CurrentMonth = helper.getMonthName(element.CurrentMonth);
                    element.PreviousMonth = helper.getMonthName(element.PreviousMonth);
                });

                if(sortedRevenueVariance.length == 0)
                    component.set("v.isEmpty", true);

                component.set("v.sortedRevenueVariance", sortedRevenueVariance.slice(0, component.get("v.listSize")));
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